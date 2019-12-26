import { Injectable } from '@angular/core';
import { Artist } from '../typing/artist';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ArtistService {

  constructor() { }
  private selectedArtist = new BehaviorSubject<Artist | undefined>(undefined);
  artistObservable = this.selectedArtist.asObservable();


  // getSelectedArtist() {
  //   return this.selectedArtist;
  // }

  setSelectedArtist(artist: Artist): void {
     this.selectedArtist.next(artist);
  }

}
