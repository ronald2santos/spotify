import { Component, OnInit, ViewChild } from '@angular/core';
import { TrackService } from '../../services/track.service';
import { ArtistService } from '../../services/artist.service';
import { SpotifyService } from '../../services/spotify.service';
import { Artist } from 'src/app/typing/artist';
import { LyricService } from '../../services/lyric.service';
import { ActivatedRoute } from '@angular/router';
import { fadeInAnimation } from '../../router.animation';


@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  animations: [fadeInAnimation]
})
export class OverviewComponent implements OnInit {

  // tslint:disable-next-line: max-line-length
  constructor(private trackService: TrackService, private artistService: ArtistService, private spotify: SpotifyService, private lyric: LyricService) { }
  selectedArtist;
  selectedTrack;
  following: boolean;
  tempo: number;
  duration: number;
  keyModeData: object;
  keyMode: string;
  lyrics: string;


  ngOnInit() {
    this.artistService.artistObservable.subscribe((artist) => this.selectedArtist = artist);
    this.trackService.trackObservable.subscribe((track) => {
      this.selectedTrack = track;
      console.log(track);
      if (track) {
        this.lyric.matchLyrics(track.name, track.artists[0].name).subscribe(
          (lyrics) => {
            if(lyrics) {
              const unwrappedLyrics = this.unwrap(lyrics);
              const lyric = unwrappedLyrics.message.body.lyrics.lyrics_body;
              this.lyrics = lyric.substring(0, lyric.indexOf('*'));
            }
          }
        );
      }
    });
  }

  unwrap(jsonp) {
    const json = jsonp.slice(9, jsonp.length - 2);
    return JSON.parse(json);
  }

  // checkFollowing(id: string) {
  //   // console.log('Cheking Follow status');
  //   this.spotify.checkIfUserFollowsArtists([id]).subscribe(
  //     (following) => {
  //       // console.log(following);
  //       this.following = following;
  //     }
  //   );
  // }

}
