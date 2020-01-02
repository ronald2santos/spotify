import { Component, OnInit, ViewChild } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { ArtistService } from '../../services/artist.service';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from 'src/app/typing/artist';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-overview',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
    // tslint:disable-next-line: max-line-length
    constructor(
        private trackService: TrackService,
        private artistService: ArtistService,
        private spotify: SpotifyService,
        private route: ActivatedRoute
    ) {}
    selectedArtist;
    selectedTrack;
    following: boolean;
    tempo: number;
    duration: number;
    keyModeData: object;
    keyMode: string;

    ngOnInit() {
        this.artistService.artistObservable.subscribe((artist) => (this.selectedArtist = artist));
        this.trackService.trackObservable.subscribe((track) => (this.selectedTrack = track));
    }

    // checkFollowing(id: string) {
    //   // console.log('Cheking Follow status');
    //   this.spotify.checkIfUserFollowsArtists([id]).subscribe(
    //     (following) => {
    //       // console.log(following);
    //       this.following = following;
    //     }
    //   );
    // }
}
