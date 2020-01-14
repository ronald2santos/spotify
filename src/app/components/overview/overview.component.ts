import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { ArtistService } from '../../services/artist.service';
import { SpotifyService } from '../../services/spotify.service';
import { PlaybackService } from '../../services/playback.service';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInAnimation } from '../../router.animation';
import { Carousel } from 'primeng/carousel';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  animations: [fadeInAnimation]
})

export class OverviewComponent implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private trackService: TrackService, private playbackService: PlaybackService, private artistService: ArtistService, private spotify: SpotifyService, private route: ActivatedRoute) {
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
      },
      {
        breakpoint: '420px',
        numVisible: 2,
        numScroll: 2
      }
    ];
  }

  @ViewChild('targetTrack', { static: false }) trackDiv: ElementRef;
  @ViewChild('targetArtist', { static: false }) artistDiv: ElementRef;
  @ViewChild(Carousel, { static: false }) chart: Carousel;

  responsiveOptions;
  selectedArtist;
  selectedTrack;
  topTracks;
  relatedArtists;
  following: boolean;
  avgTrackTempo: number;
  tempo: number;
  duration: number;
  keyModeData: object;
  keyMode: string;
  sdk;


  ngOnInit() {
    Carousel.prototype.onTouchEnd = null;
    // Carousel.prototype.changePageOnTouch = null;
    this.artistService.artistObservable.subscribe((artist) => {
      this.selectedArtist = artist;
      if (artist) {
        this.getArtistData(artist.id);
      }
    });
    this.trackService.trackObservable.subscribe((track) => this.selectedTrack = track);
  }

  onArtistSelect(artist) {
    if (this.selectedArtist && (artist.id === this.selectedArtist.id)) {
      this.artistDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.selectedArtist = artist;
      this.trackService.setSelectedTrack(null);
      this.artistService.setSelectedArtist(this.selectedArtist);
      this.getArtistData(artist.id);
      if (this.artistDiv) {
        this.artistDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.router.navigate(['/overview']);
    }
  }

  onTrackSelect(track) {
    this.selectedTrack = track;
    if (this.trackDiv) {
      this.trackDiv.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    this.trackService.setSelectedTrack(this.selectedTrack);
  }

  selectArtistFromTrack(artistID: string) {
    this.spotify.getArtist(artistID).subscribe(
      (artist) => {
        this.onArtistSelect(artist);
      }
    );
  }

  getArtistData(artistID: string) {
    this.spotify.getArtistsTopTracks(artistID).subscribe(
      (topTracks) => {
        this.topTracks = topTracks.tracks;
      }
    );
    this.spotify.getRelatedArtists(artistID).subscribe(
      (relatedArtists) => {
        this.relatedArtists = relatedArtists.artists;
      }
    );
    this.checkFollowing(artistID);
  }

  checkFollowing(artistID: string) {
    this.spotify.checkIfUserFollowsArtists([artistID]).subscribe(
      (following) => {
        this.following = following[0];
      }
    );
  }

  follow() {
    this.spotify.followArtist(this.selectedArtist.id).subscribe(
      (followStatus) => {
        this.checkFollowing(this.selectedArtist.id);
      }
    );
  }

  unfollow() {
    this.spotify.unfollowArtist(this.selectedArtist.id).subscribe(
      (followStatus) => {
        this.checkFollowing(this.selectedArtist.id);
      }
    );
  }

  playSong() {
    this.spotify.getUserAvailableDevices().subscribe(
      (devices) => {
        const device = devices.devices.filter((e) => e.name === 'Spotify Analytics');
        // if (!device) {
        // }
        this.spotify.playTrackURI(device[0].id, this.selectedTrack.uri).subscribe(
          (playing) => {
            this.playbackService.setIsPlaying(true);
          }
        );
      }
    );
  }

}
