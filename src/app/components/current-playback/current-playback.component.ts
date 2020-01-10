import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { TrackService } from '../../services/track.service';
import { ArtistService } from '../../services/artist.service';
import { Router } from '@angular/router';

declare global {
  interface Window { Spotify: any; onSpotifyWebPlaybackSDKReady: any; }
}


@Component({
  selector: 'app-current-playback',
  templateUrl: './current-playback.component.html',
  styleUrls: ['./current-playback.component.css']
})
export class CurrentPlaybackComponent implements OnInit {

  isPlaying = false;
  private nowPlayingSongId: number;
  volumeProgress = '70%';
  private volumePercentage = 70;
  private updateVolumeToggle = false;
  playbackProgress = '0%';
  private playbackPercentage = 0;
  private updatePlaybackToggle = false;
  currentPlaybackPosition: number;
  previousVolume: number;

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private spotify: SpotifyService, private artistService: ArtistService, private trackService: TrackService) { }


  currentTrack;
  device;
  sdk;
  state;
  timer;

  ngOnInit() {
    this.loadPlayer();
  }

  async loadPlayer() {
    const { Player }: any = await this.waitForSpotifyWebPlaybackSDKToLoad();

    const sdk = new Player({
      name: 'Spotify Analytics',
      volume: 0.7,
      getOAuthToken: callback => { callback(window.localStorage.getItem('Token')); }
    });

    this.sdk = sdk;

    const connected = await sdk.connect();

    if (connected) {

      sdk.addListener('ready', ({ device_id }) => {
        this.spotify.getCurrentPlaybackInfo().subscribe(
          (playbackInfo) => {
            console.log(playbackInfo);
            if (!playbackInfo || !playbackInfo.is_playing) {
              this.spotify.changeDevice(device_id).subscribe(
                (response) => {
                  console.log(response);
                }
              );
            } else {
              // if no playback from other spotify player set platying true when new play song is triggered in app
              this.isPlaying = true;
              this.startTimer();
            }
          }
        );
      });

      sdk.addListener('player_state_changed', ({
        track_window: { current_track }
      }) => {
        this.currentTrack = current_track;
        sdk.getCurrentState().then(state => {
          this.state = state;
          this.currentPlaybackPosition = state.position;
          this.playbackPercentage = (state.position * 100) / this.currentTrack.duration_ms;
        });
      });
    }
  }

  async waitForSpotifyWebPlaybackSDKToLoad() {
    return new Promise(resolve => {
      if (window.Spotify) {
        resolve(window.Spotify);
      } else {
        window.onSpotifyWebPlaybackSDKReady = () => {
          resolve(window.Spotify);
        };
      }
    });
  }

  playTrack(): void {
    console.log(this.state);
    if (this.isPlaying) {
      this.pauseTrack();
      return;
    }

    setTimeout(() => {
      this.sdk.resume().then(() => {
        this.isPlaying = true;
        this.startTimer();
      });
    });
  }

  pauseTrack(): void {
    this.sdk.pause().then(() => {
      this.isPlaying = false;
      this.stopTimer();
    });
  }

  /// Playback progress

  startTimer() {
    if (this.isPlaying) {
      this.timer = setInterval(() => {
        if (this.playbackPercentage >= 99.5) {
          this.playbackPercentage = 0;
          this.playbackProgress = '0%';
        }
        this.currentPlaybackPosition = this.currentPlaybackPosition + 1000;
        this.playbackPercentage = this.playbackPercentage + (100000 / (this.currentTrack.duration_ms));
        this.playbackProgress = this.playbackPercentage + '%';
      }, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.timer);
  }

  ////

  playPreviousTrack(): void {
    if (this.state.track_window.previous_tracks.length > 0) {
      this.stopTimer();
      this.sdk.previousTrack().then(() => {
        this.isPlaying = true;
        this.playbackProgress = '0%';
        this.playbackPercentage = 0;
        this.startTimer();
      }).catch(() => this.stopTimer());
    }
  }

  playNextTrack(): void {
    if (this.state.track_window.next_tracks.length > 0) {
      this.stopTimer();
      this.sdk.nextTrack().then(() => {
        this.isPlaying = true;
        this.playbackProgress = '0%';
        this.playbackPercentage = 0;
        this.startTimer();
      }).catch(() => this.stopTimer());
    }
  }

  getVolume() {
    this.sdk.getVolume().then(volume => {
      this.volumePercentage = volume * 100;
    });
  }

  startUpdateVolume() {
    this.updateVolumeToggle = true;
  }

  endUpdateVolume() {
    this.updateVolumeToggle = false;
  }

  updateVolume(event) {
    if (this.updateVolumeToggle) {

      this.volumePercentage = Math.floor(
        (event.layerX / (event.target.offsetWidth - 3)) * 100
      );

      if (this.volumePercentage > 100) {
        this.volumePercentage = 100;
      } else if (this.volumePercentage < 0) {
        this.volumePercentage = 0;
      }

      this.sdk.setVolume(this.volumePercentage / 100).then();

      this.volumeProgress = this.volumePercentage + '%';
    }
  }

  increaseVolume(event) {
    this.volumePercentage = Math.floor(
      (event.layerX / (event.target.offsetWidth - 3)) * 100
    );

    if (this.volumePercentage > 100) {
      this.volumePercentage = 100;
    } else if (this.volumePercentage < 0) {
      this.volumePercentage = 0;
    }

    this.sdk.setVolume(this.volumePercentage / 100).then();

    this.volumeProgress = this.volumePercentage + '%';
  }

  startUpdatePlayback() {
    this.updatePlaybackToggle = true;
  }

  endUpdatePlayback() {
    this.updatePlaybackToggle = false;
  }


  updatePlayback(event) {
    if (this.updatePlaybackToggle) {

      this.playbackPercentage = Math.floor(
        (event.layerX / (event.target.offsetWidth - 3)) * 100
      );

      if (this.playbackPercentage > 100) {
        this.playbackPercentage = 100;
      } else if (this.playbackPercentage < 0) {
        this.playbackPercentage = 0;
      }

      this.currentPlaybackPosition = (this.playbackPercentage * this.currentTrack.duration_ms) / 100;

      this.sdk.seek(this.currentPlaybackPosition).then();

      this.playbackProgress = this.playbackPercentage + '%';
    }
  }

  increasePlayback(event) {
    this.playbackPercentage = Math.floor(
      (event.layerX / (event.target.offsetWidth - 3)) * 100
    );

    if (this.playbackPercentage > 100) {
      this.playbackPercentage = 100;
    } else if (this.playbackPercentage < 0) {
      this.playbackPercentage = 0;
    }

    this.currentPlaybackPosition = (this.playbackPercentage * this.currentTrack.duration_ms) / 100;

    this.sdk.seek(this.currentPlaybackPosition).then();

    this.playbackProgress = this.playbackPercentage + '%';
  }

  muteSong() {
    if (this.volumePercentage > 0) {
      this.sdk.setVolume(0).then();
      this.previousVolume = this.volumePercentage;
      this.volumePercentage = 0;
      this.volumeProgress = '0%';
    } else {
      this.sdk.setVolume(this.previousVolume / 100).then();
      this.volumePercentage = this.previousVolume;
      this.volumeProgress = this.previousVolume + '%';
    }

  }

  onTrackSelect() {
    this.artistService.setSelectedArtist(null);
    this.trackService.setSelectedTrack(this.state.track_window.current_track);
    this.router.navigate(['/overview']);
  }

}
