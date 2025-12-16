#!/bin/bash

clean_credentials_file() {
    local profile="${1:-$AWS_PROFILE}"
    local creds_file="$HOME/.aws/credentials"

    if [ -f "$creds_file" ] && grep -q "^\[$profile\]" "$creds_file"; then
        echo "AWS SSO checker: 🧹 Cleaning expired credentials for profile $profile"
        # Create backup
        cp "$creds_file" "$creds_file.bak.$(date +%s)"
        # Remove the profile section
        awk -v profile="$profile" '
            /^\[/ { in_target = (substr($0, 2, length($0) - 2) == profile) }
            !in_target { print }
            in_target && /^\[/ && (substr($0, 2, length($0) - 2) != profile) { in_target = 0; print }
        ' "$creds_file" > "$creds_file.tmp" && mv "$creds_file.tmp" "$creds_file"
    fi
}

perform_sso_login() {
    local profile="${1:-$AWS_PROFILE}"
    echo "AWS SSO checker: 🔐 Performing AWS SSO login..."
    if aws sso login --profile "$profile"; then
        echo "AWS SSO checker: ✅  AWS SSO login successful"
        # Clean up any conflicting credentials after successful login
        clean_credentials_file "$profile"
        return 0
    else
        echo "AWS SSO checker: ❌ AWS SSO login failed"
        return 1
    fi
}

check_sso_expiry() {
    local profile="${1:-$AWS_PROFILE}"

    # Skip SSO check in CI environment
    if [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ]; then
        echo "AWS SSO checker: 🤖 CI environment detected, skipping SSO check"
        return 0
    fi

    # Check if AWS_PROFILE is set
    if [ -z "$profile" ]; then
        echo "AWS SSO checker: ❌ Error: AWS_PROFILE environment variable is not set or empty"
        echo "AWS SSO checker: 💡 Suggestion: Copy mise.local.toml.example to mise.local.toml and configure your AWS profile"
        return 1
    fi

    echo "AWS SSO checker: 🔍 Starting AWS SSO token validation for profile: $profile"

    # Get SSO start URL from config file directly (faster than aws configure)
    local config_file="$HOME/.aws/config"
    local sso_start_url
    local cache_source

    if [ -f "$config_file" ]; then
        # This awk script now returns either "session:SESSION_NAME" or "url:START_URL"
        # to distinguish between sso-session usage and legacy configuration
        local config_result=$(awk -v target="$profile" '
            /^\[/ {
                type = ""
                if ($0 ~ /^\[profile /) {
                    type = "profile"
                    name = substr($0, 10, length($0)-10)
                } else if ($0 ~ /^\[sso-session /) {
                    type = "session"
                    name = substr($0, 14, length($0)-14)
                } else {
                    type = "profile"
                    name = substr($0, 2, length($0)-2)
                }
                next
            }

            type == "profile" && name == target && /^sso_start_url[ \t]*=/ {
                gsub(/^sso_start_url[ \t]*=[ \t]*/, "")
                direct_url = $0
            }
            type == "profile" && name == target && /^sso_session[ \t]*=/ {
                gsub(/^sso_session[ \t]*=[ \t]*/, "")
                session_ref = $0
            }
            type == "session" && /^sso_start_url[ \t]*=/ {
                gsub(/^sso_start_url[ \t]*=[ \t]*/, "")
                sessions[name] = $0
            }

            END {
                if (session_ref != "") {
                    print "session:" session_ref
                } else {
                    print "url:" direct_url
                }
            }
        ' "$config_file")

        if [[ $config_result == session:* ]]; then
            local session_name=${config_result#session:}
            # For sso-session, cache key is SHA1 of session name
            cache_source="$session_name"
            # We don't strictly need start_url for cache check, but might be useful for debug
            sso_start_url="[session: $session_name]"
            echo "AWS SSO checker: ℹ️  Using SSO session: $session_name"
        else
            local start_url=${config_result#url:}
            # For legacy config, cache key is SHA1 of start URL
            cache_source="$start_url"
            sso_start_url="$start_url"
            echo "AWS SSO checker: ℹ️  Using SSO start URL: $start_url"
        fi
    fi

    if [ -z "$cache_source" ]; then
        echo "AWS SSO checker: No SSO configuration found for profile: $profile"
        return 1
    fi

    # Find the cache file (hashed by cache source - either session name or start URL)
    local cache_key=$(echo -n "$cache_source" | shasum -a 1 | cut -d' ' -f1)
    local cache_file="$HOME/.aws/sso/cache/${cache_key}.json"

    if [ ! -f "$cache_file" ]; then
        echo "AWS SSO checker: No cached credentials found"
        echo "AWS SSO checker: 🔄 Initiating SSO login..."
        perform_sso_login "$profile"
        return $?
    fi

    # Check expiration
    local expires_at=$(jq -r '.expiresAt' "$cache_file" 2>/dev/null)

    if [ -z "$expires_at" ]; then
        echo "AWS SSO checker: Invalid cache file"
        echo "AWS SSO checker: 🔄 Initiating SSO login..."
        perform_sso_login "$profile"
        return $?
    fi

    # Convert to timestamp and compare
    local expiry_epoch=""

    # Try GNU date (Linux)
    if date --version >/dev/null 2>&1; then
        expiry_epoch=$(date -d "$expires_at" +%s 2>/dev/null)
    fi

    if [ -z "$expiry_epoch" ]; then
        local clean_expires_at=$(echo "$expires_at" | sed 's/\.[0-9]*Z/Z/')

        if [[ "$clean_expires_at" == *Z ]]; then
            expiry_epoch=$(date -j -u -f "%Y-%m-%dT%H:%M:%SZ" "$clean_expires_at" +%s 2>/dev/null)
        else
            expiry_epoch=$(date -j -f "%Y-%m-%dT%H:%M:%S" "$clean_expires_at" +%s 2>/dev/null)
        fi
    fi

    local current_epoch=$(date +%s)

    if [ -n "$expiry_epoch" ] && [ "$current_epoch" -lt "$expiry_epoch" ]; then
        local remaining=$(( ($expiry_epoch - $current_epoch) / 60 ))
        echo "AWS SSO checker: ✅  Token valid for ${remaining} more minutes"

        clean_credentials_file "$profile"

        return 0
    else
        echo "AWS SSO checker: ❌ Token expired"
        echo "AWS SSO checker: 🔄 Initiating SSO login..."
        perform_sso_login "$profile"
        return $?
    fi
}

check_sso_expiry