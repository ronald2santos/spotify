import { Component, OnChanges, Input, SimpleChange, SimpleChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { SpotifyService } from '../../../services/spotify.service';
import { ArtistService } from '../../../services/artist.service';
import { ChartDataSets, ChartType, RadialChartOptions } from 'chart.js';
import { Label, BaseChartDirective } from 'ng2-charts';
import { Artist } from 'src/app/typing/artist';
import { map } from 'rxjs/operators';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { AudioFeatures } from '../../../typing/audio-features';

@Component({
    selector: 'app-audio-features-chart',
    templateUrl: './audio-features-chart.component.html',
    styleUrls: ['./audio-features-chart.component.css'],
})
export class AudioFeaturesChartComponent implements OnChanges {

  constructor(private spotify: SpotifyService, private artistService: ArtistService) { }

  @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;
  chartData: Array<any> = [];
  @Input() selectedArtist: Artist;
  @Input() selectedTrack;
  @Input() profileTracks;
  @Output() public tempo = new EventEmitter();
  @Output() public avgTrackTempo = new EventEmitter();
  @Output() public duration = new EventEmitter();
  @Output() public keyModeData = new EventEmitter();
  @Output() public keyMode = new EventEmitter();

  keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  modes = ['minor', 'mayor'];
  tooltips = [`
    A confidence measure of whether
    the track is acoustic.
    `,
        `
    Describes how suitable a track
    is for dancing based on a combination
    of musical elements including tempo,
    rhythm stability, beat strength, and
    overall regularity.
    `,
        `
    Represents a perceptual measure
    of intensity and activity. Typically
    energetic tracks feel fast, loud,
    and noisy. Perceptual features
    contributing to this attribute
    include dynamic range, perceived
    loudness, timbre, onset rate,
    and general entropy.
    `,
        `
    Predicts whether a track contains
    no vocals. “Ooh” and “aah” sounds
    are treated as instrumental in this
    context. Rap or spoken word tracks
    are clearly “vocal”. Values above 0.5
    are intended to represent instrumental
    tracks, but confidence is higher as
    the value approaches 1.0.
    `,
        `
    Detects the presence of an audience
    in the recording. Higher liveness values
    represent an increased probability
    that the track was performed live.
    A value above 0.8 provides strong
    likelihood that the track is live.
    `,
        `
    Speechiness detects the presence of
    spoken words in a track. Values above
    0.66 describe tracks that are probably
    made entirely of spoken words. Values
    between 0.33 and 0.66 describe tracks
    that may contain both music and speech.
    Values below 0.33 most likely represent
    music and other non-speech-like tracks.
    `,
        `
    A measure of the musical positiveness
    conveyed by a track. Tracks with high
    valence sound more positive (e.g. happy,
    cheerful, euphoric), while tracks with
    low valence sound more negative (e.g. sad,
    depressed, angry).
    `,
    ];

    public radarChartOptions: RadialChartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        // layout: {
        //   padding: {
        //     bottom: 100
        //   }
        // },
        animation: {
            easing: 'easeInQuad',
        },
        tooltips: {
          titleFontSize: 11,
          bodyFontSize: 10,
            callbacks: {
                label: (tooltipItem, data) => {
                    // console.log(tooltipItem);
                    // console.log(data);
                    const label = data.labels[tooltipItem.index] || '';
                    return label;
                },
                afterLabel: (tooltipItem, data) => {
                    const label = this.tooltips[tooltipItem.index];
                    return label;
                },
                labelTextColor: (tooltipItem, chart) => {
                    return '#949494';
                },
            },
            enabled: true,
            mode: 'nearest',
        },
        plugins: {
            datalabels: {
                color: 'white',
                font: {
                    weight: 'bold',
                },
                formatter: Math.round,
            },
        },
        scale: {
            gridLines: { color: 'rgba(255,255,255,0.05)' },
            angleLines: {
                display: true,
            },
            ticks: {
                display: false,
            },
        },
    };

    public radarChartLabels: Label[] = ['Acousticness', 'Danceability', 'Energy', 'Instrumentalness', 'Liveness', 'Speechiness', 'Valence'];

    public radarChartData: ChartDataSets[] = [
        {
            data: [],
            label: 'Audio Features',
            backgroundColor: 'rgba(30, 255, 96, 0.3)',
            borderColor: 'rgba(255,255,255,0.05)',
            pointBorderColor: 'rgba(255, 255, 255, 0.7)',
            pointBackgroundColor: 'rgba(255, 255, 255, 0.5)',
            pointHoverBorderColor: 'rgba(29, 255, 44, 0.3)',
            pointHitRadius: 20,
            datalabels: {
                color: '#FFCE56',
                display: true,
            },
        },
    ];

    public radarChartType: ChartType = 'radar';

    ngOnChanges(changes: SimpleChanges) {
        if (this.selectedArtist) {
            this.getArtistTopTracksAudioFeatures(this.selectedArtist.id);
        }

        if (this.selectedTrack) {
            this.getSingleTrackAudioFeatures(this.selectedTrack.id);
        }

        if (this.profileTracks) {
            // console.log(this.profileTracks);
            const tracksIDs = this.profileTracks.map((track) => track.id);
            // console.log(tracksIDs);
            this.getTracksAudioFeaturesByID(tracksIDs);
        }
    }

    getSingleTrackAudioFeatures(id: string) {
        this.spotify
            .getTracksAudioFeatures([id])
            .pipe(
                map((data) => {
                    const track = data.audio_features[0];
                    this.tempo.emit(track.tempo);
                    this.keyMode.emit(`${this.keys[track.key]} ${this.modes[track.mode]}`);
                    // tslint:disable-next-line: max-line-length
                    return [
                        track.acousticness,
                        track.danceability,
                        track.energy,
                        track.instrumentalness,
                        track.liveness,
                        track.speechiness,
                        track.valence,
                    ];
                })
            )
            .subscribe((data) => {
                this.chartData = data;
                // console.log(this.chartData);
                this.chart.chart.data.datasets.forEach((dataset) => {
                    dataset.data = [];
                    dataset.data.push(...this.chartData);
                });
                this.chart.chart.update();
            });
    }

    getArtistTopTracksAudioFeatures(id: string) {
        this.spotify
            .getArtistsTopTracks(id)
            .pipe(
                map((list) => {
                    const trackIDs = list.tracks.map((track) => track.id);
                    return trackIDs;
                })
            )
            .subscribe((trackIDs) => {
                this.spotify
                    .getTracksAudioFeatures(trackIDs)
                    .pipe(
                        map((data) => {
                            return this.calculateChartData(data);
                        })
                    )
                    .subscribe((data) => {
                        this.chartData = data;
                        // console.log(this.chartData);
                        this.chart.chart.data.datasets.forEach((dataset) => {
                            dataset.data = [];
                            dataset.data.push(...this.chartData);
                        });
                        this.chart.chart.update();
                    });
            });
    }

    getTracksAudioFeaturesByID(trackIDs) {
        this.spotify
            .getTracksAudioFeatures(trackIDs)
            .pipe(
                map((data) => {
                    return this.calculateChartData(data);
                })
            )
            .subscribe((data) => {
                this.chartData = data;
                this.chart.chart.data.datasets.forEach((dataset) => {
                    dataset.data = [];
                    dataset.data.push(...this.chartData);
                });
                this.chart.chart.update();
            });
    }

    getAudioFeatureAverage(data: any, feature: AudioFeatures) {
        const { audio_features } = data;
        const nTracks = audio_features.length;

        const totalForFeature = audio_features
            .map((ft) => {
                return ft[feature];
            })
            .reduce((a, c) => a + c);

        return (totalForFeature / nTracks).toFixed(3);
    }

    calculateChartData(data) {
        const avgAcousticness = this.getAudioFeatureAverage(data, AudioFeatures.acousticness);
        const avgDanceability = this.getAudioFeatureAverage(data, AudioFeatures.danceability);
        const avgEnergy = this.getAudioFeatureAverage(data, AudioFeatures.energy);
        const avgInstrumentalness = this.getAudioFeatureAverage(data, AudioFeatures.instrumentalness);
        const avgLiveness = this.getAudioFeatureAverage(data, AudioFeatures.liveness);
        const avgSpeechiness = this.getAudioFeatureAverage(data, AudioFeatures.speechiness);
        const avgValence = this.getAudioFeatureAverage(data, AudioFeatures.valence);
        const avgTempo = this.getAudioFeatureAverage(data, AudioFeatures.tempo);
        const avgDuration = this.getAudioFeatureAverage(data, AudioFeatures.duration_ms);

        const keys = data.audio_features
            // Mapping key + modes to objects from api data
            .map((ft) => {
                return {
                    keyMode: this.keys[ft.key].concat(` ${this.modes[ft.mode]}`),
                    count: 1,
                };
            })
            // Sorting by keyMode in alphabetical order for comparison
            .sort((a, b) => (a.keyMode > b.keyMode ? 1 : -1));

        // New object will be filled with the keyMode and count accumulated
        const count = {};
        keys.forEach((x) => {
            count[x.keyMode] = (count[x.keyMode] || 0) + 1;
        });

        this.tempo.emit(avgTempo);
        this.duration.emit(avgDuration);
        this.keyModeData.emit(count);

        return [avgAcousticness, avgDanceability, avgEnergy, avgInstrumentalness, avgLiveness, avgSpeechiness, avgValence];
    }
}
