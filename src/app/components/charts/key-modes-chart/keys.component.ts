import { Component, OnInit, Input, SimpleChanges, OnChanges, ViewChild } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { BaseChartDirective, Label } from 'ng2-charts';

@Component({
    selector: 'app-keys',
    templateUrl: './keys.component.html',
    styleUrls: ['./keys.component.css'],
})
export class KeysComponent implements OnChanges {
    // Obtain reference to instance of chart
    @ViewChild(BaseChartDirective, { static: false }) chart: BaseChartDirective;

    @Input() keyModeData: object;
    labels: Array<string> = [];
    data: Array<number> = [];

    public barChartOptions: ChartOptions = {
        scales: {
            gridLines: { color: 'rgba(255,255,255,0.05)' },
            xAxes: [
                {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1,
                    },
                },
            ],
        },
        maintainAspectRatio: true,
        responsive: true,
    };
    public barChartType: ChartType = 'horizontalBar';
    public barChartLabels: Label[] = [];
    public barChartLegend = true;

    public barChartData: ChartDataSets[] = [
        {
            data: [],
            label: "Song's Keys",
            backgroundColor: 'rgba(30, 255, 96, 0.3)',
            borderColor: 'rgba(255,255,255,0.05)',
            hoverBackgroundColor: 'rgba(30, 255, 96, 0.7)',
        },
    ];

    constructor() {}

    ngOnChanges(changes: SimpleChanges): void {
        if (this.keyModeData) {
            // console.log('KeyModeData', this.keyModeData);
            this.labels = [];
            this.data = [];
            this.updateKeyModeChart(this.keyModeData);
        }
    }

    updateKeyModeChart(keyModeData): void {
        const sortedKeyMode = [];
        // tslint:disable-next-line: forin
        for (const key in keyModeData) {
            sortedKeyMode.push([key, keyModeData[key]]);
        }
        sortedKeyMode
            .sort((a, b) => {
                return b[1] - a[1];
            })
            .forEach((value) => {
                this.labels.push(value[0]);
                this.data.push(value[1]);
            });

        // console.log(this.labels);
        // console.log(this.data);

        this.chart.chart.config.data.labels = this.labels;

        this.chart.chart.data.datasets.forEach((dataset) => {
            dataset.data = [];
            dataset.data.push(...this.data);
        });
        this.chart.chart.update();
    }
}
