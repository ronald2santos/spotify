import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import queryString from 'query-string';
import { slideInAnimation, fadeInAnimation } from './router.animation';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    animations: [slideInAnimation, fadeInAnimation],
})
export class AppComponent implements OnInit, OnChanges {
    title = 'spotify-analytics';
    token: string = window.localStorage.getItem('Token');
    refreshToken: string = window.localStorage.getItem('refreshToken');

    constructor(private router: Router) {}

    ngOnInit(): void {
        this.checkToken();
    }

    ngOnChanges(): void {
        this.checkToken();
    }

  checkToken() {
    if (!this.token || this.token === 'undefined') {
      const parsed = queryString.parse(window.location.search);
      const token = parsed.access_token;
      const refreshToken = parsed.refresh_token;
      if (token === undefined) {
        this.router.navigate(['/login']);
      }
      window.localStorage.setItem('Token', token);
      window.localStorage.setItem('refreshToken', refreshToken);
      this.token = token;
    }
  }
}
