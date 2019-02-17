import { Component, OnInit } from '@angular/core';
import {MetricService} from '../metric.service';
import {MetricsDifference} from '../shared/metricsdifference.model';
import {OrderPipe} from 'ngx-order-pipe';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  fromDate: NgbDate;
  toDate: NgbDate;

  from: Date;
  to: Date;

  teamMetricsChanges: Array<MetricsDifference>;

  p = 1; // Pagination page

  order = 'net2';
  reverse = false;

  constructor(private metricsService: MetricService,
              private orderPipe: OrderPipe,
              private calendar: NgbCalendar) { }

  ngOnInit() {
    this.fromDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 9);
    this.toDate = this.calendar.getPrev(this.calendar.getToday(), 'd', 2);
    this.from = new Date(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day);
    this.to = new Date(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day);
    this.metricsService.loadChangesByDates(
      new Date(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day),
      new Date(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day)).subscribe(
      (metricsDifferences: Array<MetricsDifference>) => {
        this.teamMetricsChanges = metricsDifferences;
        this.teamMetricsChanges = this.orderPipe.transform(this.teamMetricsChanges, this.order);
      }
    );
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  onDateRangeSelected() {
    this.metricsService.loadChangesByDates(
      new Date(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day),
      new Date(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day))
      .subscribe(
      (metricsDifferences: Array<MetricsDifference>) => {
        this.teamMetricsChanges = metricsDifferences;
        this.teamMetricsChanges = this.orderPipe.transform(this.teamMetricsChanges, this.order);
        this.from = new Date(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day);
        this.to = new Date(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day);
      }
    );
  }
}
