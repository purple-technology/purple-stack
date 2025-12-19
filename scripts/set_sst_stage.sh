#!/bin/bash

# Get current git branch name
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

# Apply regex to replace non-alphanumeric characters (except underscore) with hyphens
SST_STAGE=$(echo "$BRANCH_NAME" | sed 's/[^a-zA-Z0-9_]/-/g')

# Export the SST_STAGE environment variable
export SST_STAGE="$SST_STAGE"