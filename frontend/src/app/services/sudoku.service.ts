import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { 
  SudokuGame, 
  SudokuMove, 
  MoveResponse, 
  HintResponse, 
  ValidationResponse, 
  Difficulty 
} from '../models/sudoku.model';

@Injectable({
  providedIn: 'root'
})
export class SudokuService {
  private apiUrl = 'http://localhost:12000/api/sudoku';

  constructor(private http: HttpClient) { }

  /**
   * Generate a new Sudoku game
   */
  generateGame(difficulty: Difficulty = 'medium'): Observable<SudokuGame> {
    return this.http.get<SudokuGame>(`${this.apiUrl}/new?difficulty=${difficulty}`);
  }

  /**
   * Get a specific game by ID
   */
  getGame(gameId: string): Observable<SudokuGame> {
    return this.http.get<SudokuGame>(`${this.apiUrl}/${gameId}`);
  }

  /**
   * Make a move in the game
   */
  makeMove(gameId: string, move: SudokuMove): Observable<MoveResponse> {
    return this.http.post<MoveResponse>(`${this.apiUrl}/${gameId}/move`, move);
  }

  /**
   * Get a hint for the current game
   */
  getHint(gameId: string): Observable<HintResponse> {
    return this.http.get<HintResponse>(`${this.apiUrl}/${gameId}/hint`);
  }

  /**
   * Validate the current grid
   */
  validateGrid(gameId: string): Observable<ValidationResponse> {
    return this.http.get<ValidationResponse>(`${this.apiUrl}/${gameId}/validate`);
  }
}
