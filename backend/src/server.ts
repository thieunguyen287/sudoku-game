import express from 'express';
import cors from 'cors';
import { sudokuRoutes } from './routes/sudoku.routes';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 12000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/sudoku', sudokuRoutes);

// Default route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Sudoku Game API' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});