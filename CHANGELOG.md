# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.5.1](https://github.com/purple-technology/purple-stack/compare/v2.5.0...v2.5.1) (2022-01-14)

## [2.5.0](https://github.com/purple-technology/purple-stack/compare/v2.4.0...v2.5.0) (2022-01-14)


### Features

* **ci:** circleci image replaced with cimg ([c35611b](https://github.com/purple-technology/purple-stack/commit/c35611b99df2da8a8af212af38adb7b587104a1d))
* implement checkov ([4dfbd5a](https://github.com/purple-technology/purple-stack/commit/4dfbd5a886a0de5b69abd2377ce470e79fe80821))
* implement static application security testing ([5f2e89d](https://github.com/purple-technology/purple-stack/commit/5f2e89d0f92af2b26748bd042473d052379848e3))

## [2.4.0](https://github.com/purple-technology/purple-stack/compare/v2.3.0...v2.4.0) (2021-08-27)


### Features

* create api-utils package to stringify API unkown errors ([757b257](https://github.com/purple-technology/purple-stack/commit/757b257eae905cceb2a89e1b7cdfb7199bbf91a4))


### Bug Fixes

* add missing tsconfig to env-vars package ([651ac1d](https://github.com/purple-technology/purple-stack/commit/651ac1d3924144db41e4209fa6e2c4934b339a93))

## [2.3.0](https://github.com/purple-technology/purple-stack/compare/v2.2.0...v2.3.0) (2021-08-27)


### Features

* upgrade to TypeScript 4.4 ([ff5d2cc](https://github.com/purple-technology/purple-stack/commit/ff5d2ccd5ddc72f4dd37aa72889d418d96c1d647))

## [2.2.0](https://github.com/purple-technology/purple-stack/compare/v2.1.0...v2.2.0) (2021-08-24)


### Features

* remove "timeout" from local FE deployments ([3b44130](https://github.com/purple-technology/purple-stack/commit/3b44130673177c431344e1492ca462c4bac4bd35))

## [2.1.0](https://github.com/purple-technology/purple-stack/compare/v2.0.0...v2.1.0) (2021-08-21)


### Features

* use apsync types from aws-lambda in API ([2ff9e98](https://github.com/purple-technology/purple-stack/commit/2ff9e98e6a537f5f1eefaef5b0cae3f787e79905))

## 2.0.0 (2021-08-16)


### ⚠ BREAKING CHANGES

* removed classic deploys, kept only normal deploys
* AWS role configuration was moved from config.yml to serverless.settings.yml

### ci

* move role configuration to serverless.settings.yml ([9644e3e](https://github.com/purple-technology/purple-stack/commit/9644e3e35c8d72b91b5fce61b0b0a8332788ac3f))


* version 2.0.0 ([bf185bf](https://github.com/purple-technology/purple-stack/commit/bf185bf3495fcaca838a5a79bf3608b3e8c382a0))
