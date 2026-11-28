# 🤖 Integra.AI

**Integra.AI** is an intelligent video calling platform powered by AI agents.
These agents assist users during meetings with real-time responses, generate post-meeting summaries, and provide insights — automating the entire meeting lifecycle using **OpenAI Realtime API**, **Stream SDK**, and **Inngest** for workflow automation.

## 📸 Screenshots

![Integra.AI Dashboard](/public/image.png)

## 🚀 Features

- 🤖 AI-powered video calls with custom agents
- 📞 Real-time video & chat using Stream SDK
- 📝 Automatic meeting summaries & transcripts
- 🔍 Smart transcript search & video playback
- 🔐 Authentication with Better Auth
- 📱 Mobile responsive design
- ⚙️ Background jobs with Inngest

## 🛠️ Tech Stack

- **Frontend:** Next.js 15.3.8, TypeScript, Tailwind CSS, ShadCN/UI
- **Backend:** Inngest (serverless event orchestration)
- **AI:** OpenAI Realtime API (Voice + Text Intelligence)
- **Video SDK:** Stream SDK
- **Database:** Neon / PostgreSQL
- **Authentication:** Better Auth
- **Deployment:** Vercel

## 📁 Project Structure (Short)

```text
components.json
drizzle.config.ts
eslint.config.mjs
next-env.d.ts
next.config.ts
package.json
postcss.config.mjs
tsconfig.json
public/
src/
  app/          # Next.js app router pages
  components/   # Reusable UI components
  db/           # Database configuration and schema
  hooks/        # Custom React hooks
  inngest/      # Background job functions
  lib/          # Utility libraries
  modules/      # Feature-specific modules (agents, auth, etc.)
  trpc/         # tRPC API routes and client
```

## ⚙️ Environment Variables

The repository includes an `env.example` template in the project root.

Create your local `.env.local` file by copying the template.

**Windows PowerShell:**

```powershell
Copy-Item .\env.example .env.local
```

**macOS / Linux:**

```bash
cp env.example .env.local
```

Update the placeholders in `.env.local` with your own development credentials.

### Environment variable reference

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Neon / PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Better Auth signing secret |
| `BETTER_AUTH_URL` | Authentication application URL |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `STREAM_API_KEY` | Stream API key |
| `STREAM_API_SECRET` | Stream API secret |
| `NEXT_PUBLIC_STREAM_VIDEO_API_KEY` | Public Stream Video client key |
| `STREAM_VIDEO_SECRET_KEY` | Stream Video server secret |
| `NEXT_PUBLIC_STREAM_CHAT_API_KEY` | Public Stream Chat client key |
| `STREAM_CHAT_SECRET_KEY` | Stream Chat server secret |
| `OPENAI_API_KEY` | OpenAI API key |
| `INNGEST_SIGNING_KEY` | Inngest signing key |
| `NEXT_PUBLIC_APP_URL` | Public application URL |

Configure credentials for the services and integrations you intend to use. OAuth credentials are needed when setting up their respective sign-in integrations.

**Security notes:**
- Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Use them only for public values.
- Never expose server secrets, API secrets, database credentials, or signing keys through `NEXT_PUBLIC_` variables.
- Keep `.env.local` private and never commit it to Git.

## 🚀 Development Flow

### Install dependencies

Use `--legacy-peer-deps` for React 19 compatibility.

```bash
npm install --legacy-peer-deps
```

### Start development servers

```bash
npm run dev
npm run dev:webhook
npx inngest-cli@latest dev
```

The webhook command requires the ngrok static domain configured in `package.json`. The Inngest development server is needed when working with Inngest workflows.

### Additional Commands

```bash
# Database
npm run db:push
npm run db:studio

# Production
npm run build
npm run start
```

For `dev:webhook` to work, configure your own ngrok static domain in the `dev:webhook` script in `package.json`.

## 📦 Installation

Clone the repository and install dependencies.

```bash
git clone https://github.com/srnsksyp/integra-ai.git
cd integra-ai
npm install --legacy-peer-deps
```

## ▶️ Running the App

Start the development server:

```bash
npm run dev
```

Open your browser at http://localhost:3000.

## 🧠 How It Works

- AI Agent Creation: User creates an AI agent and defines its role.
- Video Meeting: Stream SDK handles real-time video/audio.
- Realtime AI: OpenAI Realtime API processes conversation live.
- Automation: Inngest triggers post-meeting tasks (summaries, insights, etc.).
- Storage: All data and transcripts are saved securely in the database.
