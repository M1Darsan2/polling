# Polling

A real-time polling application where users create polls, share a link, and watch votes update instantly across every connected viewer — no refresh needed.

## Features

- **Create polls** — add a question with 2-6 options
- **Real-time results** — vote counts and percentages update live via Socket.io
- **Shareable links** — copy a poll's URL to send to friends
- **One vote per person** — vote choice is remembered locally to prevent re-voting
- **Live indicator** — visual badge showing the poll is actively receiving votes

## Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Socket.io-client
- React Router

**Backend**
- Node.js + Express
- Socket.io
- MongoDB + Mongoose

## Project Structure

```
polling/
├── server/
│   ├── models/
│   │   └── Poll.js
│   ├── routes/
│   │   └── polls.js
│   ├── server.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   └── PollCard.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── CreatePage.jsx
│   │   │   └── PollPage.jsx
│   │   ├── socket.js
│   │   └── App.jsx
│   └── vite.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/M1Darsan2/polling.git
cd polling
```

### 2. Install dependencies

```bash
npm install
npm run server --prefix server
npm install --prefix client
```

Or, if using a root-level concurrently setup:
```bash
npm install
```

### 3. Environment variables

Create a `.env` file in `server/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:5173
```

### 4. Run the app

From the project root:
```bash
npm start
```

This runs both the backend (port 5000) and frontend (port 5173) concurrently.

### 5. Open the app

Visit `http://localhost:5173` in your browser.

## How It Works

1. A user creates a poll with a question and options — saved to MongoDB via a REST endpoint.
2. Anyone visiting a poll's page opens a Socket.io connection and joins a "room" named after that poll's ID.
3. When a user votes, the vote is sent via a Socket.io event (not a REST call), updating the vote count in MongoDB.
4. The server broadcasts the updated poll to everyone in that room, so all viewers see results change instantly.
5. Vote choice is stored in `localStorage` to prevent voting more than once per poll per browser.

## Roadmap

- [ ] Poll expiration / auto-close after a set time
- [ ] Anonymous vs authenticated voting
- [ ] Poll analytics (votes over time)
- [ ] Dark/light theme toggle

## License

This project is open source and available under the MIT License.
