import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
    constructor(private router: Router) {}

    ngOnInit(): void {}

    login() {
        window.location.href = 'https://spotify-stats-angular.herokuapp.com/login';
        // window.location.href = "http://localhost:8888/login";
    }
}
