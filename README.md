Markdown
# 🚀 Freeflow - Collaborative Whiteboarding Platform

## 📖 Description
Freeflow is a high-performance, real-time collaborative whiteboarding and drawing platform. Designed as a modern monorepo, it separates the web landing page, the interactive canvas application, the RESTful HTTP API, and the low-latency WebSocket server into distinct applications. 

**Why it is useful:** Whether for remote team brainstorming, architectural diagramming, or online tutoring, Freeflow provides a lag-free, scalable environment for multiple users to interact on the same digital canvas simultaneously.

**Key features:**
* Real-time collaboration via WebSockets
* High-performance interactive drawing canvas
* Secure user authentication and room generation
* Fully scalable monorepo architecture using Turborepo
* Shared UI component libraries and database schemas

## 🧭 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Installation](#-installation)
3. [Usage](#-usage)
4. [Usage Examples](#-usage-examples)
5. [Project Structure](#-project-structure)
6. [API Documentation](#-api-documentation)
7. [Testing](#-testing)
8. [Features](#-features)
9. [Future Improvements](#-future-improvements)
10. [Contributing](#-contributing)
11. [License](#-license)
12. [Author / Credits](#-author--credits)

## 🛠️ Tech Stack
* **Workspace:** Turborepo, pnpm
* **Frontend:** Next.js 15, React 19, Tailwind CSS
* **Backend:** Node.js, Express.js (HTTP), `ws` (WebSockets)
* **Database:** Prisma ORM, PostgreSQL (via `@repo/db`)
* **Language:** TypeScript across the entire stack

## ⚙️ Installation
Follow these step-by-step instructions assuming a completely fresh environment.

**Prerequisites:**
1. **Download & Install Git:** [Git Downloads](https://git-scm.com/downloads)
2. **Download & Install Node.js:** [Node.js Downloads](https://nodejs.org/) (Version 18 or higher is required)
3. **Install pnpm:** Open your terminal and run:
   ```bash
   npm install -g pnpm
Setup Steps:

Clone the repository:

   ```Bash
   git clone <your-github-repo-url>
   cd freeflow
   ```
Install dependencies:
Because this is a monorepo, pnpm will resolve all workspaces automatically.
   

   ```bash
   pnpm install
   ```

Environment Variables:
Create a .env file in the root directory and configure it (you will need a local or cloud Postgres database):

   ```Code snippet
   DATABASE_URL="postgresql://user:password@localhost:5432/freeflow"
   JWT_SECRET="your_super_secret_jwt_key"
```

Database Migration:
   ```Bash
   cd packages/db
   npx prisma migrate dev --name init
   npx prisma generate
   cd ../..
   ```
▶️ Usage
To run the entire monorepo simultaneously in development mode:

```Bash
# Start all apps (frontend, web, http-backend, ws-backend)
pnpm run dev
```
Expected Output: Turborepo will spin up all 4 microservices. You will see logs from Next.js, Express, and the WebSocket server starting on their respective ports.

💡 Usage Examples
To build the project for production:

```Bash
pnpm run build
To run formatters across all packages:
```
```Bash
pnpm run format
```

```##📂 Project Structure
Plaintext
   freeflow/
   ├── apps/
   │   ├── excelidraw-frontend/ # The main drawing canvas web app
   │   ├── http-backend/        # Express REST API
   │   ├── web/                 # Landing page web app
   │   └── ws-backend/          # Real-time WebSocket server
   ├── packages/
   │   ├── db/                  # Prisma schema and generated client
   │   ├── ui/                  # Shared React UI components
   │   ├── common/              # Shared types and validation schemas
   │   └── backend-common/      # Shared backend utilities
   ├── package.json
   └── turbo.json
```
🔌 API Documentation
Refer to the HTTP and WS backend sub-directories for detailed API docs.

🧪 Testing
(Tests yet to be implemented)
```
Bash
pnpm run test
🚧 Features
Monorepo setup enabling code sharing
```
Consistent ESLint and Prettier formatting across apps

Real-time engine integration

🔮 Future Improvements
Add comprehensive end-to-end testing with Cypress/Playwright

Dockerize the entire monorepo with Docker Compose

CI/CD pipeline using GitHub Actions

🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
Distributed under the MIT License.

👤 Author / Credits
Nisha Addhabale


# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo login

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo login
yarn exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
# With [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation) installed (recommended)
turbo link

# Without [global `turbo`](https://turborepo.com/docs/getting-started/installation#global-installation), use your package manager
npx turbo link
yarn exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
