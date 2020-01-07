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
  private volumeProgress:string = '70%';
  private volumePercentage:number = 70;
  private updateVolumeToggle: boolean = false;
  private playbackProgress:string = 0;
  private playbackPercentage:number = 0;
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
    console.log(this.state)
  }

  async loadPlayer() {
    const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();

    const sdk = new Player({
      name: 'Spotify Analitycs',
      volume: 0.7,
      getOAuthToken: callback => { callback(window.localStorage.getItem('Token')); }
    });

    this.sdk = sdk

    const connected = await sdk.connect();

    if (connected) {

      sdk.addListener('ready', ({ device_id }) => {
        console.log('The Web Playback SDK is ready to play music!');
        console.log('Device ID', device_id);
        this.spotify.changeDevice(device_id).subscribe(
          (response) => {
            console.log(response);
          }
        );
      });

      sdk.addListener('player_state_changed', ({
        track_window: { current_track }
      }) => {
        this.currentTrack = current_track;
        sdk.getCurrentState().then(state => {
        this.state = state
        this.currentPlaybackPosition = state.position;
        console.log(state)
        this.playbackPercentage = (state.position*100)/this.currentTrack.duration_ms
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

    this.isPlaying = true;
    setTimeout(() => {
      this.sdk.resume().then(() => {
        console.log('Resumed!');
      });
    });
    this.startTimer()
  }

  pauseTrack(): void {
    this.sdk.pause().then(() => {
      console.log('Paused!');
    });
    this.isPlaying = false;
    this.stopTimer()
  }

  startTimer() {
    console.log('Started Interval') 
    if(this.isPlaying) { 
      this.timer = setInterval(() => {
        if(this.playbackPercentage >= 99.5) {
          this.playbackPercentage = 0
          this.playbackProgress = '0%'
        }
        this.currentPlaybackPosition = this.currentPlaybackPosition + 1000
        this.playbackPercentage = this.playbackPercentage + (100000/(this.currentTrack.duration_ms))
        this.playbackProgress = this.playbackPercentage + '%';
        console.log(this.playbackProgress)
      }, 1000)
    }
  }

  stopTimer() {
    console.log('Stopped Interval')
    clearInterval(this.timer)
  }
  
  playPreviousTrack(): void {
    this.stopTimer()
    this.sdk.previousTrack().then(() => {
      console.log('Set to previous track!');
    });
    this.isPlaying = true;
    this.playbackProgress = '0%';
    this.playbackPercentage = 0;
    this.startTimer()
  }

  playNextTrack(): void {
    this.stopTimer()
    this.sdk.nextTrack().then(() => {
      console.log('Skipped to next track!');
    });
    this.isPlaying = true;
    this.playbackProgress = '0%';
    this.playbackPercentage = 0;
    this.startTimer()
  }

  getVolume() {
    this.sdk.getVolume().then(volume => {
      this.volumePercentage = volume * 100;
      console.log(`The volume of the player is ${this.volumePercentage}%`);
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

      this.sdk.setVolume(this.volumePercentage / 100).then(() => {
        console.log('Volume updated!');
      });

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

      this.sdk.setVolume(this.volumePercentage / 100).then(() => {
        console.log('Volume updated!');
      });
      
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

      this.currentPlaybackPosition = (this.playbackPercentage * this.currentTrack.duration_ms)/100

      this.sdk.seek(this.currentPlaybackPosition).then(() => {
        console.log('Changed position!');
      });

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

      this.currentPlaybackPosition = (this.playbackPercentage * this.currentTrack.duration_ms)/100

      this.sdk.seek(this.currentPlaybackPosition).then(() => {
        console.log('Changed position!');
      });

      this.playbackProgress = this.playbackPercentage + '%';
  }

}
