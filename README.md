# 🔙 Lavender - A Code Reviewing Friend

![Next JS](https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Inngest](https://img.shields.io/badge/Inngest-000000?style=for-the-badge&logo=inngest.com&logoColor=white)
![Polar.sh](https://img.shields.io/badge/Polar.sh-0A0A0A?style=for-the-badge&logo=polar.sh&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-0A0A0A?style=for-the-badge&logo=better-auth&logoColor=white)

> Friend that Cuts code review time & bugs in half Instantly.

## 🛠️ Complete Tech Stack


| Category            | Technologies                                                   |
| :------------------ | :------------------------------------------------------------- |
| **Core**            | NextJs, TypeScript                                             |
| **Database**        | PostgreSQL (Prisma ORM), Pinecone (Vector DB)                  |
| **BackGround-Jobs** | Inngest Dev (Inngest)                                          |
| **Authentication**  | Better-Auth (Google, GitHub, Facebook)                         |
| **AI & ML**         | Google Gemini (GenAI), Pinecone SDK                            |
| **Utilities**       | Zod (Validation), Nodemailer (Email), Nanoid                   |


## 🌸 Lavendar — AI Code Review Platform

Lavendar is an AI-powered code review platform, similar to CodeRabbit, that automatically analyzes pull requests, suggests improvements, detects bugs, and improves overall code quality — seamlessly integrated into your developer workflow.

Built with **Next.js, Inngest, Better Auth, TypeScript, Google Gemini, Polar.sh, PostgreSQL, and Pinecone**.


## 🌟 Comprehensive Features

### 🔐 Authentication & Security (Better Auth)

- **Multi-Provider Auth**: Secure login with OAuth providers and Email authentication.
- **Session Management**: Secure, encrypted cookie-based sessions with proper lifecycle handling.
- **Organization Support**: Multi-tenant architecture for teams and companies.
- **Role-Based Access Control (RBAC)**: Granular permissions for Admins, Maintainers, and Developers.

---

### 🤖 AI Code Review (Google Gemini)

- **Automated PR Reviews**: AI automatically reviews pull requests and posts contextual feedback.
- **Inline Code Suggestions**: Smart suggestions directly on changed lines.
- **Bug & Anti-Pattern Detection**: Identifies logic flaws, security issues, and bad practices.
- **Refactoring Recommendations**: Performance and readability improvements.
- **PR Summaries**: AI-generated concise summaries of code changes.

---

### ⚡ Event-Driven Workflows (Inngest)

- **Webhook Processing**: Git provider events trigger async workflows.
- **Background AI Pipelines**: PR opened → Inngest function → AI analysis → Store results.
- **Retry & Failure Handling**: Durable event execution with automatic retries.
- **Scalable Architecture**: Handles high-volume pull requests efficiently.

---

### 🧠 Semantic Intelligence (Pinecone)

- **Vector-Based Code Search**: Embed code snippets for semantic similarity search.
- **Contextual Review Memory**: AI retrieves relevant past reviews for better suggestions.
- **Smart Repository Insights**: Find related issues, files, and historical patterns.

---

### 💳 Billing & Subscriptions (Polar.sh)

- **Subscription Management**: Team and enterprise pricing tiers.
- **Usage-Based Billing**: Pay based on AI review volume.
- **Secure Checkout**: Seamless payment handling and subscription lifecycle management.

---

### 🗄️ Database & Persistence (PostgreSQL)

- **Structured Data Storage**: Users, Organizations, Repositories, PRs, Reviews.
- **Audit Logs**: Track AI suggestions and user actions.
- **Optimized Indexing**: Efficient querying for large repositories.

---

### 💻 Frontend Experience (Next.js + TypeScript)

- **App Router Architecture**: Modern, scalable frontend structure.
- **Server Actions & API Routes**: Secure backend integration.
- **Type-Safe Codebase**: End-to-end type safety with TypeScript.
- **Responsive Dashboard**: Clean UI for managing repositories and reviews.

---

## 🏗️ Architecture Deep Dive

Lavendar follows a **Modular Monolith** architecture where core domains (Auth, Billing, AI Review, Organizations) live in the same codebase but communicate via structured event flows.

---

## 🔄 Data Flow for AI Code Review

1. **Trigger**: Pull Request opened/updated → Webhook received.
2. **Event Dispatch**: Webhook event → Inngest workflow triggered.
3. **Processing**: Code diff sent to Google Gemini → AI generates feedback.
4. **Storage**: Review results saved to PostgreSQL + embeddings stored in Pinecone.
5. **Delivery**: Feedback displayed inside Lavendar dashboard or posted back to the Git provider.

---

## 🧩 Tech Stack Overview

- **Frontend**: Next.js + TypeScript  
- **Auth**: Better Auth  
- **AI Engine**: Google Gemini  
- **Workflow Engine**: Inngest  
- **Database**: PostgreSQL  
- **Vector Database**: Pinecone  
- **Billing**: Polar.sh  

---

### System Diagram ( Current )

![System Architecture](./assets/system_diagram.png)

### System Diagram ( Future )

![System Architecture](./assets/system_diagram_future.png)

---

## 🛠️ Setup & Installation

### 1. Prerequisites

- NextJs v16.0.10
- PostgreSQL
- Better-Auth
- Inngest
- Polar.sh

### 2. Installation

```bash
# Install dependencies
npm install
# or
bun install
```

### 3. Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/postgres"
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="..."
GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."
NEXT_PUBLIC_APP_BASE_URL="..."
PINECONE_DB_API_KEY="..."
PINECONE_DB_REGION="..."
PINECONE_DB_INDEX_NAME="..."
GOOGLE_GENERATIVE_AI_API_KEY="..."
POLAR_ACCESS_TOKEN="..."
POLAR_SUCCESS_URL="..."
POLAR_WEBHOOK_SECRET="..."
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push Schema to DB
npx prisma db push
```

### 5. Running the Inngest Dev Server

```bash
# Start Inngest dev server
npx --ignore-scripts=false inngest-cli@latest dev
```

### 6. Running the Application

```bash
# Development Mode (with Hot Reload)
npm run dev

# Production Build
npm run build
npm start
```

## 📡 API Overview

### 🔐 Authentication

- `GET /api/auth/[...all]`  
  Handles authentication flows (login, logout, session, OAuth callbacks) powered by Better Auth.

---

### ⚡ Event & Background Processing

- `POST /api/inngest`  
  Inngest event endpoint for handling background workflows (PR analysis, AI review jobs, retries).

---

### 🔗 Webhooks

#### 🐙 GitHub

- `POST /api/webhooks/github`  
  Receives GitHub webhook events (Pull Request opened, updated, synchronized).  
  Triggers AI code review workflows.

#### 💳 Polar.sh

- `POST /api/webhooks/polar`  
  Handles subscription lifecycle events (checkout completed, subscription updated, canceled).  
  Syncs billing status with user accounts.

  ---

