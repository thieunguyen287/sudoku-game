import express from 'express';
import { SudokuController } from '../controllers/sudoku.controller';

const router = express.Router();

// Generate a new Sudoku game
router.get('/new', SudokuController.generateGame);

// Get a specific game
router.get('/:id', SudokuController.getGame);

// Make a move
router.post('/:id/move', SudokuController.makeMove);

// Get a hint
router.get('/:id/hint', SudokuController.getHint);

// Validate the current grid
router.get('/:id/validate', SudokuController.validateGrid);

export { router as sudokuRoutes };