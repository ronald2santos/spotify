import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
    constructor() {}
    activeOverview = false;
    activeTopTracks = false;
    activeProfile = false;

    ngOnInit() {}

    onClick(event) {
        if (event.target.innerText === 'Overview') {
            this.activeOverview = true;
            this.activeTopTracks = false;
            this.activeProfile = false;
        } else if (event.target.innerText === 'Top Tracks') {
            this.activeOverview = false;
            this.activeTopTracks = true;
            this.activeProfile = false;
        } else {
            this.activeOverview = false;
            this.activeTopTracks = false;
            this.activeProfile = true;
        }
    }
}
