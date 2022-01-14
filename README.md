![Purple Stack Title Image](https://user-images.githubusercontent.com/6282843/99382243-8a14f200-28cc-11eb-99b1-114f4842874b.png)

[![CircleCI](https://circleci.com/gh/purple-technology/purple-stack/tree/master.svg?style=svg)](https://circleci.com/gh/purple-technology/purple-stack/tree/master)
[![Serverless Enabled](https://camo.githubusercontent.com/547c6da94c16fedb1aa60c9efda858282e22834f/687474703a2f2f7075626c69632e7365727665726c6573732e636f6d2f6261646765732f76332e737667)](https://www.serverless.com/framework/)
[![codecov](https://codecov.io/gh/purple-technology/purple-stack/branch/master/graph/badge.svg?token=T6CGMAD4OE)](https://codecov.io/gh/purple-technology/purple-stack)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)
![GitHub top language](https://img.shields.io/github/languages/top/purple-technology/purple-stack)
![GitHub last commit](https://img.shields.io/github/last-commit/purple-technology/purple-stack)
![GitHub](https://img.shields.io/github/license/purple-technology/purple-stack)

# What is Purple Stack

It is a devstack for developing big complex serverless applications on AWS.

It reflects our 5+ years of Serverless apps development experience.

You can read more about how Purple Stack was born on our [blog](https://blog.purple-technology.com/cs/pribeh-o-tom-ako-vznikol-purplestack/).

## Features

- [TypeScript](https://www.typescriptlang.org/)
- [Serverless Framework](https://www.serverless.com/framework/)
- [Next.js](https://nextjs.org/)
- [React.js](https://reactjs.org/)
- [Webpack](https://webpack.js.org/)
- Monorepo - [Lerna](https://github.com/lerna/lerna)
- Code Linting - [ESlint](https://eslint.org/) + [Prettier](https://prettier.io/)
- GraphQL API - [AWS AppSync](https://aws.amazon.com/appsync/)
- REST API - [Amazon API Gateway](https://aws.amazon.com/api-gateway/)
- Complex background processes - [AWS Step Functions](https://aws.amazon.com/step-functions/)
- IaC - [CloudFormation](https://aws.amazon.com/cloudformation/)
- CI/CD - [CircleCI](https://circleci.com/) 
- Dependencies patching - [Renovate](https://renovatebot.com/) 
- IaC Security Scanning - [Checkov](https://www.checkov.io/)
- Static Application Security Testing (SAST) - [ESlint Security Plugins](https://github.com/microsoft/eslint-plugin-sdl)
- Unit Tests - [Jest](https://jestjs.io/)
- Conventional Commits - [Commitlint](https://commitlint.js.org/)
- GrahpQL TypeScript Types - [GraphQL Code Generator](https://www.graphql-code-generator.com/)
- ... and more


# Introduction

Purple Apps consist of three main parts:

- [Frontend](frontend#readme)
  - Next.js
- [API](api#readme)
  - GraphQL - AWS AppSync
  - RestAPI - Amazon API Gateway
- [Backend](backend#readme)
  - Resources - serverless service containing CloudFormation resources like DynamoDB tables, S3 buckets, SQS queues etc.
  - ...and arbirarry number of serverless services handling background processes

# Env file
Because there are so many NPM scripts across Purple Stack, we are using `.env` file to store all the common envionrment variables in a single place.

So in order to run all the parts of the Purple Stack locally, you need to create a .env file in the root folder of your project.

### Example
```ini
AWS_SDK_LOAD_CONFIG=true
AWS_PROFILE=purple-technology
AWS_REGION=eu-central-1
```

# Setup

There are some settings which need to be changed in order to make this boilerplate project work:

- 🌀 = Optional
- ❗️ = Required

## 1. Serverless settings
```
serverless.settings.yml
```

- ❗️ Replace `REGION` in `common.region` with desired AWS region where you want your application to be deployed 
- ❗️ Create an S3 bucket for the serverless deployments and then fill the bucket's name in `common.deploymentBucket`
- ❗️ Replace `purple-stack.com` in `frontend.domain` with desired domain where you would like your application to be avalible. This domain needs to have a hosted zone in the same AWS account's Route53.
- ❗️ Create a wilcard certificate in `N. Virginia` region for the `frontend.domain` and fill the certificate ARN to `frontend.certificate`
- 🌀 Modify the `common.projectName` to better identify your application
- 🌀 Modify the `common.dnsRandomString` to better secure your feature deployments 
- 🌀 Modify the `vpc` in case you need to have your functions inside a VPC (if you need reach to an RDS databases, for example)
- 🌀 If you would like to enable monitoring, put a list of stages you would like to monitor in `monitoring.stages` and if you do so, ❗️ fill the `monitoring.topic` with the desired topic ARN


## 2. CI
```
.circleci/config.yml
```

- 🌀 Maybe you don't need to use CircleCI `context`, so in that case you can remove all it's occurences.
- 🌀 Maybe you don't need to have NPM authentication to install private packages, so in that case you can remove all occurances of `npm_auth` or `commands_npm_auth` and parts related to it.
- 🌀 Maybe you need different branch filtering, so in that case feel free to modify it according to your needs. 
- 🌀 Maybe you can deploy the application with the same AWS account whose AWS credentials you've provided to the CI envronment, so in that case feel free to remove all occurances of `assume_aws_role` or `commands_assume_aws_role`  and any parts related to it.

If you need to deploy the application with a different AWS account than the AWS account whose credentials you have provided to the CI environment:
```
.circleci/aws_assume_role.sh
```

- ❗️ Replace `ROLE_ARN_HERE` with the correct ARN of the role which will be assumed by the CI to create the deployment
- 🌀 Modify the role session name with a name which better identifies your application 

<hr />

# Custom libraries and tooling

## Application Configuration
```
@package/config
```

This package serves for storing and providing settings to your whole application - Frontend, API and Backend.
That means that only non-secret values can be stored there.

For example:

- Minimum length of password ✅
- Database credentials ❌

## Secrets Configuration
```
@package/secrets
```

This package serves for providing secret values to your backend part of the applications - API and Backend.

Read more [here](packages/secrets#readme).

## Application Logging
```
@package/logger
```

This package serves for simplifying structured logging within Lambda functions.

Structured logging logs JSON with metadata instead of logging just a string.

This helps developers search in the logs for a specific log and gives them the proper context of what happened.

Read more [here](packages/logger#readme).

## GraphQL Types
```
@package/graphql-types
```

This package contains TypeScript types which were generated from the GraphQL schema from API.

It's powered by [`@graphql-codegen`](https://graphql-code-generator.com/)

You can re-generate the types by running 
```
$ npm run graphql-codegen
```

Don't forget to re-generate the types when you make a change to the GraphQL schema.

In case you forget, `test` CI workflow will fail on step `Graphql CodeGen check`. 

## Serverless Macros
```
@package/sls-macros
```

"Serverless Macros" is a term born in Purple Technology.

Serverless Macros are JavaScript functions which are executed inside the `serverless.yml` file and their purpose is to conditionally generate the template. Simply said it serves as sort of programmatic extension to YAML templates.

For example: apply Point-In-Time recovery only for production DynamoDB tables or apply coorect DeletionPolicy for all production resources.

```yaml
DeletionPolicy: ${file(macros.js):getStorageResourcePolicy}
```

<hr />

# Deployment

Becuse of the fact that all Purple App serverless services are interconnected via [Fn::ImportValue](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html) we need to keep correct deployment order in order to fulfill the dependencies.

- First we need to deploy `resources` which are lerna packages `@be-prioritized/*`.
- then we can deploy rest of the backend which are lerna packages `@be/*`
- then API which is lerna package `api`
- and then frontend which is lerna package `frontend`

<hr />

# Purple Architecture 🚀

This boilerplate repository complies with three main architectural pillars of Purple Apps:

- Serverless
- Infrastructure as Code
- CI/CD

## Serverless

Serverless architecture has been playing a big role at Purple Technology since 2017 because we love the ease of developing and provisioning serverless applications that allow us to focus purely on the business logic.

All of our newly built apps are Powered by Serverless ⚡️

We chose to go with a combination of two market leaders - AWS and Serverless Framework.

We know that term "Serverless" is not just about Lambda functions, it is also about complementary services like DynamoDB, SNS, SQS, Cognito, S3 etc. which can be defined also in this stack in the form of infrastructure-as-code.

## Infrastructure as Code

It has been proven by many examples in the past that managing the infrastructure purely by humans is a bad idea - human errors, miscommunication, manual changes taking too long, etc.

That's why we decided to adopt a native IaC tool for both AWS and Serverless Framework called "AWS CloudFormation."

The whole monorepo is perfectly interconnected via CloudFormation's [references](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-ref.html) and [imports](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html).

## CI/CD

With serverles monorepo full of dependencies came into play an issue of complex deployments.

Also it used to happen that two developers deploying same code endedup deploying "different" applications.

That is why we decided to adopt CI/CD - CircleCI - and to have deterministic deployments and to have test and compilation checks as GitHub PR checks. 
