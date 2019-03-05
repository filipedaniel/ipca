import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LogsService {
  //private logsUrl = 'https://pw-mastersplat.herokuapp.com/api/v1/logs';
  private logsUrl = 'http://localhost:8080/api/v1/logs';

  constructor(private http: HttpClient) { }

  /** Get Publications with filter options */
  getLogs(query: string = ""): Observable<Object> {
    return this.http.get<any>(this.logsUrl + query)
      .pipe (
        catchError(this.handleError('getLogs', []))
      )
  }

  /** Get Log by id */
  getLog(id: string): Observable<Object> {
    const url = `${this.logsUrl}/${id}`;
    return this.http.get<any>(url)
    .pipe(
      catchError(this.handleError(`getlog id=${id}`))
    );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`>> ${operation} failed: ${error.message}`); // log to console instead
      return of(result as T);
    };
  }

}
