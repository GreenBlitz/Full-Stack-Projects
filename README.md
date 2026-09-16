<div align="center">
  <a href="https://github.com/GreenBlitz/Full-Stack-Projects">
    <img src="apps/scouting/frontend/public/icon-512.png" alt="GreenBlitz Logo" height="100">
  </a>
  <p>Full-Stack applications</p>
</div>

# GreenBlitz Full-Stack

Monorepo for GreenBlitz full-stack applications and shared TypeScript packages.

Projects:

- FRC scouting platform in `apps/scouting`;
- `apps/template` provides the starting point for new applications.

## Repository Layout

```text
apps/
  scouting/     FRC scouting application with a React frontend and backend API
  template/     Frontend/backend template used by the project generator
packages/       Shared TypeScript libraries used across applications
scripts/        Workspace runner and project-generation scripts
```

## Prerequisites

- **Node.js** 18 or newer and **npm**
- **Docker Desktop** for the compose-based deployment
- **MongoDB** when running the scouting backend outside Docker

## Setup

Clone the repository

```bash
git clone https://github.com/GreenBlitz/Full-Stack-Projects
cd Full-Stack-Projects
```

Install dependencies from the repository root:

```sh
npm install
```

For scouting Google Sheets synchronization, place the service-account credentials at `apps/scouting/backend/src/sheets-key.json`. This file is ignored and must be supplied locally.

## Development

Run both workspaces for an application through Turbo by passing the application name:

```sh
npm run dev scouting
```

Run a frontend or backend directly from its workspace when needed:

```sh
npm run dev --workspace=scouting-frontend
npm run dev --workspace=scouting-backend
```

### VS Code

Run the appropriate task for the application you trying to run via dev.

## Creating an Application

Copy the template into a new application directory and update its package names:

```sh
npm run generate my-project
```

This creates `apps/my-project/frontend` and `apps/my-project/backend` from `apps/template`.
