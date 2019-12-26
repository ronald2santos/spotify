import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  timeRangeForm;
  trackLimitForm;
  timeRangeSelector: FormControl = new FormControl('medium_term');
  trackLimitSelector: FormControl = new FormControl('20');
  user;
  artists;
  tracks;
  timeRange: string;
  trackLimit: number;

  constructor(private spotify: SpotifyService, private fb: FormBuilder) {
    this.timeRangeForm = new FormGroup({
      timeRangeSelector : this.timeRangeSelector
    });
    this.trackLimitForm = new FormGroup({
      trackLimitSelector : this.trackLimitSelector
    });
  }

  ngOnInit() {
    this.timeRangeSelector.valueChanges.subscribe(
      (timeRange) => {
        this.timeRange = timeRange;
        this.getUserTopTracks();
      }
    );

    this.trackLimitSelector.valueChanges.subscribe(
      (trackLimit) => {
        this.trackLimit = trackLimit;
        this.getUserTopTracks();
      }
    );

    this.getUserProfile();
    this.getUserTopArtists();
    this.getUserTopTracks();
  }

  getUserProfile() {
    this.spotify.getCurrentUserProfile().subscribe(
      (user) => {
        // console.log(user);
        this.user = user;
      }
    );
  }

  getUserTopArtists() {
    this.spotify.getUserTopArtists().subscribe(
      (artists) => {
        console.log(artists);
        this.artists = artists.items;
      }
    );
  }

  getUserTopTracks() {
    this.spotify.getUserTopTracks(this.trackLimit, this.timeRange).subscribe(
      (tracks) => {
        // console.log(tracks);
        this.tracks = tracks.items;
      }
    );
  }

}
