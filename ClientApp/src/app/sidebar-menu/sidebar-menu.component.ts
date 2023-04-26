import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  isClosed = true;
  isDarkMode = false;
  @Output() darkModeEvent = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private cookieService: CookieService,
  ) { }

  ngOnInit(): void {
    this.isDarkMode = this.cookieService.get('darkMode') === 'true' ? true : false;
  }

  collapse() {
    if (this.isClosed === false)
      this.isClosed = true;
  }

  openSearch() {
    this.isClosed = false;
  }

  toggleCollapse() {
    this.isClosed = !this.isClosed;
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    this.darkModeEvent.emit(this.isDarkMode);
    this.cookieService.set('darkMode', this.isDarkMode ? 'true' : 'false');
  }

  getDarkModeText() {
    if (this.isDarkMode) return "Light Mode";
    return "Dark Mode";
  }

  search(term: string): void {
    this.collapse();
    if (term.length > 1 && term !== "null") {
      this.router.navigate(['/search', term]);
    }
  }
}
