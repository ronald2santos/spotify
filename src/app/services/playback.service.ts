import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaybackService {

  constructor() { }
  /// Refactoring of current playback component

    private isPlaying = new BehaviorSubject<any>(undefined);

    playingObservable = this.isPlaying.asObservable();

    setIsPlaying(state: boolean) {
        this.isPlaying.next(state);
    }

  async loadPlayer() {
    const { Player }: any = await this.waitForSpotifyWebPlaybackSDKToLoad();

    return new Player({
      name: 'Spotify Analytics',
      volume: 0.7,
      getOAuthToken: callback => { callback(window.localStorage.getItem('Token')); }
    });
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

}
