# Creative Frenzy - Collaborative Task Board

A real-time task and project management tool built with **Next.js, React, Express.js, MongoDB, Tailwind CSS, Shadcn,and Socket.IO**. Supports drag-and-drop columns and tasks, live user presence, and real-time updates across multiple clients.

## Features

- Drag and drop **columns** and **tasks** (within/between columns)
- Real-time updates via **WebSocket (Socket.IO)**
- Task and column CRUD operations
- Optimistic UI updates
- Column and task reordering with previous/next references
- REST API + WebSocket integration
- Next.js frontend with Zustand state management
- Notifications with **notistack**

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Zustand, Dnd-Kit
- **Backend:** Express.js, MongoDB, Mongoose, Socket.IO
- **Realtime:** WebSocket via Socket.IO
- **Dev Tools:** Axios, Notistack

## Setup

1. Clone the repository:

```bash
git clone https://github.com/Bipul-Dubey/task.creativefrenzy
cd creative-frenzy
```

## creative-frenzy folder structure and env

```
creative-frenzy/
│
├── src/                  # Source code
│   ├── apis/             # API functions
│   ├── app/              # Routes (using app routing)
│   ├── components/       # Shared/common components
│   ├── context/          # Context APIs for state management
│   └── store/            # Zustand state
│
├── backend/              # Backend API with MongoDB
│   └── .env              # Backend environment variables
│
└── .env                  # Root environment variables
```

## Environment Requirements
### Backend
```bash 
MONGO_URI=your_mongodb_connection_string
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```
### Frontend
```bash 
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## Running the Project
### Backend
```bash 
cd backend
npm install
npm run dev
```
### Frontend
```bash 
cd creative-frenzy
npm install
npm run dev
```
