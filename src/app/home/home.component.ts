import {Component, OnInit} from '@angular/core';
import {MetricService} from '../metric.service';
import {MetricsDifference} from '../shared/metricsdifference.model';
import {OrderPipe} from 'ngx-order-pipe';
import {NgbCalendar, NgbDate} from '@ng-bootstrap/ng-bootstrap';
import {DateFormatPipe} from 'ngx-moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  dataDates: Map<String, Date> = new Map();

  fromDate;
  toDate;

  from: Date;
  to: Date;

  teamMetricsChanges: Array<MetricsDifference>;

  p = 1; // Pagination page

  order = 'net2';
  reverse = false;

  constructor(private metricsService: MetricService,
              private orderPipe: OrderPipe,
              private calendar: NgbCalendar,
              private dfp: DateFormatPipe) { }

  ngOnInit() {
    this.metricsService.loadAllDates().subscribe(
      (dates: Array<Date>) => {
        dates.forEach((date) => this.dataDates.set(this.dfp.transform(date, 'YYYY-M-D'), date));
        this.from = dates[6]; // Get metrics from a week ago
        this.to = dates[0]; // Get latest metrics
        this.fromDate = {year: this.from.getFullYear(), month: this.from.getMonth() + 1, day: this.from.getDate()};
        this.toDate = {year: this.to.getFullYear(), month: this.to.getMonth() + 1, day: this.to.getDate()};

        this.metricsService.loadChangesByDates(this.from, this.to).subscribe(
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
    this.metricsService.loadChangesByDates(new Date(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day),
      new Date(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day))
      .subscribe(
        (metricsDifferences: Array<MetricsDifference>) => {
          this.teamMetricsChanges = metricsDifferences;
          this.teamMetricsChanges = this.orderPipe.transform(this.teamMetricsChanges, this.order);
          this.from = new Date(this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day);
          this.to = new Date(this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day);
        });
  }

  isDisabledDate = (date: NgbDate) => {
    const dateString: string = this.dfp.transform(new Date(date.year + '-' + date.month + '-' + date.day), 'YYYY-M-D');
    return !this.dataDates.get(dateString);
  }
}
