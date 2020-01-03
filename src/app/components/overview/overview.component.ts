import { Component, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { ArtistService } from '../../services/artist.service';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from 'src/app/typing/artist';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation } from '../../router.animation';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  animations: [fadeInAnimation]
})
export class OverviewComponent implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private trackService: TrackService, private artistService: ArtistService, private spotify: SpotifyService, private route: ActivatedRoute) {
    this.responsiveOptions = [
      {
        breakpoint: '1668px',
        numVisible: 7,
        numScroll: 7
      },
      {
        breakpoint: '1400px',
        numVisible: 6,
        numScroll: 6
      },
      {
        breakpoint: '950px',
        numVisible: 4,
        numScroll: 4
      },
      {
        breakpoint: '560px',
        numVisible: 3,
        numScroll: 3
      }
    ];
  }
  responsiveOptions;
  selectedArtist;
  selectedTrack;
  topTracks;
  relatedArtists;
  following: boolean;
  tempo: number;
  duration: number;
  keyModeData: object;
  keyMode: string;


  ngOnInit() {
    this.artistService.artistObservable.subscribe((artist) => {
      this.selectedArtist = artist;
      this.getArtistData(artist.id);
    });
    this.trackService.trackObservable.subscribe((track) => this.selectedTrack = track);
  }

  onArtistSelect(artist) {
    this.selectedArtist = artist;
    this.trackService.setSelectedTrack(null);
    this.artistService.setSelectedArtist(this.selectedArtist);
    this.getArtistData(artist.id);
    // this.router.navigate(['/overview']);
  }

  onTrackSelect(track) {
    this.selectedTrack = track;
    this.artistService.setSelectedArtist(null);
    this.trackService.setSelectedTrack(this.selectedTrack);
    // this.router.navigate(['/overview']);
  }

  getArtistData(artistID: string) {
    this.spotify.getArtistsTopTracks(artistID).subscribe(
      (topTracks) => {
        console.log(topTracks);
        this.topTracks = topTracks.tracks;
      }
    );
    this.spotify.getRelatedArtists(artistID).subscribe(
      (relatedArtists) => {
        console.log(relatedArtists)
        this.relatedArtists = relatedArtists.artists;
      }
    )
    this.checkFollowing(artistID);
  }

  checkFollowing(artistID: string) {
    // console.log('Cheking Follow status');
    this.spotify.checkIfUserFollowsArtists([artistID]).subscribe(
      (following) => {
        console.log(following);
        this.following = following;
      }
    );
  }

}
