unset AWS_SESSION_TOKEN

PROJECT_NAME=$(yq e '.common.projectName' serverless.settings.yml)

temp_role=$(aws sts assume-role --role-arn $AWS_ROLE --role-session-name $PROJECT_NAME)

export AWS_ACCESS_KEY_ID=$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)
export AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)
export AWS_SESSION_TOKEN=$(echo $temp_role | jq .Credentials.SessionToken | xargs)
