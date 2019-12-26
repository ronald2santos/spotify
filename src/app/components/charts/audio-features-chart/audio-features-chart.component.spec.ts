import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioFeaturesChartComponent } from './audio-features-chart.component';

describe('AudioFeaturesChartComponent', () => {
  let component: AudioFeaturesChartComponent;
  let fixture: ComponentFixture<AudioFeaturesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioFeaturesChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioFeaturesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
