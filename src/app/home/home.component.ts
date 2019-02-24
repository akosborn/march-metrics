import {Component, OnInit} from '@angular/core';
import {MetricService} from '../metric.service';
import {MetricsDifference} from '../shared/metricsdifference.model';
import {OrderPipe} from 'ngx-order-pipe';
import {NgbCalendar} from '@ng-bootstrap/ng-bootstrap';
import {DateFormatPipe} from 'ngx-moment';
import {FilterPipe} from 'ngx-filter-pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataDates: Map<String, Date> = new Map();

  fromDate: Date;
  toDate: Date;

  teamMetricsChanges: Array<MetricsDifference>;

  p = 1; // Pagination page

  order = 'net2';
  reverse = false;

  teamFilter: any;

  constructor(private metricsService: MetricService,
              private orderPipe: OrderPipe,
              private calendar: NgbCalendar,
              private dfp: DateFormatPipe,
              private filter: FilterPipe) { }

  ngOnInit() {
    this.metricsService.loadAllDates().subscribe(
      (dates: Array<Date>) => {
        dates.forEach((date) => this.dataDates.set(this.dfp.transform(date, 'YYYY-MM-DD'), date)); // Build map of dates
        this.fromDate = dates[1]; // Get metrics from a week ago
        this.toDate = dates[0]; // Get latest metrics

        this.metricsService.loadChangesByDates(this.fromDate, this.toDate).subscribe(
          (metricsDifferences: Array<MetricsDifference>) => {
            this.teamMetricsChanges = metricsDifferences;
            this.teamMetricsChanges = this.orderPipe.transform(this.teamMetricsChanges, this.order);
          }
        );
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
    this.metricsService.loadChangesByDates(this.fromDate, this.toDate)
      .subscribe(
        (metricsDifferences: Array<MetricsDifference>) => {
          this.teamMetricsChanges = metricsDifferences;
          this.teamMetricsChanges = this.orderPipe.transform(this.teamMetricsChanges, this.order);
        });
  }

  isDisabledDate = (date: Date) => {
    return !this.dataDates.get(this.dfp.transform(date, 'YYYY-MM-DD'));
  }

  toggleFilter() {
    this.teamFilter = this.teamFilter ? null : { onBubble: true };
  }
}
