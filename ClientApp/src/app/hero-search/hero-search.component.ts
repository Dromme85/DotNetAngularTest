import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, startWith } from 'rxjs/operators';
import { Hero } from '../hero';
import { HeroService } from '../hero/hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  query?: string;
  heroes$!: Observable<Hero[]>;
  private searchTerms = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
  ) {
  }

  ngOnInit(): void {

    this.query = String(this.route.snapshot.paramMap.get('term'));
    if (this.query === "null") this.query = "";

    this.heroes$ = this.searchTerms.pipe(
      startWith(this.query),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
