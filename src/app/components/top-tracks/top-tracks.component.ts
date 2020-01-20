import { Component, OnInit } from '@angular/core';
import { Artist } from '../../typing/artist';
import { SpotifyService } from '../../services/spotify.service';
import { ArtistService } from '../../services/artist.service';

@Component({
    selector: 'app-top-tracks',
    templateUrl: './top-tracks.component.html',
    styleUrls: ['./top-tracks.component.css'],
})
export class TopTracksComponent implements OnInit {
    constructor(private spotify: SpotifyService, private artistService: ArtistService) {}
    selectedArtist: Artist;
    topTracks = [];
    ngOnInit() {
        // this.artistService.artistObservable.subscribe((artist) => {
        //   this.selectedArtist = artist;
        //   this.spotify.getArtistsTopTracks(artist.id).subscribe(
        //     (tracks) => {
        //       this.topTracks = tracks.tracks;
        //     }
        //   );
        // });
    }
}
