![Purple Stack Title Image](https://user-images.githubusercontent.com/6282843/99382243-8a14f200-28cc-11eb-99b1-114f4842874b.png)

# API

![Serverless Enabled](https://camo.githubusercontent.com/547c6da94c16fedb1aa60c9efda858282e22834f/687474703a2f2f7075626c69632e7365727665726c6573732e636f6d2f6261646765732f76332e737667)

API for Purple Apps means REST/GraphQL API dedicated pureley for needs of `frontend`.

## Local development

```
$ npm run dev
```

If API is running successfully on localhost, you should see this in the terminal:
```
Serverless: Watching for changes...
AppSync Simulator: AppSync endpoint: http://localhost:62222/graphql
AppSync Simulator: GraphiQl: http://localhost:62222
...
Serverless: Offline [HTTP] listening on http://localhost:3000
```

### GraphQL
There is a fully featured GraphiQL running on http://localhost:62222.

![GraphiQL](https://user-images.githubusercontent.com/6282843/99972890-60157100-2d9f-11eb-96f8-8144622bb95c.png)

#### Environment variables mocking
When you add new environment variable to `provider.environment` or `function.environment` used by AppSync resolver function, you must add environment varaiable mock.

If you retrieve the value via `Fn::ImportValue` - add the mocking to `importValueMap`.

If you retrieve the value via `Fn::GetAtt` - add the mocking to `getAttMap`.

If you retrieve the value via `Ref` - add the mocking to `refMap`.

Read more in the [serverless-appsync-simulator docs](https://github.com/bboure/serverless-appsync-simulator#resource-cloudformation-functions-resolution).

Note: You don't have to setup mocks for ALL environment variables. Setup mocking only for environment variables which are used inside resolver functions (`src/graphql/*`).

### REST

All the REST endpoints are avalible on `http://localhost:3000`.

Read more in [serverless-offline](https://github.com/dherault/serverless-offline) docs.


## Deploy

```
$ npm run deploy
```

## Remove deployment

```
$ npm run remove
```

## Where is deployed API running?

```
$ npm run info
```

Sample output:
```
Stack Outputs
GraphQlApiUrl: https://69omzru3evdevipcwvb2erg14s.appsync-api.eu-central-1.amazonaws.com/graphql
```
