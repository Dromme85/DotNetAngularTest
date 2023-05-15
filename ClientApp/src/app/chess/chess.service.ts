import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, lastValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  private readonly chessUrl = 'chessapi';
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  private notation?: string[] = [];

  constructor(
    private http: HttpClient,
  ) { }

  async getNotation(): Promise<string[]> {
    await this.getAsyncNotation();
    if (this.notation !== undefined)
      return this.notation;
    return [];
  }

  private async getAsyncNotation() {
    const url = `${this.chessUrl}/getnotation`;

    const nn$ = this.http.get<string[]>(url);
    this.notation = await lastValueFrom(nn$);
  }

  addNotation(n: string): Observable<string[]> {
    const url = `${this.chessUrl}/addnotation`;
    console.log('Still trying to save move', n);
    return this.http.post<string[]>(url, `{ \"value\": \"${n}\" }`, this.httpOptions).pipe();
  }

  newNotation(): Observable<number> {
    const url = `${this.chessUrl}/newnotation`;
    return this.http.get<number>(url).pipe();
  }

  resetNotation() {
    const url = `${this.chessUrl}/resetnotation/0`;
    console.log('Trying to reset the board');
    this.http.post<string[]>(url, this.httpOptions).pipe(
      tap(_ => console.log('Reset Successful')),
      catchError(this.handleError<string[]>('resetNotation', [])),
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(operation, error);

      return of(result as T);
    };
  }
}
