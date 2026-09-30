# Connectify

Connectify is a full-stack social networking application for building a community around profiles, posts, conversations, and collaborative study sessions. Members can share updates, follow people, explore profiles, exchange messages, receive notifications, and join live study sessions with chat and a shared whiteboard.

## Features

- Account registration and login with cookie-based authentication
- Personalized feed, post creation, likes, comments, and saved posts
- User profiles, following, profile search, and suggested people
- Notifications and one-to-one conversations with file attachments
- Study sessions with participant updates, chat, a timer, and whiteboard
- Real-time features powered by Socket.IO

## Technology

- **Frontend:** React, TypeScript, Vite, React Router, TanStack Query
- **Backend:** Node.js, Express, TypeScript, Socket.IO
- **Database:** MongoDB with Mongoose
- **Media:** Cloudinary configuration and local upload support

## Prerequisites

- Node.js 18 or newer and npm
- A MongoDB instance, either local or hosted
- A Cloudinary account for image/media features

## Installation

Clone the repository and install each application’s dependencies from its own directory:

```bash
git clone https://github.com/Dushant-A-Banpurkar/PERSONALIZED-SOCIAL-MEDIA-PLATFORM.git
cd PERSONALIZED-SOCIAL-MEDIA-PLATFORM

cd backend
npm install

cd ../frontend
npm install
```

Create `backend/.env` with the following settings. Replace the sample values with credentials for your own services; do not commit secrets.

```dotenv
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/connectify
JWT_SECRET=replace-with-a-long-random-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

`PORT` is optional (the backend defaults to `5001`). The backend loads this file when started from the `backend` directory. Configure Cloudinary with your account credentials to use media upload functionality.

## Usage

Run the backend and frontend in separate terminals from the repository root.

**Terminal 1 — API and Socket.IO server:**

```bash
cd backend
npm start
```

The backend listens on `http://localhost:5001` by default and connects to MongoDB during startup.

**Terminal 2 — web application:**

```bash
cd frontend
npm run dev
```

Open the URL printed by Vite (by default `http://localhost:5173`). The frontend development server proxies `/api` requests to the backend. Keep the backend on port `5001` for API and real-time connections to work with the current local configuration.

After signing in or creating an account, use the navigation to access the home feed, profiles, notifications, people search, groups, messages, and study sessions.

### Useful commands

Run these commands from the corresponding `backend` or `frontend` directory:

| Command | Purpose |
| --- | --- |
| `npm start` | Start the backend with Nodemon (backend only) |
| `npm run dev` | Start the Vite development server (frontend only) |
| `npm run build` | Type-check and build the application |
| `npm run lint` | Run the frontend ESLint checks |
| `npm run preview` | Preview the built frontend locally |

The backend build command runs TypeScript compilation. The frontend build command runs TypeScript project checks and creates a production bundle in `frontend/dist`.

## API overview

The backend exposes its HTTP API under `/api`. Most user, post, message, notification, and study-session routes require an authenticated session.

| Prefix | Examples |
| --- | --- |
| `/api/auth` | `POST /signup`, `POST /login`, `POST /logout`, `GET /me` |
| `/api/users` | Profiles, following, suggestions, search, and profile updates |
| `/api/posts` | Feed retrieval, post creation, likes, comments, and deletion |
| `/api/conversations` | List or start conversations |
| `/api/messages` | Retrieve and send conversation messages |
| `/api/notification` | List and clear notifications |
| `/api/sessions` | Create, list, join, update, leave, and raise a hand in study sessions |

Socket.IO provides real-time events for session participants, session chat, and session updates.

## Project layout

```text
.
├── backend/
│   └── src/
│       ├── controller/   # Request handlers
│       ├── Database/     # MongoDB connection
│       ├── middleware/   # Authentication and request middleware
│       ├── models/       # Mongoose models
│       ├── routes/       # Express API routes
│       └── server.ts     # HTTP and Socket.IO server
└── frontend/
    └── src/
        ├── components/   # Pages and reusable UI components
        ├── hooks/        # Client-side data and state hooks
        └── lib/          # Shared client utilities
```

## Contributing

Contributions are welcome. To propose a change:

1. Fork the repository and create a focused branch from the project’s default branch.
2. Install the backend and frontend dependencies and configure a local development environment.
3. Make a narrowly scoped change that follows the existing TypeScript and React patterns.
4. Run the relevant checks before opening a pull request:

   ```bash
   # From frontend/
   npm run lint
   npm run build

   # From backend/
   npm run build
   ```

5. Open a pull request with a clear summary, motivation, and any relevant screenshots or manual testing notes.

Do not include credentials, private `.env` values, or unrelated generated files in a contribution. If your change alters setup, configuration, or user-facing behavior, update this README as part of the change.
