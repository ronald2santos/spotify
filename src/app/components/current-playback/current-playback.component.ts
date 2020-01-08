import { Component, OnInit, ViewChild } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-current-playback',
  templateUrl: './current-playback.component.html',
  styleUrls: ['./current-playback.component.css']
})
export class CurrentPlaybackComponent implements OnInit {

  private isPlaying: boolean = false;
  private nowPlayingSongId: number;
  volumeProgress: string = '70%';
  private volumePercentage: number = 70;
  private updateVolumeToggle: boolean = false;
  private playbackProgress: string = '0%';
  private playbackPercentage: number = 0;
  private updatePlaybackToggle: boolean = false;
  currentPlaybackPosition: number;

  constructor(private spotify: SpotifyService) { }

  currentTrack;
  device;
  sdk;
  state;
  timer;

  ngOnInit() {
    this.loadPlayer();
    this.getVolume();
  }

  async loadPlayer() {
    const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();

    const sdk = new Player({
      name: 'Spotify Analytics',
      volume: 0.7,
      getOAuthToken: callback => { callback(window.localStorage.getItem('Token')); }
    });

    this.sdk = sdk;

    const connected = await sdk.connect();

    if (connected) {

      // sdk.addListener('ready', ({ device_id }) => {
      //   this.spotify.changeDevice(device_id).subscribe(
      //     (response) => {
      //       console.log(response);
      //     }
      //   );
      // });

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

  playPreviousTrack(): void {
    this.stopTimer();
    this.sdk.previousTrack().then(() => {
      this.isPlaying = true;
      this.playbackProgress = '0%';
      this.playbackPercentage = 0;
      this.startTimer();
    }).catch(() => this.stopTimer());

  }

  playNextTrack(): void {
    this.stopTimer();
    this.sdk.nextTrack().then(() => {
      this.isPlaying = true;
      this.playbackProgress = '0%';
      this.playbackPercentage = 0;
      this.startTimer();
    }).catch(() => this.stopTimer());
  }

  getVolume() {
    this.sdk.getVolume().then(volume => {
      this.volumePercentage = volume * 100;
    });
  }

  startUpdateVolume(data) {
    this.updateVolumeToggle = true;
  }

  endUpdateVolume(data) {
    this.updateVolumeToggle = false;
  }

  updateVolume(event, data) {
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

  startUpdatePlayback(data) {
    this.updatePlaybackToggle = true;
  }

  endUpdatePlayback(data) {
    this.updatePlaybackToggle = false;
  }

  updatePlayback(event, data) {
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

}
