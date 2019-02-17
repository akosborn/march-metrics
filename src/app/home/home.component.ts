import { Component, OnInit } from '@angular/core';
import {MetricService} from '../metric.service';
import {MetricsDifference} from '../shared/metricsdifference.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  teamMetricsChanges: Array<MetricsDifference>;
  p = 1; // Pagination page

  constructor(private metricsService: MetricService) { }

  ngOnInit() {
    this.metricsService.loadChangesByDates().subscribe(
      (metricsDifferences: Array<MetricsDifference>) => this.teamMetricsChanges = metricsDifferences
    );
  }
}
