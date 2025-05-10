export type SudokuCell = number | null;
export type SudokuGrid = SudokuCell[][];
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuGame {
  id: string;
  grid: SudokuGrid;
  solution: SudokuGrid;
  difficulty: Difficulty;
  createdAt: Date;
}

export interface SudokuMove {
  row: number;
  col: number;
  value: number;
}

export interface GameState {
  gameId: string;
  grid: SudokuGrid;
  startTime: Date;
  endTime?: Date;
  isComplete: boolean;
}