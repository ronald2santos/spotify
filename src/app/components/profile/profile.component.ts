import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { TrackService } from '../../services/track.service';
import { ArtistService } from '../../services/artist.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
    selectedArtist;
    selectedTrack;
    timeRangeForm;
    trackLimitForm;
    timeRangeSelector: FormControl = new FormControl('medium_term');
    trackLimitSelector: FormControl = new FormControl('20');
    responsiveOptions;
    user;
    artists;
    tracks;
    timeRange: string;
    trackLimit: number;

    constructor(
        private spotify: SpotifyService,
        private trackService: TrackService,
        private artistService: ArtistService,
        private router: Router,
        private fb: FormBuilder
    ) {
        this.timeRangeForm = new FormGroup({
            timeRangeSelector: this.timeRangeSelector,
        });
        this.trackLimitForm = new FormGroup({
            trackLimitSelector: this.trackLimitSelector,
        });
        this.responsiveOptions = [
            {
                breakpoint: '1668px',
                numVisible: 8,
                numScroll: 8,
            },
            {
                breakpoint: '1400px',
                numVisible: 6,
                numScroll: 6,
            },
            {
                breakpoint: '950px',
                numVisible: 4,
                numScroll: 4,
            },
            {
                breakpoint: '560px',
                numVisible: 3,
                numScroll: 3,
            },
        ];
    }

    ngOnInit() {
        this.timeRangeSelector.valueChanges.subscribe((timeRange) => {
            this.timeRange = timeRange;
            this.getUserTopTracks();
            this.getUserTopArtists();
        });

        this.trackLimitSelector.valueChanges.subscribe((trackLimit) => {
            this.trackLimit = trackLimit;
            this.getUserTopTracks();
            this.getUserTopArtists();
        });

        this.getUserProfile();
        this.getUserTopArtists();
        this.getUserTopTracks();
    }

    getUserProfile() {
        this.spotify.getCurrentUserProfile().subscribe((user) => {
            // console.log(user);
            this.user = user;
        });
    }

    getUserTopArtists() {
        this.spotify.getUserTopArtists(this.trackLimit, this.timeRange).subscribe((artists) => {
            console.log(artists);
            this.artists = artists.items;
        });
    }

    getUserTopTracks() {
        this.spotify.getUserTopTracks(this.trackLimit, this.timeRange).subscribe((tracks) => {
            console.log(tracks);
            this.tracks = tracks.items;
        });
    }

    onArtistSelect(artist) {
        this.selectedArtist = artist;
        this.trackService.setSelectedTrack(null);
        this.artistService.setSelectedArtist(this.selectedArtist);
        this.router.navigate(['/overview']);
    }

    onTrackSelect(track) {
        this.selectedTrack = track;
        this.artistService.setSelectedArtist(null);
        this.trackService.setSelectedTrack(this.selectedTrack);
        this.router.navigate(['/overview']);
    }

    logout() {
        // window.location.href = 'http://spotify-stats-angular.herokuapp.com/login';
        window.localStorage.clear();
        this.router.navigate(['/login']);
    }
}
