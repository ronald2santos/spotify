import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { TrackService } from '../../services/track.service';
import { ArtistService } from '../../services/artist.service';
import { PlaybackService } from '../../services/playback.service';
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
  /// State of song reproduction
  isPlaying = false;
  /// State of player UI
  playerIsPaused = true;
  // private nowPlayingSongId: number;
  volumeProgress = '70%';
  volumePercentage = 70;
  updateVolumeToggle = false;
  playbackProgress = '0%';
  playbackPercentage = 0;
 updatePlaybackToggle = false;
  currentPlaybackPosition: number;
  previousVolume: number;
  currentTrack;
  devices;
  device;
  sdk;
  state;
  timer;

  // tslint:disable-next-line: max-line-length
  constructor(private router: Router, private spotify: SpotifyService, private artistService: ArtistService, private trackService: TrackService, private playbackService: PlaybackService) { }

  async ngOnInit() {
    this.playbackService.playingObservable.subscribe((state) => {
      this.isPlaying = state;
    });

    this.sdk = await this.playbackService.loadPlayer();
    const connected = await this.sdk.connect();

    if (connected) {

      this.sdk.addListener('ready', ({ device_id }) => {
        this.spotify.getCurrentPlaybackInfo().subscribe(
          (playbackInfo) => {
            if (!playbackInfo || !playbackInfo.is_playing) {
              this.spotify.changeDevice(device_id).subscribe();
            } else {
              // if no playback from other spotify player set playing true when new play song is triggered in app
              this.playbackService.setIsPlaying(true);
              this.startTimer();
            }
          }
        );
      });

      this.sdk.addListener('player_state_changed', ({
        track_window: { current_track }
      }) => {
        this.currentTrack = current_track;
        this.sdk.getCurrentState().then(state => {
          this.state = state;
          this.currentPlaybackPosition = state.position;
          this.playbackPercentage = (state.position * 100) / this.currentTrack.duration_ms;

          if (this.isPlaying && this.playerIsPaused) {
            this.startTimer();
          }
        });
      });
    }
  }

  playTrack(): void {
    if (this.isPlaying) {
      this.pauseTrack();
      return;
    }

    setTimeout(() => {
      this.sdk.resume().then(() => {
        this.playbackService.setIsPlaying(true);
        // this.isPlaying = true;
        this.startTimer();
      });
    });
  }

  pauseTrack(): void {
    this.sdk.pause().then(() => {
      // this.isPlaying = false;
      this.playbackService.setIsPlaying(false);
      this.stopTimer();
    });
  }

  /// Playback progress

  startTimer() {
    if (this.isPlaying) {
      this.playerIsPaused = false;
      this.timer = setInterval(() => {
        if (this.playbackPercentage >= 99.5) {
          this.playbackPercentage = 0;
          this.playbackProgress = '0%';
          if (this.state.track_window.next_tracks.length === 0) {
            this.stopTimer();
            this.playbackService.setIsPlaying(false);
            // this.isPlaying = false;

          }
        }
        this.currentPlaybackPosition = this.currentPlaybackPosition + 1000;
        this.playbackPercentage = this.playbackPercentage + (100000 / (this.currentTrack.duration_ms));
        this.playbackProgress = this.playbackPercentage + '%';
      }, 1000);
    }
  }

  stopTimer() {
    clearInterval(this.timer);
    this.playerIsPaused = true;
  }

  ////

  playPreviousTrack(): void {
    if (this.state.track_window.previous_tracks.length > 0) {
      this.stopTimer();
      this.sdk.previousTrack().then(() => {
        // this.isPlaying = true;
        this.playbackService.setIsPlaying(true);
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
        // this.isPlaying = true;
        this.playbackService.setIsPlaying(true);
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

  showDevices(event, data, op) {
    this.spotify.getUserAvailableDevices().subscribe((devices) => {
      console.log(devices);
      this.devices = devices.devices;
    });
    op.toggle(event);
  }

  chooseDevice(event, device, op) {
    this.spotify.changeDevice(device.id).subscribe(
      () => {
        this.spotify.getUserAvailableDevices().subscribe((devices) => {
          console.log(devices);
          this.devices = devices.devices;
          op.hide();
          op.show(event);
          console.log(this.playerIsPaused)
          console.log(this.isPlaying)
          if(this.isPlaying && this.playerIsPaused) {
            this.startTimer();
          } else {
            this.stopTimer();
          }
        });
      }
    );

  }

}
