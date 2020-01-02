import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  token = window.localStorage.getItem('Token');

  getQuery(query: string): Observable<any> {
    const apiURL = `https://api.spotify.com/v1${query}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`
    });
    return this.http.get(apiURL, {headers});
  }

  getCurrentUserProfile() {
    const url = `/me`;
    return this.getQuery(url);
  }

  searchArtists(queryField: string) {
    const url = `/search?q=${queryField.split(' ').join('+')}&type=artist&limit=10`;
    return this.getQuery(url);
  }

  searchTracks(queryField: string) {
    const url = `/search?q=${queryField.split(' ').join('+')}&type=track&limit=20`;
    return this.getQuery(url);
  }

  getArtistsTopTracks(artistID: string) {
    const url = `/artists/${artistID}/top-tracks?country=AR`;
    return this.getQuery(url);
  }

  getRelatedArtists(artistID: string) {
    const url = `/artists/${artistID}/related-artists`;
    return this.getQuery(url);
  }

  getTracksAudioFeatures(trackIDs: Array<string>) {
    const url = `/audio-features/?ids=${trackIDs.join()}`;
    return this.getQuery(url);
  }

  checkIfUserFollowsArtists(artistID: Array<string>) {
    const url = `/me/following/contains?type=artist&ids=${artistID}`;
    return this.getQuery(url);
  }

  getUserTopArtists(limit: number = 20, range: string = 'medium_term') {
    const url = `/me/top/artists?time_range=${range}&limit=${limit}`;
    return this.getQuery(url);
  }

  getUserTopTracks(limit: number = 20, range: string = 'medium_term') {
    const url = `/me/top/tracks?time_range=${range}&limit=${limit}`;
    return this.getQuery(url);
  }

}
