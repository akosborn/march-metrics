import {Team} from './team.model';

export class Conference {
  id: number;
  name: string;
  teams: Array<Team>;
}
