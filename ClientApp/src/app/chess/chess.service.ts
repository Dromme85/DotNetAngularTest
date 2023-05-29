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
    const url = `${this.chessUrl}/getnotation`;

    const nn$ = this.http.get<string[]>(url);
    this.notation = await lastValueFrom(nn$);

    if (this.notation !== undefined)
      return this.notation;

    return [];
  }

  addNotation(n: string): Observable<string[]> {
    const url = `${this.chessUrl}/addnotation`;
    return this.http.post<string[]>(url, `{ \"value\": \"${n}\" }`, this.httpOptions).pipe();
  }

  async removeNotation(n: number = 1) {
    const url = `${this.chessUrl}/removenotation/${n}`;
    await lastValueFrom(this.http.delete(url, this.httpOptions));
  }

  newNotation(): Observable<number> {
    const url = `${this.chessUrl}/newnotation`;
    return this.http.get<number>(url).pipe();
  }

  //async resetNotation() {
  //  const url = `${this.chessUrl}/resetnotation/0`;
  //  console.log('Trying to reset the board');
  //  await lastValueFrom(this.http.post<string[]>(url, this.httpOptions));
  //}
}
