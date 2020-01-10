import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  constructor() { }
  private selectedTrack = new BehaviorSubject(undefined);
  trackObservable = this.selectedTrack.asObservable();

  setSelectedTrack(track): void {
    this.selectedTrack.next(track);
  }
}
