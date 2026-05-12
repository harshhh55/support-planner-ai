# Support Planner — AI Support Desk

A professional AI-powered support desk application built with React (Vite) and Express (Node.js). It leverages OpenAI, Gemini, and Tavily for intelligent ticket triage and reply generation.

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd fullstack_ai
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and fill in the required values (see [Environment Variables](#environment-variables) below):
   ```bash
   cp .env.example .env # If available, otherwise create manually
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000` by default.

### 3. Frontend Setup
1. Navigate to the client directory (from the root):
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:5000
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 🔑 Environment Variables

### Server (`server/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | Port for the backend server (default: 5000) |
| `BACKEND_URL` | Full URL of the backend (e.g., http://localhost:5000) |
| `FRONTEND_URL` | Full URL of the frontend (e.g., http://localhost:5173) |
| `SESSION_JWT_SECRET` | Secret key for JWT signing |
| `SESSION_COOKIE_NAME` | Name of the session cookie |
| `SCALEKIT_ENVIRONMENT_URL` | Your Scalekit Environment URL |
| `SCALEKIT_CLIENT_ID` | Your Scalekit Client ID |
| `SCALEKIT_CLIENT_SECRET` | Your Scalekit Client Secret |
| `GOOGLE_API_KEY` | Google Gemini API Key |
| `TAVILY_API_KEY` | Tavily Search API Key |

### Client (`client/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_BACKEND_URL` | URL of the backend server |

---

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS, Lucide React, Radix UI.
- **Backend**: Node.js, Express 5, TypeScript.
- **AI/ML**: LangChain, Google Gemini, OpenAI, Tavily.
- **Authentication**: Scalekit (SAML/OIDC).
