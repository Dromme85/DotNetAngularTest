import { Component, OnInit } from '@angular/core';
import { HeroService } from '../hero/hero.service';
import { MessageService } from '../messages/message.service';
import { Hero } from '../hero';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css', '../hero/hero.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[] = [];

  isModalClosed = true;
  modalConfirm = false;
  heroToDelete?: Hero;

  selectedHero?: Hero;

  constructor(
    private heroService: HeroService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
    this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) return;

    var h = { name: name, power: "", alterEgo: "" } as Hero;
    
    this.heroService.addHero(h)
      .subscribe(hero => {
        this.heroes.push(hero);
        this.heroes = this.heroes.sort((a, b) => a.id - b.id);
      });
  }

  getModalEvent(modalEvent: boolean) {
    this.modalConfirm = modalEvent;
    this.isModalClosed = true;

    if (this.modalConfirm && this.heroToDelete !== undefined) {
      this.delete(this.heroToDelete);
      this.modalConfirm = false;
    }

    this.heroToDelete = undefined;
  }

  delete(hero: Hero): void {
    if (this.isModalClosed && this.heroToDelete === undefined) {
      this.isModalClosed = false;
      this.heroToDelete = hero;
    }
    else if (hero) {
      this.heroes = this.heroes.filter(h => h !== hero);
      this.heroService.deleteHero(hero.id).subscribe();
      if (this.selectedHero === hero)
        this.selectedHero = undefined;
    }
  }

}
