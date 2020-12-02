![Purple Stack Title Image](https://user-images.githubusercontent.com/6282843/99382243-8a14f200-28cc-11eb-99b1-114f4842874b.png)

# @package/secrets

*If you are from Purple 💜, [here](https://app.gitbook.com/@purple-technology/s/web-tech/purple-stack/secrets-config) is a simplified documentation for you.*

This package is responsible only for loading the secrets and passing them to the code. Secrets itself are being stored in AWS SecretsManager in a form of JSON object or simple string.

⚠️ Do not use this package on frontend. For frontend configurations use `@package/config`.

## How to manually add secret to AWS Secrets Manager

1. Go to Secrets Manager and click "Store a new secret"
2. Select "Other type of secrets"
3. Either add the secrets in key/value editor or in case of nested JSON object switch to Plaintext editor
4. Click "Next"
5. Give the secret a name
6. Click "Next"
7. Select "Disable automatic rotation"
8. Click "Next"
9. Click "Store"

## How to use a secret in Purple Stack
Let's say we have secret in AWS Secrets Manager called `db-credentials` which looks like this:

```JSON
{
    "host": "secret_host_value",
    "user": "secret_user_value",
    "password": "secret_password_value"
}
```

1. add `secretConfigEnvs` to `custom` in `serverless.yml` file of desired service
    ```yaml
    custom:
      secretConfigEnvs:
        SECRET_DB_CREDENTIALS: ${ssm:/aws/reference/secretsmanager/db-credentials~true}
    ``` 
2. Create a new type in `src/types.ts` according to structure of the secret
    ```typescript
    export interface DbCredentialsConfig {
      host: string
      user: string
      password: string
    }
    ```
3. add the secret's type to `Secrets` type in `src/types.ts`
    ```diff
    export interface Secrets {
      SECRET_EXAMPLE: ExampleConfig
    + SECRET_DB_CREDENTIALS: DbCredentialsConfig    
    }
    ```
4. Add testing mocks for the secret in `src/mocked.ts`
    ```diff
    const mockedSecrets: Secrets = {
      SECRET_EXAMPLE: {
        somethingSuperSecret: 'mocked'
      },
    + SECRET_DB_CREDENTIALS: {
    +   host: 'mocked_host_value',
    +   user: 'mocked_user_value',
    +   password: 'mocked_password_value'
    + }
    }
    ```
5. create a new function in `src/index.ts` for retrieving the secret
    ```typescript
    export const getDbCredentials = (): DbCredentialsConfig =>
      getEnvVar<DbCredentialsConfig>(
        'SECRET_DB_CREDENTIALS',
        (env) => typeof env === 'object'
          && typeof env.host === 'string'
          && typeof env.user === 'string'
          && typeof env.password === 'string'
      )
    ```
6. Install the secrets package in service where you need to use it
    ```
    $ lerna add --scope="name-of-service" @package/secrets 
    ```
7. Done. You can import the `getDbCredentials` functino and use it.

## Production vs staging secrets

Let's say we want production deployment of our application to connect to production database and all other deployments to staging database.

For this case we have [sls-macro](../../README.md#serverless-macros) called `getSecretsStage`. Feel free to modify this macro according to your needs. By default the macro returns `master` for `master` stage and `staging` for every other stage.

So we can create two secrets called:

- `my-credentials-master`
- `my-credentials-staging`

And then we can reference them like this:

```yaml
custom:
  secretConfigEnvs:
    SECRET_MY_CREDENTIALS: ${ssm:/aws/reference/secretsmanager/my-credentials-${file(macros.js):getSecretsStage}~true}
```

This will cause that correct secret will be used in appropriate situation.

## How to test/mock
When running your tests set environment variable `NODE_ENV=test`. Secrets config will then implicitly use mocked values from `src/mocked.ts`.

## How the magic works 🔮 🧙‍♂️

1. Webpack config from `@package/webpack` loads the `secretConfigEnvs` configuration from `serverless.yml`
2. it serializes the data into JSON and passes it into code via `process.env.__SECRETS__` via `webpack.DefinePlugin`
3. all occurances of `process.env.__SECRETS__` will get replaced by the object containg the keys and values - variable names and values
4. `@package/secrets` accesses the `process.env.__SECRETS__` and extracts the variables from it
5. it makes then avalible through "getters" e.g. `getEtlPodioConnString` which contain information about variable name e.g. `SECRET_ETL_PODIO` and validation function which serves as sort of user-defined type guard and makes sure the variable value is in expected shape 
