# Contributing to Integra.AI

First of all, thank you for your interest in contributing to **Integra.AI**! Contributions of all experience levels are welcome. This guide explains how to get started, choose work, make changes, and submit a pull request—especially for contributors participating in **SWOC (Social Winter of Code)**.

Integra.AI is an AI-powered video meeting platform. It combines real-time video and chat, AI agents, meeting summaries and transcripts, and event-driven workflows.

## Table of contents

- [Ways to contribute](#ways-to-contribute)
- [Before you start](#before-you-start)
- [Finding an issue](#finding-an-issue)
- [Set up the project](#set-up-the-project)
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
