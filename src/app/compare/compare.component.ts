import {Component, OnInit} from '@angular/core';
import {Team} from '../shared/team.model';
import {MetricService} from '../metric.service';
import {Conference} from '../shared/conference.model';
import {Metrics} from '../shared/metrics.model';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css']
})
export class CompareComponent implements OnInit {

  conferences: Array<Conference>;
  selectedConference: Conference;

  visibleConferences: Set<Conference> = new Set();

  teams: Array<Team> = [];
  selectedTeam: Team;
  netChartData: Array<any>;
  netChartLabels: Array<any>;

  sosChartData: Array<any>;
  sosChartLabels: Array<any>;

  avgOppNetChartData: Array<any>;
  avgOppNetChartLabels: Array<any>;

  currentMetricsChartData: Array<any>;
  currentMetricsChartLabels: Array<string> = ['NET', 'SOS', 'OPP NET'];
  currentMetricsChartColors: Array<any> = [];

  quadrantsChartData: Array<any>;
  quadrantsChartLabels: Array<string> = ['Q1 W', 'Q2 W', 'Q3 L', 'Q4 L'];
  quadrantsChartColors: Array<any> = [];

  public lineChartOptions: any = {
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
  public barChartOptions: any = {
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
    }
  };
  public lineChartColors: Array<any> = [];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  constructor(private metricService: MetricService) { }

  ngOnInit() {
    this.metricService.loadConferences().subscribe(
      (conferences: Array<Conference>) => {
        this.conferences = conferences;
        this.selectedConference = this.conferences[0]; // Defaults to AAC
        this.metricService.loadTeam(this.selectedConference.teams[0].id).subscribe(
          (team: Team) => {
            this.teams.push(team);
            this.buildCharts(this.teams);
          }
        );
      }
    );
  }

