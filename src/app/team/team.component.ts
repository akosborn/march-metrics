import {Component, OnInit} from '@angular/core';
import {Team} from '../shared/team.model';
import {MetricService} from '../metric.service';
import {Metrics} from '../shared/metrics.model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  team: Team;
  netChartData: Array<any>;
  netChartLabels: Array<any>;

  sosChartData: Array<any>;
  sosChartLabels: Array<any>;

  avgOppNetChartData: Array<any>;
  avgOppNetChartLabels: Array<any>;

  constructor(private metricService: MetricService) { }

  ngOnInit(): void {
    this.metricService.loadTeam(18).subscribe(
      (team: Team) => {
        this.team = team;
        this.buildNETChart(team);
        this.buildSOSChart(team);
        this.buildAvgOppNETChart(team);
      }
    );
  }

  public lineChartOptions:any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  public lineChartColors:Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  buildNETChart(team: Team): void {
    this.netChartData = TeamComponent.buildNETChartData(team);
    this.netChartLabels = TeamComponent.buildDateList(team.metrics);
  }

  buildSOSChart(team: Team): void {
    this.sosChartData = TeamComponent.buildSOSChartData(team);
    this.sosChartLabels = TeamComponent.buildDateList(team.metrics);
  }

  buildAvgOppNETChart(team: Team): void {
    this.avgOppNetChartData = TeamComponent.buildAvgOppNETChartData(team);
    this.avgOppNetChartLabels = TeamComponent.buildDateList(team.metrics);
  }

  static buildNETChartData(team: Team): Array<any> {
    const data = [];
    const lineData = {} as any;
    lineData.data = [];
    for (const metrics of team.metrics) {
      lineData.data.push(metrics.net);
    }
    lineData.label = team.name;
    data.push(lineData);
    return data;
  }

  static buildSOSChartData(team: Team): Array<any> {
    const data = [];
    const lineData = {} as any;
    lineData.data = [];
    for (const metrics of team.metrics) {
      lineData.data.push(metrics.sos);
    }
    lineData.label = team.name;
    data.push(lineData);
    return data;
  }

  static buildAvgOppNETChartData(team: Team): Array<any> {
    const data = [];
    const lineData = {} as any;
    lineData.data = [];
    for (const metrics of team.metrics) {
      lineData.data.push(metrics.avgOppNET);
    }
    lineData.label = team.name;
    data.push(lineData);
    return data;
  }

  static buildDateList(items: Array<Metrics>): Array<string> {
    const labels = [];
    for (const item of items) {
      labels.push(item.date);
    }
    return labels;
  }
}
