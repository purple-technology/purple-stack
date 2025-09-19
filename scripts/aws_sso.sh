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

    if [ -f "$config_file" ]; then
        sso_start_url=$(awk -v profile="$profile" '
            /^\[/ { current_profile = substr($0, 2, length($0) - 2) }
            /^\[profile / { current_profile = substr($0, 10, length($0) - 10) }
            current_profile == profile && /^sso_start_url/ {
                gsub(/^sso_start_url[ \t]*=[ \t]*/, ""); print; exit
            }
        ' "$config_file")
    fi

    if [ -z "$sso_start_url" ]; then
        echo "AWS SSO checker: No SSO configuration found for profile: $profile"
        return 1
    fi

    # Find the cache file (hashed by start URL)
    local cache_key=$(echo -n "$sso_start_url" | shasum -a 1 | cut -d' ' -f1)
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
    local expiry_epoch=$(date -d "$expires_at" +%s 2>/dev/null || date -j -f "%Y-%m-%dT%H:%M:%S" "${expires_at%%.*}" +%s 2>/dev/null)
    local current_epoch=$(date +%s)

    if [ "$current_epoch" -lt "$expiry_epoch" ]; then
        local remaining=$(( ($expiry_epoch - $current_epoch) / 60 ))
        echo "AWS SSO checker: ✅  Token valid for ${remaining} more minutes"
        # Clean up any conflicting credentials in ~/.aws/credentials
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