  buildCharts(teams: Array<Team>): void {
    this.buildNETChart(teams);
    this.buildSOSChart(teams);
    this.buildAvgOppNETChart(teams);
    this.buildCurrentMetricsChart(teams);
    this.buildQuadrantsChart(teams);
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
        this.selectedTeam = team;
      });
  }

  onAddTeam() {
    if (!this.teams) {
      this.teams = [];
    }
    this.teams.push(this.selectedTeam);
    this.buildCharts(this.teams);
  }

  onAddConference() {
    this.metricService.loadTeamsByConference(this.selectedConference.id).subscribe(
      (teams: Array<Team>) => {
        for (const team of teams) {
          if (this.teams && this.teams.find((t) => t.id === team.id)) { // Prevent duplicates
            continue;
          }
          if (!this.teams) {
            this.teams = [];
          }
          this.teams.push(team);
          this.visibleConferences.add(this.selectedConference);
          this.buildNETChart(this.teams);
          this.buildSOSChart(this.teams);
          this.buildAvgOppNETChart(this.teams);
          this.buildCurrentMetricsChart(this.teams);
          this.buildQuadrantsChart(this.teams);
        }
      }
    );
  }

  onRemoveTeam(id: number): void {
    this.teams = (this.teams.length > 1) ? this.teams.filter((team: Team) => team.id === id) : null; // Filter won't remove last element
    this.buildNETChart(this.teams);
    this.buildSOSChart(this.teams);
    this.buildAvgOppNETChart(this.teams);
    this.buildCurrentMetricsChart(this.teams);
    this.buildQuadrantsChart(this.teams);
  }

  onRemoveConference(id: number): void {
    this.teams = this.teams.filter(
      (team) => team.conference.id === id
    );
    if (this.teams.length > 0 && this.teams[0].conference.id === id) { // Filter won't remove last element, so doing it here if necessary
      this.teams = [];
    }
    this.buildNETChart(this.teams);
    this.buildSOSChart(this.teams);
    this.buildAvgOppNETChart(this.teams);
    this.buildCurrentMetricsChart(this.teams);
    this.buildQuadrantsChart(this.teams);
    this.visibleConferences = new Set(Array.from(this.visibleConferences).filter((conf) => conf.id === id));
    // Filter won't remove last element, so doing it here if necessary
    if (this.visibleConferences.size === 1 && this.visibleConferences.values().next().value.id === id) {
      this.visibleConferences = new Set<Conference>();
    }
  }

  isInVisibleConferences(id: number): boolean {
    return Array.from(this.visibleConferences).find((conf) => conf.id === id) !== undefined;
  }

  static buildDateList(items: Array<Metrics>): Array<string> {
    const labels = [];
    for (const item of items) {
      labels.push(item.date);
    }
    return labels;
  }

  buildNETChart(teams: Array<Team>): void {
    this.netChartLabels = (teams && teams.length > 0) ? CompareComponent.buildDateList(teams[0].metrics) : null;
    this.netChartData = CompareComponent.buildNETChartData(teams);
  }

  buildSOSChart(teams: Array<Team>): void {
    this.sosChartLabels = this.netChartLabels; // No need to rebuild list. Just reusing
    this.sosChartData = CompareComponent.buildSOSChartData(teams);
  }

  buildAvgOppNETChart(teams: Array<Team>): void {
    this.avgOppNetChartLabels = this.netChartLabels;
    this.avgOppNetChartData = CompareComponent.buildAvgOppNETData(teams);
  }

  buildCurrentMetricsChart(teams: Array<Team>) {
    this.currentMetricsChartData = CompareComponent.buildCurrentMetricsData(teams);
  }

  buildQuadrantsChart(teams: Array<Team>) {
    this.quadrantsChartData = CompareComponent.buildQuadrantsData(teams);
  }

  static buildNETChartData(teams: Array<Team>): Array<any> {
    if (!teams || teams.length < 1) {
      return null;
    }
    const data = [];
    for (const team of teams) {
      const lineData = {} as any;
      lineData.data = [];
      for (const metrics of team.metrics) {
        lineData.data.push(metrics.net);
      }
      lineData.label = team.name;
      data.push(lineData);
    }
    return data;
  }

  static buildSOSChartData(teams: Array<Team>): Array<any> {
    if (!teams || teams.length < 1) {
      return null;
    }
    const data = [];
    for (const team of teams) {
      const lineData = {} as any;
      lineData.data = [];
      for (const metrics of team.metrics) {
        lineData.data.push(metrics.sos);
      }
      lineData.label = team.name;
      data.push(lineData);
    }
    return data;
  }

  static buildAvgOppNETData(teams: Array<Team>): Array<any> {
    if (!teams || teams.length < 1) {
      return null;
    }
    const data = [];
    for (const team of teams) {
      const lineData = {} as any;
      lineData.data = [];
      for (const metrics of team.metrics) {
        lineData.data.push(metrics.avgOppNET);
      }
      lineData.label = team.name;
      data.push(lineData);
    }
    return data;
  }

  static buildCurrentMetricsData(teams: Array<Team>): Array<any> {
    if (!teams || teams.length < 1) {
      return null;
    }
    const currentMetricsIndex = teams[0].metrics.length - 1; // Latest metrics index
    const data = [];
    for (const team of teams) {
      const lineData = {} as any;
      lineData.data = [];
      lineData.data.push(team.metrics[currentMetricsIndex].net); // Most recent metrics
      lineData.data.push(team.metrics[currentMetricsIndex].sos); // Most recent metrics
      lineData.data.push(team.metrics[currentMetricsIndex].avgOppNET); // Most recent metrics
      lineData.label = team.name;
      data.push(lineData);
    }
    return data;
  }

  static buildQuadrantsData(teams: Array<Team>): Array<any> {
    if (!teams || teams.length < 1) {
      return null;
    }
    const currentMetricsIndex = teams[0].metrics.length - 1; // Latest metrics index
    const data = [];
    for (const team of teams) {
      const lineData = {} as any;
      lineData.data = [];
      lineData.data.push(team.metrics[currentMetricsIndex].q1Wins);
      lineData.data.push(team.metrics[currentMetricsIndex].q2Wins);
      lineData.data.push(team.metrics[currentMetricsIndex].q3Losses);
      lineData.data.push(team.metrics[currentMetricsIndex].q4Losses);
      lineData.label = team.name;
      data.push(lineData);
    }
    return data;
  }
}
