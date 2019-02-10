import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Team} from './shared/team.model';
import {AppComponent} from './app.component';
import {map} from 'rxjs/operators';
import {Conference} from './shared/conference.model';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(private http: HttpClient) { }

  loadTeam(id: number): Observable<Team> {
    return this.http.get(AppComponent.API_BASE_URL + '/teams/' + id)
      .pipe(map(
        (response: any) => {
          return new Team(response.id, response.name, response.conference, response.metrics);
        }
      ));
  }

  loadTeamsByConference(id: number): Observable<Array<Team>> {
    return this.http.get(AppComponent.API_BASE_URL + '/conferences/' + id)
      .pipe(map(
        (response: Array<Team>) => {
          return response;
        }
      ));
  }

  loadConferences(): Observable<Array<Conference>> {
    return this.http.get(AppComponent.API_BASE_URL + '/conferences')
      .pipe(map(
        (response: Array<Conference>) => {
          return response;
        }
      ));
  }
}
