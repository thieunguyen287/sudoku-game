import { SudokuGrid, Difficulty } from '../models/sudoku.model';
import { v4 as uuidv4 } from 'uuid';

// Install uuid if not already installed
try {
  require('uuid');
} catch (e) {
  console.log('Installing uuid package...');
  require('child_process').execSync('npm install uuid @types/uuid');
}

export class SudokuGenerator {
  private static readonly GRID_SIZE = 9;
  private static readonly BOX_SIZE = 3;
  private static readonly EMPTY_CELL = null;

  /**
   * Generate a new Sudoku puzzle with solution
   */
  static generateSudoku(difficulty: Difficulty): { grid: SudokuGrid, solution: SudokuGrid, id: string } {
    // Create a solved Sudoku grid
    const solution = this.generateSolvedGrid();
    
    // Create a puzzle by removing numbers from the solution
    const grid = this.createPuzzleFromSolution(solution, difficulty);
    
    return {
      grid,
      solution,
      id: uuidv4()
    };
  }

  /**
   * Generate a fully solved Sudoku grid
   */
  private static generateSolvedGrid(): SudokuGrid {
    // Initialize empty grid
    const grid: SudokuGrid = Array(this.GRID_SIZE)
      .fill(null)
      .map(() => Array(this.GRID_SIZE).fill(this.EMPTY_CELL));

    // Fill the grid using backtracking
    this.solveSudoku(grid);
    
    return grid;
  }

  /**
   * Solve a Sudoku grid using backtracking algorithm
   */
  private static solveSudoku(grid: SudokuGrid): boolean {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        // Find an empty cell
        if (grid[row][col] === this.EMPTY_CELL) {
          // Try placing numbers 1-9
          const numbers = this.getShuffledNumbers();
          for (const num of numbers) {
            // Check if placing the number is valid
            if (this.isValidPlacement(grid, row, col, num)) {
              grid[row][col] = num;
              
              // Recursively try to solve the rest of the grid
              if (this.solveSudoku(grid)) {
                return true;
              }
              
              // If placing the number doesn't lead to a solution, backtrack
              grid[row][col] = this.EMPTY_CELL;
            }
          }
          // No valid number found for this cell
          return false;
        }
      }
    }
    // All cells filled
    return true;
  }

  /**
   * Check if placing a number at a specific position is valid
   */
  private static isValidPlacement(grid: SudokuGrid, row: number, col: number, num: number): boolean {
    // Check row
    for (let i = 0; i < this.GRID_SIZE; i++) {
      if (grid[row][i] === num) {
        return false;
      }
    }
    
    // Check column
    for (let i = 0; i < this.GRID_SIZE; i++) {
      if (grid[i][col] === num) {
        return false;
      }
    }
    
    // Check 3x3 box
    const boxRow = Math.floor(row / this.BOX_SIZE) * this.BOX_SIZE;
    const boxCol = Math.floor(col / this.BOX_SIZE) * this.BOX_SIZE;
    
    for (let i = 0; i < this.BOX_SIZE; i++) {
      for (let j = 0; j < this.BOX_SIZE; j++) {
        if (grid[boxRow + i][boxCol + j] === num) {
          return false;
        }
      }
    }
    
    return true;
  }

  /**
   * Create a puzzle by removing numbers from a solved grid
   */
  private static createPuzzleFromSolution(solution: SudokuGrid, difficulty: Difficulty): SudokuGrid {
    // Create a deep copy of the solution
    const puzzle: SudokuGrid = JSON.parse(JSON.stringify(solution));
    
    // Determine how many cells to remove based on difficulty
    let cellsToRemove: number;
    switch (difficulty) {
      case 'easy':
        cellsToRemove = 35; // ~40 clues remaining
        break;
      case 'medium':
        cellsToRemove = 45; // ~30 clues remaining
        break;
      case 'hard':
        cellsToRemove = 52; // ~23 clues remaining
        break;
      case 'expert':
        cellsToRemove = 58; // ~17 clues remaining
        break;
      default:
        cellsToRemove = 45;
    }
    
    // Get all cell positions
    const positions: [number, number][] = [];
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        positions.push([row, col]);
      }
    }
    
    // Shuffle positions
    this.shuffleArray(positions);
    
    // Remove cells
    for (let i = 0; i < cellsToRemove && i < positions.length; i++) {
      const [row, col] = positions[i];
      puzzle[row][col] = this.EMPTY_CELL;
    }
    
    return puzzle;
  }

  /**
   * Get an array of numbers 1-9 in random order
   */
  private static getShuffledNumbers(): number[] {
    const numbers = Array.from({ length: this.GRID_SIZE }, (_, i) => i + 1);
    this.shuffleArray(numbers);
    return numbers;
  }

  /**
   * Shuffle an array in-place using Fisher-Yates algorithm
   */
  private static shuffleArray<T>(array: T[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  /**
   * Validate if a move is correct according to the solution
   */
  static validateMove(solution: SudokuGrid, row: number, col: number, value: number): boolean {
    return solution[row][col] === value;
  }

  /**
   * Check if the current grid matches the solution
   */
  static checkCompletion(grid: SudokuGrid, solution: SudokuGrid): boolean {
    for (let row = 0; row < this.GRID_SIZE; row++) {
      for (let col = 0; col < this.GRID_SIZE; col++) {
        if (grid[row][col] !== solution[row][col]) {
          return false;
        }
      }
    }
    return true;
  }
}