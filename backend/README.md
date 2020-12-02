![Purple Stack Title Image](https://user-images.githubusercontent.com/6282843/99382243-8a14f200-28cc-11eb-99b1-114f4842874b.png)

# Backend

Backend for Purple Apps is an arbitrary number of serverless serivces which handle background processes like State machines, DynamoDB triggers, webhook handlers, etc.

Part of the backend is also the `resources` package which contains all resources like DynamoDB tables, S3 byckets, Cognito User Pools, etc.

Example:
```
backend
├── addTodo - package @be/add-todo
│   ├── jest.config.js
│   ├── macros.js
│   ├── package-lock.json
│   ├── package.json
│   ├── serverless.yml
│   ├── src
│   │   └── add
│   │       ├── __io__
│   │       ├── index.ts
│   │       └── types.ts
│   ├── tsconfig.json
│   ├── tsconfig.test.json
│   └── webpack.config.js
└── resources - package @be-prioritized/resources
    ├── jest.config.js
    ├── macros.js
    ├── package-lock.json
    ├── package.json
    ├── serverless.yml
    ├── tsconfig.json
    ├── tsconfig.test.json
    └── webpack.config.js
```

## Deployment

Check out deployment flow of backend [HERE](../README.md#deployment)
