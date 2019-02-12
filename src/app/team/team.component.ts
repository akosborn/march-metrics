import {Component, OnInit} from '@angular/core';
import {Team} from '../shared/team.model';
import {MetricService} from '../metric.service';
import {Metrics} from '../shared/metrics.model';
import {Conference} from '../shared/conference.model';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  conferences: Array<Conference>;
  selectedConference: Conference;

  team: Team;
  netChartData: Array<any>;
  netChartLabels: Array<any>;

  sosChartData: Array<any>;
  sosChartLabels: Array<any>;

  avgOppNetChartData: Array<any>;
  avgOppNetChartLabels: Array<any>;

  resultsChartData: Array<any>;
  resultsChartLabels: Array<any>;
  resultsChartColors: Array<any> = [
    // { // wins
    //   borderColor: '#349805'
    // },
    // { // losses
    //   borderColor: '#CC0204'
    // },
    { // Q1 wins
      borderColor: '#349805'
    },
    { // Q2 Wins
      borderColor: '#04339B'
    },
    { // Q3 + Q4 Losses
      borderColor: '#CC0204'
    }
  ];

  quadWinPctData: Array<any>;
  quadWinPctLabels: Array<any>;

  winPctOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    elements: {
      line: {
        fill: false
      }
    },
    tooltips: {
      enabled: true,
      mode: 'index',
      intersect: false,
      callbacks: {
        label: function (tooltipItem, data) {
          const quad = tooltipItem.datasetIndex;
          return data.datasets[quad].record + ', ' + tooltipItem.yLabel;
        }
      }
    }
  };

  lineChartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    },
    elements: {
      line: {
        fill: false
      }
    },
    tooltips: {
      mode: 'index',
      intersect: false
    },
    hover: {
      mode: 'index',
      intersect: false
    }
  };
  lineChartColors: Array<any>;
  lineChartLegend = false;
  lineChartType = 'line';

  constructor(private metricService: MetricService) { }

  ngOnInit(): void {
    this.metricService.loadConferences().subscribe(
      (conferences: Array<Conference>) => {
        this.conferences = conferences;
        this.selectedConference = this.conferences[0]; // Defaults to AAC
        // console.log(this.selectedConference.teams);
        this.metricService.loadTeam(this.selectedConference.teams[0].id).subscribe( // Defaults to Cincinnati
          (team: Team) => {
            this.team = team;
            this.buildCharts(this.team);
          }
        );
      }
    );
  }

  buildCharts(team: Team): void {
    this.buildNETChart(team);
    this.buildSOSChart(team);
    this.buildAvgOppNETChart(team);
    this.buildResultsChart(team);
    this.buildQuadrantWinPctChart(team);
  }

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

  buildResultsChart(team: Team): void {
    this.resultsChartData = TeamComponent.buildResultsChartData(team);
    this.resultsChartLabels = TeamComponent.buildDateList(team.metrics);
  }

  buildQuadrantWinPctChart(team: Team): void {
    this.quadWinPctData = TeamComponent.buildQuadrantWinPctData(team);
    this.quadWinPctLabels = TeamComponent.buildDateList(team.metrics);
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

  static buildResultsChartData(team: Team): Array<any> {
    const data = [];

    const q1WinData = {} as any;
    q1WinData.data = [];
    for (const metrics of team.metrics) {
      q1WinData.data.push(metrics.q1Wins);
    }
    q1WinData.label = 'Q1 Wins';
    data.push(q1WinData);

    const q2WinData = {} as any;
    q2WinData.data = [];
    for (const metrics of team.metrics) {
      q2WinData.data.push(metrics.q2Wins);
    }
    q2WinData.label = 'Q2 Wins';
    data.push(q2WinData);

    const q3q4LossData = {} as any;
    q3q4LossData.data = [];
    for (const metrics of team.metrics) {
      q3q4LossData.data.push(metrics.q3Losses + metrics.q4Losses);
    }
    q3q4LossData.label = 'Q3 + Q4 Losses';
    data.push(q3q4LossData);

    return data;
  }

  static buildQuadrantWinPctData(team: Team): Array<any> {
    const data = [];

    const q1Data = {
      data: [],
      label: 'Q1 Win %'
    } as any;
    const q2Data = {
      data: [],
      label: 'Q2 Win %'
    } as any;
    const q3Data = {
      data: [],
      label: 'Q3 Win %'
    } as any;
    const q4Data = {
      data: [],
      label: 'Q4 Win %'
    } as any;
    for (const metrics of team.metrics) {
      q1Data.data.push((metrics.q1Wins / (metrics.q1Wins + metrics.q1Losses)).toFixed(3));
      q1Data.record = metrics.q1Wins + '-' + metrics.q1Losses;
      q2Data.data.push((metrics.q2Wins / (metrics.q2Wins + metrics.q2Losses)).toFixed(3));
      q2Data.record = metrics.q2Wins + '-' + metrics.q2Losses;
      q3Data.data.push((metrics.q3Wins / (metrics.q3Wins + metrics.q3Losses)).toFixed(3));
      q3Data.record = metrics.q3Wins + '-' + metrics.q3Losses;
      q4Data.data.push((metrics.q4Wins / (metrics.q4Wins + metrics.q4Losses)).toFixed(3));
      q4Data.record = metrics.q4Wins + '-' + metrics.q4Losses;
    }
    data.push(q1Data, q2Data, q3Data, q4Data);
    return data;
  }

  static buildDateList(items: Array<Metrics>): Array<string> {
    const labels = [];
    for (const item of items) {
      labels.push(item.date);
    }
    return labels;
  }

  onConferenceSelected(id: string) {
    this.selectedConference = this.conferences.filter(conference => {
      return conference.id.toString() === id;
    })[0];
    this.onTeamSelected(this.selectedConference.teams[0].id.toString()); // Load first team listed in conference by default
  }

  onTeamSelected(id: string) {
    this.metricService.loadTeam(Number(id)).subscribe(
      (team: Team) => {
        this.team = team;
        this.buildCharts(this.team);
      });
  }

  getCurrentMetrics(): Metrics {
    return this.team.metrics[this.team.metrics.length - 1];
  }
}
