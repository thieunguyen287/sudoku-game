export type SudokuCell = number | null;
export type SudokuGrid = SudokuCell[][];
export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export interface SudokuGame {
  id: string;
  grid: SudokuGrid;
  difficulty: Difficulty;
  isComplete?: boolean;
  startTime?: Date;
  endTime?: Date;
}

export interface SudokuMove {
  row: number;
  col: number;
  value: number;
}

export interface MoveResponse {
  valid: boolean;
  isComplete?: boolean;
  grid?: SudokuGrid;
  message?: string;
}

export interface HintResponse {
  hint: {
    row: number;
    col: number;
    value: number;
  };
}

export interface ValidationResponse {
  valid: boolean;
  errors?: { row: number; col: number }[];
}