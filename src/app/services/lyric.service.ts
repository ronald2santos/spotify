import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class LyricService {

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  getQuery(query: string): Observable<any> {
    const apiURL = `https://api.musixmatch.com/ws/1.1${query}`;
    const headers = new HttpHeaders({
      Accept: 'text/plain',
      'Content-Type': 'text/plain'
    });
    return this.http.get(apiURL, {headers, responseType: 'text'});
  }

  matchLyrics(track, artist) {
    // tslint:disable-next-line: max-line-length
    const url = `/matcher.lyrics.get?format=jsonp&callback=callback&q_track=${track}&q_artist=${artist}&apikey=78b2dd2b431c802a02436ac106452c4f`;
    return this.getQuery(url);
  }
}
