import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Team} from './shared/team.model';
import {AppComponent} from './app.component';
import {catchError, map} from 'rxjs/operators';
import {Conference} from './shared/conference.model';
import {MetricsDifference} from './shared/metricsdifference.model';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(private http: HttpClient) { }

  loadTeam(id: number): Observable<Team> {
    return this.http.get(AppComponent.API_BASE_URL + '/teams/' + id)
      .pipe(map(
        (response: any) => {
          return new Team(response.id, response.name, response.conference, response.onBubble, response.metrics);
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

  loadChangesByDates(from: Date, to: Date): any {
    const options = {
      params: new HttpParams()
        .set('from', from.toISOString().slice(0, 10))
        .set('to', to.toISOString().slice(0, 10))
    };
    return this.http.get(AppComponent.API_BASE_URL + '/metrics/movement', options)
      .pipe(
        map(
        (response: Array<MetricsDifference>) => {
          return response;
        }),
        catchError((err) => {
          return this.handleError(err);
        })
      );
  }

  loadAllDates(): Observable<Array<Date>> {
    return this.http.get(AppComponent.API_BASE_URL + '/metrics/dates')
      .pipe(map(
        (response: Array<any>) => {
          const list: Array<Date> = [];
          for (const date of response) {
            list.push(new Date(date + ' EST')); // Date will be a day behind if timezone not appended
          }
          return list;
        }
      ));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError('Something bad happened');
  }
}
