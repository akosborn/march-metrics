import {Metrics} from './metrics.model';

export class Team {
  id: number;
  name: string;
  conference: string;
  metrics: Array<Metrics>;


  constructor(id: number, name: string, conference: string, metrics: Array<any>) {
    this.id = id;
    this.name = name;
    this.conference = conference;
    this.metrics = metrics;
  }
}
