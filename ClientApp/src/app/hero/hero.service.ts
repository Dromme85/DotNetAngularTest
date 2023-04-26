import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Hero } from '../hero';
import { MessageService } from '../messages/message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private readonly heroesUrl = 'heroapi'; // URL to web api
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/gethero/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`)),
    );
  }

  getHeroes(): Observable<Hero[]> {
    const url = `${this.heroesUrl}`;
    return this.http.get<Hero[]>(url).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', [])),
    );
  }

  updateHero(hero: Hero): Observable<any> {
    const url = `${this.heroesUrl}/edithero`;
    return this.http.post<Hero>(url, hero, this.httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero')),
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    const url = `${this.heroesUrl}/addhero`;
    console.log(`addHero(${hero.name})`);
    console.log(hero);
    return this.http.post<Hero>(url, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id= ${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero')),
    );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/deletehero/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero')),
    );
  }

  searchHeroes(term: string): Observable<Hero[]> {
    if (!String(term).trim()) return of([]);

    return this.http.get<Hero[]>(`${this.heroesUrl}/search/${term}`).pipe(
      tap(x => x.length ? this.log(`found heroes matching "${term}"`) : this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', [])),
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }
}
