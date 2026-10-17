# 🚀 Excelidraw Frontend - Interactive Canvas App

## 📖 Description
The Excelidraw Frontend is the core client-facing application of the Freeflow platform. It houses the interactive digital canvas where users can draw, brainstorm, and collaborate in real-time. 

**Why it is useful:** It provides a buttery-smooth drawing experience combined with instant WebSocket updates, ensuring that collaborating remotely feels as seamless as sitting in the same room.

**Key features:**
* Highly performant HTML5 Canvas interactions
* Real-time cursor tracking and stroke rendering
* Integrated Dashboard and Room creation
* Smooth animations using GSAP and Lenis
* Fully responsive and modern UI using Tailwind CSS

## 🧭 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Installation](#-installation)
3. [Usage](#-usage)
4. [Usage Examples](#-usage-examples)
5. [Project Structure](#-project-structure)
6. [Features](#-features)
7. [Future Improvements](#-future-improvements)
8. [Contributing](#-contributing)
9. [Author / Credits](#-author--credits)

## 🛠️ Tech Stack
* **Framework:** Next.js 15.1
* **UI Library:** React 19
* **Styling:** Tailwind CSS, Tailwind Animate
* **Animations:** GSAP, Lenis
* **Icons:** Lucide React
* **HTTP Client:** Axios

## ⚙️ Installation
*Note: It is highly recommended to run this from the root of the monorepo.*
If you are setting this up individually, ensure Node.js and `pnpm` are installed.

```bash
# Navigate to the app directory
cd apps/excelidraw-frontend

# Install local dependencies (or run from root)
pnpm install

# Set up environment variables locally (if required separately from root)
cp .env.example .env
```

## ▶️ Usage
To run the Next.js development server:

```bash
npm run dev
# or
pnpm run dev
```

Expected Output: The application will be accessible at http://localhost:3000 (or assigned port). You should be able to navigate to the sign-in page, dashboard, and the canvas room (/canvas/[roomId]).

## 💡 Usage Examples
Joining a Room:
When a user navigates to /canvas/123, the app establishes a WebSocket connection to the ws-backend using the user's JWT token, syncing the canvas state automatically.

## 📂 Project Structure
/app: Next.js 15 App Router pages (Dashboard, Sign in, Signup, Canvas).

/components: Reusable React components (AuthPage, Canvas, CreateRoom).

/draw: Core logic for drawing and canvas state management (Game.ts, http.ts).

/public: Static assets (SVGs, icons).

## 🚧 Features
Dedicated Authentication flows (Sign In / Sign Up)

Room creation and joining mechanics

Infinite scrolling / smooth scrolling (ScrollStack)

Complex state management for drawing coordinates

## 🔮 Future Improvements
Add exporting capabilities (PNG/SVG)

Implement shape recognition

Add sticky notes and text-box integrations

## 🤝 Contributing
Refer to the main repository guidelines for contribution instructions.

## 👤 Author / Credits
Nishaad Dhabale












This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
