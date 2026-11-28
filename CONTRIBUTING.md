# Contributing to Integra.AI

First of all, thank you for your interest in contributing to **Integra.AI**! Contributions of all experience levels are welcome. This guide explains how to get started, choose work, make changes, and submit a pull request—especially for contributors participating in **SWOC (Social Winter of Code)**.

Integra.AI is an AI-powered video meeting platform. It combines real-time video and chat, AI agents, meeting summaries and transcripts, and event-driven workflows.

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Before you start](#before-you-start)
- [Finding an issue](#finding-an-issue)
- [Set up the project](#set-up-the-project)
- [Meeting Event and Summary Processing Lifecycle](#meeting-event-and-summary-processing-lifecycle)
- [Development guidelines](#development-guidelines)
- [Working on an issue](#working-on-an-issue)
- [Commit and pull request guidelines](#commit-and-pull-request-guidelines)
- [Testing your changes](#testing-your-changes)
- [SWOC contributor guidance](#swoc-contributor-guidance)
- [Getting help](#getting-help)

## Ways to contribute

You can contribute in several ways:

- Fix bugs and improve existing features.
- Improve the user interface, accessibility, and responsive behaviour.
- Work on AI-agent interactions, meeting summaries, transcripts, and search.
- Improve video-call and chat experiences built with Stream.
- Improve background workflows and integrations.
- Add or improve tests.
- Improve documentation, setup instructions, and examples.
- Review pull requests and report reproducible bugs.

Small, focused improvements are valuable. You do not need to make a large change to contribute.

## Before you start

Please:

1. Read this guide and the repository's [README](README.md).
2. Read and follow the [Code of Conduct](CODE_OF_CONDUCT.md).
3. Check the existing issues and pull requests to avoid duplicate work.
4. Ask questions in the relevant issue before starting work if the requirements are unclear.
5. Never publish API keys, credentials, tokens, database URLs, or other secrets.

If an issue is already assigned, actively being worked on, or has an open pull request, coordinate with the maintainers before starting a competing implementation.

## Finding an issue

1. Browse the [open issues](https://github.com/srnsksyp/integra-ai/issues).
2. Look for issues that match your skills and available time.
3. Read the full description, acceptance criteria, and discussion.
4. Comment on the issue to express interest and briefly explain your proposed approach.
5. Wait for maintainer confirmation or assignment before beginning substantial work.

If you find a bug that has not been reported, first search existing issues. If it is new, open an issue with clear reproduction steps, expected behaviour, actual behaviour, and relevant screenshots or logs (after removing secrets and personal data).

Do not create duplicate issues or claim work that you are not prepared to complete.

## Set up the project

### Prerequisites

- Git
- Node.js and npm (use a version compatible with the project)
- A code editor such as VS Code
- The service credentials required for the feature you are working on

### 1. Fork and clone

Fork the repository on GitHub, then clone your fork:

```bash
git clone https://github.com/<your-github-username>/integra-ai.git
cd integra-ai
```

Add the original repository as `upstream`:

```bash
git remote add upstream https://github.com/srnsksyp/integra-ai.git
git remote -v
```

### 2. Install dependencies

The project README currently recommends the following command for React compatibility:

```bash
npm install --legacy-peer-deps
```

### 3. Configure environment variables

Create a local environment file from the tracked template:

**Windows PowerShell:**

```powershell
Copy-Item .\env.example .env.local
```

**macOS / Linux:**

```bash
cp env.example .env.local
```

Update the placeholders with your own development credentials. Configure only the service credentials required for the features you intend to use.

Keep `.env.local` private and never commit it. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser, so never place secrets in them.

Depending on the features you run, the application may require credentials for services such as:

- PostgreSQL / Neon (`DATABASE_URL`)
- Better Auth
- GitHub and Google OAuth
- Stream video and chat
- OpenAI
- Inngest

Use your own development credentials. Keep `.env.local` out of Git and never commit real credentials. Do not add placeholder secrets to source code. If a required variable or setup step is unclear, ask in the relevant issue.

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Some integrations require additional local services or configuration. For example, the README documents `npm run dev:webhook` for webhook development and the Inngest development CLI:

```bash
npm run dev:webhook
npx inngest-cli@latest dev
```

Only run the webhook command after configuring the ngrok URL as described in the README. You do not need every external integration running to work on an unrelated UI or documentation issue.

### 5. Database commands

The README documents these Drizzle-related commands:

```bash
npm run db:push
npm run db:studio
```

Use database commands only when your assigned task requires them. Be careful to use a development database—not production data.

## Meeting Event and Summary Processing Lifecycle

### A. Architecture overview

Stream sends call webhooks to the Next.js handler at `src/app/api/webhook/route.ts`. The handler verifies the webhook signature with the Stream Video SDK and updates the meeting record in the database. When Stream reports that a transcription is ready, the handler stores its URL and sends a `meetings/processing` event to Inngest. The Inngest endpoint at `src/app/api/inngest/route.ts` registers the `meetingsProcessing` function from `src/inngest/functions.ts`, which fetches the transcript, generates a summary, and saves it to the meeting record.

The transcript itself is fetched from Stream's transcript URL when needed; the application stores the URL in `meetings.transcriptUrl`. The generated summary is stored in `meetings.summary` (`src/db/schema.ts`).

### B. Event sequence

1. A user joins a live meeting. Stream sends `call.session_started`; the webhook changes an eligible upcoming meeting to `active` and records `startedAt`.
2. When the call ends, Stream sends `call.session_ended`. The webhook changes the meeting from `active` to `processing` and records `endedAt`. This marks the call as ended; it does **not** mean the transcript is ready.
3. Stream separately sends `call.transcription_ready` when transcription is ready. The webhook reads `call_transcription.url`, stores it in `meetings.transcriptUrl`, then sends Inngest the `meetings/processing` event with the meeting ID and transcript URL.
4. The `meetingsProcessing` function in `src/inngest/functions.ts` fetches the URL, parses its JSONL transcript, attaches known speaker names from the user and agent records (using “Unknown” when a speaker is not found), and asks the `gpt-4o` summarizer to generate the summary.
5. After summary generation, the function saves the result to `meetings.summary` and changes the meeting status to `completed`. Transcript display separately fetches and parses the saved transcript URL through `getTranscript` in `src/modules/meetings/server/procedures.ts`.

The webhook does not check that the transcription URL is usable before saving it and dispatching the event. If transcript retrieval, parsing, or summary generation fails, the function does not mark the meeting completed or set a separate failure status; it can remain `processing`. See `src/app/api/webhook/route.ts`, `src/inngest/functions.ts`, and `src/modules/meetings/server/procedures.ts` for these paths.

### C. Local development prerequisites

For the meeting-to-summary path, configure a local `.env.local` using placeholders from `env.example`:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Connects the application to its PostgreSQL database for meeting, user, and agent records. |
| `NEXT_PUBLIC_STREAM_VIDEO_API_KEY` | Stream Video API key used by the application. |
| `STREAM_VIDEO_SECRET_KEY` | Server-side Stream Video secret, including webhook signature verification. |
| `OPENAI_API_KEY` | Used by the meeting agent and the summary generator. |

Use your own development configuration; do not put production credentials or real secrets in documentation or source control. The local services for this workflow are the Next.js application, an ngrok tunnel for Stream webhooks, and the Inngest development server. To participate through the application, also configure any sign-in provider credentials required by your local auth setup.

`env.example` also includes `INNGEST_SIGNING_KEY` for Inngest signing. The local workflow uses the Inngest development server below; do not use a production signing key just to run it locally.

The available commands are:

```bash
npm run dev
npm run dev:webhook
npx inngest-cli@latest dev
```

`npm run dev:webhook` forwards port `3000` using the ngrok URL configured in the `dev:webhook` script in `package.json`. Configure your own ngrok URL there. The URL must match the host configured as the Stream webhook destination; use `https://<your-ngrok-host>/api/webhook` as the destination. Do not copy a URL from another developer's configuration.

### D. Startup order

1. Copy `env.example` to `.env.local` and fill in the development values needed for your database, Stream Video, and OpenAI setup.
2. Start the Next.js application with `npm run dev` (the webhook script forwards port `3000`).
3. Start the ngrok tunnel with `npm run dev:webhook`, after configuring its URL in the script as described above.
4. Configure or verify the Stream webhook destination is `https://<your-ngrok-host>/api/webhook` and uses the same ngrok host as the forwarding script.
5. Start the Inngest development server with `npx inngest-cli@latest dev` so it can connect to the application's `/api/inngest` endpoint.
6. Join and end a meeting, then allow Stream to deliver the separate transcription-ready event. Check the meeting for its transcript and, after processing completes, its summary.

### E. Troubleshooting

| Symptom | What to check | Relevant source/service |
|---|---|---|
| Meeting ends but status does not update | Confirm Stream delivered `call.session_ended`, the webhook request was accepted, and the meeting was `active` (only active meetings are changed to `processing`). | Stream webhook delivery; `src/app/api/webhook/route.ts` |
| Transcript-ready event arrives without a usable transcript URL | Check that `call_transcription.url` is present and usable. The webhook stores and forwards this value without validating it first. | Stream transcription event; `src/app/api/webhook/route.ts` |
| Transcript does not appear | Check `meetings.transcriptUrl` and whether the URL returns parseable JSONL. The transcript query returns an empty list when the URL is absent or its fetch/parse fails. | `src/db/schema.ts`; `getTranscript` in `src/modules/meetings/server/procedures.ts` |
| Inngest development server is not running | Start it with `npx inngest-cli@latest dev` and make sure the application is running. | Inngest development server; `src/app/api/inngest/route.ts` |
| Inngest event is not received | Verify the webhook accepted `call.transcription_ready`, saved the URL, and sent `meetings/processing`; check the Inngest development server and registered function. | `src/app/api/webhook/route.ts`; `src/app/api/inngest/route.ts`; Inngest development server |
| Summary processing fails | Check transcript fetching and JSONL parsing, database access for speakers, and OpenAI configuration; inspect the `meetingsProcessing` run and application output. | `src/inngest/functions.ts`; Inngest development server; Next.js terminal |
| Meeting remains in processing state | Confirm `call.transcription_ready` arrived and the `meetingsProcessing` function reached its `save-summary` step. There is no separate failure-status update in the current flow. | `src/app/api/webhook/route.ts`; `src/inngest/functions.ts`; meeting record |
| Local webhook URL is incorrect | Ensure the URL configured in `dev:webhook` is the same ngrok host as the Stream webhook destination, with `/api/webhook` appended to the destination. | `package.json`; ngrok configuration; Stream webhook configuration |
| Stream credentials or webhook configuration are invalid | Check the local Stream API key and server secret, the configured webhook destination, and that requests include the required signature and API-key headers. The handler verifies the signature with the Stream SDK. | `env.example`; `src/lib/stream-video.ts`; `src/app/api/webhook/route.ts`; Stream configuration |

## Development guidelines

Please keep contributions consistent with the existing codebase.

- **Follow existing patterns:** inspect nearby components, modules, hooks, and utilities before introducing a new abstraction.
- **Keep changes focused:** avoid unrelated refactoring, formatting churn, or redesigns outside the issue's scope.
- **Use TypeScript carefully:** provide meaningful types and avoid `any` unless there is a clear reason.
- **Build reusable UI:** prefer existing components and design conventions over duplicate implementations.
- **Consider accessibility:** use semantic elements, keyboard support, visible focus states, and accessible labels.
- **Check responsive layouts:** verify that UI changes work on narrow and wide screens.
- **Handle errors and loading states:** do not leave users with silent failures or confusing empty screens.
- **Protect user data:** do not log secrets, tokens, private meeting content, or unnecessary personal information.
- **Respect service boundaries:** do not bypass authentication, authorization, or existing validation.
- **Document meaningful changes:** update relevant documentation when setup, behaviour, or configuration changes.

Do not add a new dependency unless it is needed. Explain why it is necessary in the pull request.

## Working on an issue

Create a descriptive branch from the latest `main` branch:

```bash
git fetch upstream
git switch main
git pull upstream main
git switch -c type/short-description
```

Suggested branch prefixes:

- `feat/` — a new feature
- `fix/` — a bug fix
- `docs/` — documentation
- `test/` — tests
- `refactor/` — code restructuring without intended behaviour changes
- `chore/` — maintenance

Examples:

```bash
git switch -c docs/contribution-guidelines
git switch -c fix/meeting-summary-error
git switch -c feat/transcript-search-filter
```

Work only on the issue you are addressing. If you discover a related problem, mention it in the issue or pull request rather than silently expanding the scope.

## Commit and pull request guidelines

### Commits

Use clear, descriptive commit messages. Conventional Commit-style messages are encouraged:

```text
docs: add contributor guidelines
fix: handle empty meeting transcripts
feat: add transcript search filters
test: cover meeting summary rendering
```

Keep commits logically grouped. Do not include generated files, local environment files, credentials, or unrelated changes.

### Push your branch

```bash
git add <files-you-changed>
git commit -m "docs: add contributor guidelines"
git push -u origin <your-branch-name>
```

### Open a pull request

Open a pull request from your fork/branch into the repository's `main` branch:

[Create a pull request](https://github.com/srnsksyp/integra-ai/compare)

A good pull request should:

- Use a concise, descriptive title.
- Link the issue it addresses (for example, `Closes #12`).
- Explain **what** changed and **why**.
- Describe the implementation at a useful level of detail.
- List the checks you ran and their results.
- Include screenshots or a short recording for visible UI changes.
- Mention any configuration, migration, or environment-variable changes.
- Clearly disclose anything not tested or still incomplete.

Suggested pull request description:

```markdown
## Summary
- Describe the changes made.

## Related issue
Closes #<issue-number>

## Changes
- List the important implementation details.

## Testing
- [ ] Relevant checks completed
- [ ] Tested locally
- [ ] No secrets or local environment files included

## Screenshots / recordings
Add screenshots or recordings for UI changes.
```

Do not mark an issue as complete or claim tests passed unless you have verified them. Respond to review comments respectfully and make requested changes in the same branch where appropriate.

## Testing your changes

Run the checks relevant to your contribution before opening or updating a pull request.

At minimum, inspect the available scripts:

```bash
npm run
```

Then run the applicable project checks, such as:

```bash
npm run lint
npm run build
```

If tests are available for the area you changed, run the relevant test command as well. Do not assume a test script exists—check `package.json` first.

For UI changes, manually verify the affected flow in the browser, including loading, empty, error, and responsive states where applicable. For integrations, explain which external services were configured and which paths could not be tested.

If a check fails, determine whether your change caused it. Include relevant failure details in the pull request rather than hiding or deleting failing tests.

## SWOC contributor guidance

We welcome contributors taking part in Social Winter of Code.

To make your SWOC contribution reviewable and useful:

1. Explore the project and read the issue carefully before selecting work.
2. Comment on the issue and wait for maintainer confirmation/assignment.
3. Work on the agreed scope; ask before making major changes to the requirements.
4. Keep your branch and pull request focused on one issue.
5. Follow the repository's coding, testing, and documentation conventions.
6. Submit work that you understand and can explain during review.
7. Be responsive to maintainer feedback and update your pull request when needed.
8. Follow the official SWOC rules and timelines published by the programme. Programme-specific scoring, eligibility, and acceptance decisions are determined by SWOC—not by this repository.

**Important:** A pull request is not automatically accepted or counted as a completed SWOC contribution when it is opened. It must meet the project's requirements and pass maintainer review. Do not submit copied work, spam pull requests, make unrelated changes to increase contribution size, or open low-quality automated submissions.

AI coding tools may be used as assistance, but contributors remain responsible for understanding, testing, documenting, and being able to explain every change they submit. Never submit generated code that you have not reviewed.

## Getting help

- Open an issue for a reproducible bug or a project improvement.
- Use the discussion on the relevant issue to clarify implementation details.
- For contribution or review questions, contact the maintainers through the repository's GitHub channels.
- For sensitive conduct concerns, follow the private reporting guidance in [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md); do not post private or personal information in a public issue.

Thank you for helping make Integra.AI better!
