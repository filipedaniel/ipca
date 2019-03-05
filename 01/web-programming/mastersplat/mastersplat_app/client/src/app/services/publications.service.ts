import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PublicationsService {
  //private publicationsUrl = 'https://pw-mastersplat.herokuapp.com/api/v1/publications';
  private publicationsUrl = 'http://localhost:8080/api/v1/publications';

  constructor(private http: HttpClient) { }

  /** Get Publications with filter options */
  getPublications(query: string = ""): Observable<Object> {
    return this.http.get<any>(this.publicationsUrl + query)
      .pipe (
        catchError(this.handleError('getPublications', []))
      )
  }

  
  /** Get Data Provider by id */
  getPublication(id: string): Observable<Object> {
    const url = `${this.publicationsUrl}/${id}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError(`getPublication id=${id}`))
      );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`>> ${operation} failed: ${error.message}`); // log to console instead
      return of(result as T);
    };
  }

}
