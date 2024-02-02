# Purple Stack

<p align="center">
  <img width="727" alt="9 Landscape Gradient@2x" src="https://user-images.githubusercontent.com/6282843/165325934-63b58d78-a395-4e0a-a27e-ab41aafecb41.png">
</p>

![GitHub top language](https://img.shields.io/github/languages/top/purple-technology/purple-stack)
![GitHub last commit](https://img.shields.io/github/last-commit/purple-technology/purple-stack)
![GitHub](https://img.shields.io/github/license/purple-technology/purple-stack)

## What is Purple Stack

Purple stack is a development stack designed by [Purple LAB](https://www.purple-technology.com/) for developing full-stack serverless apps.

It's based on our 6+ years of experience with building big Serverless apps on AWS.

You can read more about how Purple Stack was born on our [blog](https://blog.purple-technology.com/cs/pribeh-o-tom-ako-vznikol-purplestack/).

## Tech being used

- Main language: [TypeScript](https://www.typescriptlang.org/)
- Deployment framework: [SST.dev](https://sst.dev/)
- Frontend: [React.js](https://react.dev) & [Next.js](https://nextjs.org/)
- Code bundling: [ESbuild](https://esbuild.github.io/)
- Package manager: [PNPM](https://pnpm.io/)
- Linting: [ESlint](https://eslint.org/) & [Prettier](https://prettier.io/)
- API protocol: [tRPC](https://trpc.io/)
- Business workflows engine: [AWS Step Functions](https://aws.amazon.com/step-functions/)
- CI/CD: [GitHub Actions](https://github.com/features/actions)
- Static Application Security Testing (SAST) - [`eslint-plugin-security`](https://www.npmjs.com/package/eslint-plugin-security) & [@microsoft/eslint-plugin-sdl](https://www.npmjs.com/package/@microsoft/eslint-plugin-sdl)
- Unit Tests - [Vitest](https://vitest.dev/)
- Structured Logging: [AWS Lambda Powertools Logger](https://docs.powertools.aws.dev/lambda/typescript/latest/core/logger/)
- Conventional Commits - [Commitlint](https://commitlint.js.org)
- ... and more

## File structure

```
.
├── constructs
│   └── # Here go sharable CDK constructs that
│       # you can abstract for multiple services.
│       #
│       # Only individual TS files. No packages.
├── packages
│   └── # Here goes any application code that
│       # you need to share between services.
│       #
│       # Make sure the packages are created
│       # as "npm" packages so that they have
│       # package.json and tsconfig.ts files.
├── services
│   └── # Here goes source code for indivudual
│       # aws services. Inside these folders 
│       # are Lambda handlers and other relevant
│       # source code.
│       #
│       # Make sure the services are created
│       # as "npm" packages so that they have
│       # package.json and tsconfig.ts files.
└── stacks
    └── # Here goes AWS stacks definitions.
        # One folder for each service.
        # Make sure there is always file stack.ts
        # inside each folder.
        #
        # Only individual TS files. No packages.
```

## ENV file

Env file is quite simple in this case. Only `AWS_PROFILE` is necessary value.

### Example

```ini
AWS_PROFILE=purple-technology
```

## Setup

There are some settings which need to be changed in order to make this boilerplate project work.

### GitHub Actions

`.github/workflows/*`

- replace all `CHANGE_ME` values
- `role-session-name` - identifier of the application
- `role-to-assume` - usually apps are deployed to "Production" and "Staging" AWS accounts. `master` branch gets deployed to "Production" and the rest goes to the "Staging" AWS account. Make sure to put there correct deployment roles. 
- [How to setup GitHub OpenID Connect on AWS](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)

### SST config

`sst.config.ts`

- Change app name. Current value: `name: 'purple-stack'`
- Change regions. Current value: `region: stage === 'master' ? 'eu-central-1' : 'eu-central-1'`
- Eventually enable tracing if you need.  Current value: `tracing: 'disabled'`

## Best practices

### 1. Separate stateful resources to a separate stack

You can use pre-defined `ResourceStack` for this.

> #### Separate your application into multiple stacks as dictated by deployment requirements
> There is no hard and fast rule to how many stacks your application needs. You'll usually end up basing the decision on your deployment patterns. Keep in mind the following guidelines:
> 
> - It's typically more straightforward to keep as many resources in the same stack as possible, so keep them together unless you know you want them separated.
> 
> - **Consider keeping stateful resources (like databases) in a separate stack from stateless resources. You can then turn on termination protection on the stateful stack. This way, you can freely destroy or create multiple copies of the stateless stack without risk of data loss.**
>
> - Stateful resources are more sensitive to construct renaming—renaming leads to resource replacement. Therefore, don't nest stateful resources inside constructs that are likely to be moved around or renamed (unless the state can be rebuilt if lost, like a cache). This is another good reason to put stateful resources in their own stack.

Read more [here](https://docs.aws.amazon.com/cdk/v2/guide/best-practices.html#best-practices-apps).

### 2. Don't turn off ESlint and TSconfig rules

The rules are there for a reason. Always make sure to try all possible solutions to comply with the rules before disabling the rule.

Every time you use `any` in the code a bunny dies.

<p align="center">
    <img width="250"  src="https://github.com/purple-technology/purple-stack/assets/6282843/0f86dd12-436a-4ceb-9bf3-8d2b9d72d93f" />
</p>

### 3. Take advantage of all the features of SST

SST has a lot of great quirks and features like `use`, `bind` etc.

Read their [docs](https://docs.sst.dev/).
