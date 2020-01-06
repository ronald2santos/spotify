import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPlaybackComponent } from './current-playback.component';

describe('CurrentPlaybackComponent', () => {
  let component: CurrentPlaybackComponent;
  let fixture: ComponentFixture<CurrentPlaybackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentPlaybackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentPlaybackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
