import { Component, OnInit } from '@angular/core';
import { ArtistService } from '../../services/artist.service';


@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
    constructor(private artistService: ArtistService, ) {}
    activeOverview = false;
    activeProfile = false;
    overviewHidden = true;

    ngOnInit() {
        this.artistService.artistObservable.subscribe((artist) => {
            if (artist) {
              this.overviewHidden = false
            }
          });
    }

    onClick(event) {
        if (event.target.innerText === 'Overview') {
            this.activeOverview = true;
            this.activeProfile = false;
        } else {
            this.activeOverview = false;
            this.activeProfile = true;
        }
    }
}
