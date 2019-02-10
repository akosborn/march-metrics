import {Metrics} from './metrics.model';
import {Conference} from './conference.model';

export class Team {
  id: number;
  name: string;
  conference: Conference;
  metrics: Array<Metrics>;


  constructor(id: number, name: string, conference: Conference, metrics: Array<any>) {
    this.id = id;
    this.name = name;
    this.conference = conference;
    this.metrics = metrics;
  }
}
