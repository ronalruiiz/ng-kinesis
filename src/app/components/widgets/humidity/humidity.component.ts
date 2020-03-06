import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import * as Highcharts from "highcharts";
import { KinesisService } from "src/app/services/kinesis.service";

declare var require: any;
const loadHcMore = require("highcharts/highcharts-more");

@Component({
    selector: "app-humidity",
    template: `
        <ng-container *ngIf="highCharts">
            <highcharts-chart
                [Highcharts]="highCharts"
                (chartInstance)="logChartInstance($event)"
                style="width: 100%; height: calc(100% - 40px); display: inline-block;"
                [options]="chartOptions"
            ></highcharts-chart>
        </ng-container>
    `
})
export class HumidityComponent implements OnInit {
    topicName = "casa/sensores/hum";
    highCharts: typeof Highcharts = Highcharts;
    hcMore: any;
    chartOptions = {
        yAxis: {
            title: {
                text: "Humidity ( °C )"
            }
        },
        exporting: {
            enable: false
        },
        credits: {
            enabled: false
        },
        tooltip: {
            enabled: false
        },
        title: { text: "" },
        series: [
            {
                name: "Humidity",
                data: []
            }
        ],
        responsive: {
            rules: [
                {
                    condition: {
                        maxWidth: 300
                    },
                    chartOptions: {
                        yAxis: {
                            className: "highcharts-gauge-heading-small"
                        }
                    }
                }
            ]
        }
    };
    chartInstance: Highcharts.Chart;
    msg: any;
    private subscription: Subscription;
    constructor(private _kinesisService: KinesisService) {
        this.uploadDataHumidity();
    }
    logChartInstance(chart: Highcharts.Chart) {
        this.chartInstance = chart;
    }

    ngOnInit() {
        this.hcMore = loadHcMore;

        this.hcMore(this.highCharts);
    }
    uploadDataHumidity() {
        this._kinesisService.dataHumidity.subscribe((e: any) => {
            console.log(e)
            if (this.chartInstance) {
                this.chartInstance.series[0].addPoint([Math.floor(e)]);
            }
        });
    }
}
