import { Request, Response } from 'express';
import { SudokuGenerator } from '../utils/sudoku-generator';
import { Difficulty, SudokuGame, SudokuMove, GameState } from '../models/sudoku.model';

// In-memory storage for games (in a real app, this would be a database)
const games: Map<string, SudokuGame> = new Map();
const gameStates: Map<string, GameState> = new Map();

export class SudokuController {
  /**
   * Generate a new Sudoku game
   */
  static generateGame(req: Request, res: Response): void {
    try {
      const difficulty = (req.query.difficulty as Difficulty) || 'medium';
      
      // Generate a new Sudoku puzzle
      const { grid, solution, id } = SudokuGenerator.generateSudoku(difficulty);
      
      // Store the game
      const game: SudokuGame = {
        id,
        grid,
        solution,
        difficulty,
        createdAt: new Date()
      };
      
      games.set(id, game);
      
      // Create initial game state
      const gameState: GameState = {
        gameId: id,
        grid: JSON.parse(JSON.stringify(grid)), // Deep copy
        startTime: new Date(),
        isComplete: false
      };
      
      gameStates.set(id, gameState);
      
      // Return the game (without solution)
      res.status(201).json({
        id,
        grid,
        difficulty,
        message: 'New Sudoku game created'
      });
    } catch (error) {
      console.error('Error generating game:', error);
      res.status(500).json({ message: 'Failed to generate Sudoku game' });
    }
  }

  /**
   * Get a specific game by ID
   */
  static getGame(req: Request, res: Response): void {
    try {
      const gameId = req.params.id;
      const gameState = gameStates.get(gameId);
      
      if (!gameState) {
        res.status(404).json({ message: 'Game not found' });
        return;
      }
      
      res.status(200).json({
        id: gameState.gameId,
        grid: gameState.grid,
        isComplete: gameState.isComplete,
        startTime: gameState.startTime,
        endTime: gameState.endTime
      });
    } catch (error) {
      console.error('Error getting game:', error);
      res.status(500).json({ message: 'Failed to retrieve game' });
    }
  }

  /**
   * Make a move in the game
   */
  static makeMove(req: Request, res: Response): void {
    try {
      const gameId = req.params.id;
      const move: SudokuMove = req.body;
      
      // Validate move data
      if (move.row === undefined || move.col === undefined || move.value === undefined) {
        res.status(400).json({ message: 'Invalid move data. Required: row, col, value' });
        return;
      }
      
      // Get the game
      const game = games.get(gameId);
      const gameState = gameStates.get(gameId);
      
      if (!game || !gameState) {
        res.status(404).json({ message: 'Game not found' });
        return;
      }
      
      // Check if game is already complete
      if (gameState.isComplete) {
        res.status(400).json({ message: 'Game is already complete' });
        return;
      }
      
      // Validate move
      const isValid = SudokuGenerator.validateMove(game.solution, move.row, move.col, move.value);
      
      // Update game state
      if (isValid) {
        gameState.grid[move.row][move.col] = move.value;
        
        // Check if the game is complete
        const isComplete = SudokuGenerator.checkCompletion(gameState.grid, game.solution);
        
        if (isComplete) {
          gameState.isComplete = true;
          gameState.endTime = new Date();
        }
        
        res.status(200).json({
          valid: true,
          isComplete,
          grid: gameState.grid
        });
      } else {
        res.status(200).json({
          valid: false,
          message: 'Invalid move'
        });
      }
    } catch (error) {
      console.error('Error making move:', error);
      res.status(500).json({ message: 'Failed to process move' });
    }
  }

  /**
   * Get a hint for the current game
   */
  static getHint(req: Request, res: Response): void {
    try {
      const gameId = req.params.id;
      
      // Get the game
      const game = games.get(gameId);
      const gameState = gameStates.get(gameId);
      
      if (!game || !gameState) {
        res.status(404).json({ message: 'Game not found' });
        return;
      }
      
      // Find an empty cell or incorrect cell
      const hints: { row: number; col: number; value: number }[] = [];
      
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (gameState.grid[row][col] === null || gameState.grid[row][col] !== game.solution[row][col]) {
            hints.push({
              row,
              col,
              value: game.solution[row][col] as number
            });
          }
        }
      }
      
      if (hints.length === 0) {
        res.status(200).json({ message: 'No hints available, the puzzle is complete' });
        return;
      }
      
      // Return a random hint
      const hint = hints[Math.floor(Math.random() * hints.length)];
      
      res.status(200).json({
        hint: {
          row: hint.row,
          col: hint.col,
          value: hint.value
        }
      });
    } catch (error) {
      console.error('Error getting hint:', error);
      res.status(500).json({ message: 'Failed to get hint' });
    }
  }

  /**
   * Check if the current state of the game is valid
   */
  static validateGrid(req: Request, res: Response): void {
    try {
      const gameId = req.params.id;
      
      // Get the game
      const game = games.get(gameId);
      const gameState = gameStates.get(gameId);
      
      if (!game || !gameState) {
        res.status(404).json({ message: 'Game not found' });
        return;
      }
      
      // Check each cell
      const errors: { row: number; col: number }[] = [];
      
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          const cellValue = gameState.grid[row][col];
          if (cellValue !== null && cellValue !== game.solution[row][col]) {
            errors.push({ row, col });
          }
        }
      }
      
      res.status(200).json({
        valid: errors.length === 0,
        errors
      });
    } catch (error) {
      console.error('Error validating grid:', error);
      res.status(500).json({ message: 'Failed to validate grid' });
    }
  }
}