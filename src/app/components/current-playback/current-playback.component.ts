import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-current-playback',
  templateUrl: './current-playback.component.html',
  styleUrls: ['./current-playback.component.css']
})
export class CurrentPlaybackComponent implements OnInit {

  constructor(private spotify: SpotifyService) { }

  currentTrack;
  device;

  ngOnInit() {
    this.loadPlayer();
    // this.spotify.getCurrentPlaybackInfo().subscribe(
    //   (currentPlayback) => {
    //     console.log(currentPlayback);
    //     if (currentPlayback) {
    //       this.currentTrack = currentPlayback.item;
    //       this.device = currentPlayback.device.name;
    //     }
    //   }
    // );
  }

  async loadPlayer() {
    const { Player } = await this.waitForSpotifyWebPlaybackSDKToLoad();
    console.log('The Web Playback SDK has loaded.');

    const sdk = new Player({
      name: 'Spotify Analitycs',
      volume: 1.0,
      getOAuthToken: callback => { callback(window.localStorage.getItem('Token')); }
    });

    const connected = await sdk.connect();
    console.log(connected);

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
      });

      const state = await sdk.getCurrentState();
      console.log(state);
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

  // async waitUntilUserHasSelectedPlayer (sdk) {
  //   return new Promise(resolve => {
  //     const interval = setInterval(async () => {
  //       const state = await sdk.getCurrentState();
  //       if (state !== null) {
  //         resolve(state);
  //         clearInterval(interval);
  //       }
  //     });
  //   });
  // }

}
