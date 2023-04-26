import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';
  isDarkMode: boolean = false;

  constructor(private cookieService: CookieService) {

  }

  ngOnInit(): void {
    this.isDarkMode = this.cookieService.get('darkMode') === 'true' ? true : false;
  }

  eatAllCookies() {
    this.cookieService.deleteAll();
  }

  getDarkModeEvent(darkModeEvent: boolean) {
    this.isDarkMode = darkModeEvent;
  }
}
