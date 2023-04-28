import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { GoogleChartsModule } from 'angular-google-charts';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { SidebarMenuComponent } from './sidebar-menu/sidebar-menu.component';
import { HeroComponent } from './hero/hero.component';
import { StatsComponent } from './stats/stats.component';
import { HeroesComponent } from './heroes/heroes.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { MessagesComponent } from './messages/messages.component';
import { HeroSearchComponent } from './hero-search/hero-search.component';
import { ModalComponent } from './modal/modal.component';
import { TreeGridComponent } from './tree-grid/tree-grid.component';
import { CookieService } from 'ngx-cookie-service';
import { CreditCardComponent } from './credit-card/credit-card.component';
import { CreditCardPipe } from './credit-card/credit-card.pipe';
import { CreditCardDirective } from './credit-card/credit-card.directive';
import { ChessComponent } from './chess/chess.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    SidebarMenuComponent,
    HeroComponent,
    StatsComponent,
    HeroesComponent,
    HeroDetailComponent,
    MessagesComponent,
    HeroSearchComponent,
    ModalComponent,
    TreeGridComponent,
    CreditCardComponent,
    CreditCardPipe,
    CreditCardDirective,
    ChessComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    GoogleChartsModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'home', redirectTo: '', component: CounterComponent },
      { path: 'counter', component: CounterComponent },
      { path: 'weather', component: FetchDataComponent },
      { path: 'hero', component: HeroComponent },
      { path: 'detail/:id', component: HeroDetailComponent },
      { path: 'hero/:id', component: HeroDetailComponent },
      { path: 'stats', component: StatsComponent },
      { path: 'search/:term', component: HeroSearchComponent },
      { path: 'search', component: HeroSearchComponent },
      { path: 'treegrid', component: TreeGridComponent },
      { path: 'card', component: CreditCardComponent },
      { path: 'chess', component: ChessComponent },
    ]),
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
