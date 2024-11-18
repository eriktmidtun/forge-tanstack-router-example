# Forge Tanstack Router Example

This project is a PNPM monorepo that demonstrates how to use Tanstack Router with Atlassian Forge apps. It includes examples for both Jira and Confluence modules, showcasing how to handle routing with and without link overwriting support using `view.createHistory`.

## Project Structure

The project is organized as a monorepo with the following structure:

```
.
├── .gitignore
├── .npmrc
├── manifest.base.yml
├── package.json
├── packages/
│   ├── backend/
│   │   ├── package.json
│   │   ├── src/                - Forge resolvers
│   │   └── tsconfig.json
│   └── frontend/
│       ├── .gitignore
│       ├── index.html
│       ├── package.json
│       ├── src/                - Example code 
│       ├── tsconfig.json
│       ├── tsconfig.node.json
│       └── vite.config.ts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── src/                         - Symlinked to backend build output in packages/backend/dist/src
└── README.md
```

## Requirements

- See [Set up Forge](https://developer.atlassian.com/platform/forge/set-up-forge/) for instructions to get set up.
- [PNPM](https://pnpm.io/installation#using-corepack) version specified in `package.json`

It is recommended to install PNPM through [corepack](https://pnpm.io/installation#using-corepack) to ensure consistency across different environments.

```zsh
corepack enable
corepack install
```

## Quick Start

1. Install top-level dependencies:
    ```sh
    pnpm install
    ```

2. Login with Forge CLI:
    ```sh
    forge login
    ```

3. Create manifest, register a new Forge app, and build the project:
    ```sh
    pnpm run setup
    ```


## Other commands

Build your app:
```sh
pnpm run build
```

Deploy your app:
```sh
forge deploy
```

Install your app in an Atlassian site:
```sh
forge install
```

Tunnel forge app:
```sh
# Must be run seperataly
pnpm run dev # Hot module reloading of frontend and backend 
forge tunnel 
```

## Project Details

### Jira Module

The Jira module supports link overwriting using `view.createHistory`. It uses a custom implementation of Tanstack History to integrate with Forge's history management.

### Confluence Module

The Confluence module does not support link overwriting. Instead, it uses Tanstack Router's `memoryHistory` to manage routing within the app.


## Documentation

- [Atlassian Forge Documentation](https://developer.atlassian.com/platform/forge/)
- [Tanstack Router Documentation](https://tanstack.com/router/latest/docs/framework/react/overview)

