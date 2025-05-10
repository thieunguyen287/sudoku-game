# Sudoku Game

A full-stack Sudoku game implementation with Node.js backend and Angular frontend, both using TypeScript.

## Features

### Backend
- RESTful API built with Express.js and TypeScript
- Sudoku game generation and validation
- Game state management
- Hint system

### Frontend
- Angular-based UI with TypeScript
- Responsive game board
- Game controls (new game, validate, hint)
- Difficulty levels

## Project Structure

```
sudoku-game/
├── backend/             # Node.js backend
│   ├── src/
│   │   ├── controllers/ # API controllers
│   │   ├── models/      # Data models
│   │   ├── routes/      # API routes
│   │   ├── utils/       # Utility functions
│   │   └── server.ts    # Express server setup
│   └── tsconfig.json    # TypeScript configuration
└── frontend/            # Angular frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/  # UI components
    │   │   ├── models/      # Data models
    │   │   ├── pages/       # Page components
    │   │   └── services/    # API services
    │   └── ...
    └── ...
```

## Getting Started

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Angular CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/thieunguyen287/sudoku-game.git
cd sudoku-game
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server
```bash
cd backend
npm run dev
```

2. Start the frontend application
```bash
cd ../frontend
ng serve
```

3. Open your browser and navigate to `http://localhost:4200`

## License
MIT