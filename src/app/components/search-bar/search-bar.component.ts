import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SpotifyService } from '../../services/spotify.service';
import { ArtistService } from '../../services/artist.service';
import { TrackService } from '../../services/track.service';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Artist } from 'src/app/typing/artist';

@Component({
    selector: 'app-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit {
    // tslint:disable-next-line: max-line-length
    constructor(
        private trackService: TrackService,
        private spotify: SpotifyService,
        private artistService: ArtistService,
        private router: Router
    ) {}
    radioButton: FormControl = new FormControl('artists');
    queryField: FormControl = new FormControl();
    results: any[] = [];
    selectedOption = 'artists';
    selectedArtistIndex: number;
    selectedArtist: Artist;
    selectedTrackIndex: number;
    selectedTrack;

    ngOnInit() {
    this.radioButton.valueChanges.subscribe(
      (selectedOption) => {
        this.selectedOption = selectedOption;
        this.results = [];
      }
    );

    this.queryField.valueChanges.pipe(filter(term => term), debounceTime(200), distinctUntilChanged())
      .subscribe(queryField => {
        if (this.selectedOption === 'artists') {
          this.spotify.searchArtists(queryField)
            .subscribe(response => {
              this.results = response.artists.items;
            });
        } else {
          this.spotify.searchTracks(queryField)
            .subscribe(response => {
              this.results = response.tracks.items;
            });
        }
      }
      );
  }

  onArtistSelect(i: number) {
    this.selectedArtistIndex = i;
    this.selectedArtist = this.results[i];
    console.log(this.selectedArtist);
    this.trackService.setSelectedTrack(null);
    this.artistService.setSelectedArtist(this.selectedArtist);
    this.router.navigate(['/overview']);
    this.results = [];
  }

  onTrackSelect(i: number) {
    this.selectedTrackIndex = i;
    this.selectedTrack = this.results[i];
    this.artistService.setSelectedArtist(null);
    this.trackService.setSelectedTrack(this.selectedTrack);
    this.router.navigate(['/overview']);
    this.results = [];
  }
}
