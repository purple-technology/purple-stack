# Purple Stack v4

A serverless stack application template built in SST v3. [Learn more](https://sst.dev/docs/set-up-a-monorepo).

## Get started

1. Use this template to [create your own repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template).

2. Clone the new repo.

   ```bash
   git clone <REPO_URL> MY_APP
   cd MY_APP
   ```

3. Rename the files in the project to the name of your app.

   ```bash
   npx replace-in-file '/purple-stack/g' 'MY_APP' '**/*.*' --verbose
   ```

4. Copy mise.local.tom.example to mise.local.toml and update the values.

5. [Install](https://mise.jdx.dev/getting-started.html) mise for managing global tools, tasks and environment variables.
6. Install the global tools using Mise (Node, PNPM, ...)
    ```bash
    mise install
    ```
6. Deploy!

   ```bash
   pnpm install
   pnpm run sst:deploy
   ```