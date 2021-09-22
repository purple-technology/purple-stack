unset AWS_SESSION_TOKEN

PROJECT_NAME=$(yq e '.common.projectName' serverless.settings.yml)

if [ $CIRCLE_BRANCH = 'master' ]
then
    AWS_ROLE=$(yq e '.ci.prodAwsRole' serverless.settings.yml)
else
    AWS_ROLE=$(yq e '.ci.stagingAwsRole' serverless.settings.yml)
fi

temp_role=$(aws sts assume-role --role-arn $AWS_ROLE --role-session-name $PROJECT_NAME)

export AWS_ACCESS_KEY_ID=$(echo $temp_role | jq .Credentials.AccessKeyId | xargs)
export AWS_SECRET_ACCESS_KEY=$(echo $temp_role | jq .Credentials.SecretAccessKey | xargs)
export AWS_SESSION_TOKEN=$(echo $temp_role | jq .Credentials.SessionToken | xargs)
