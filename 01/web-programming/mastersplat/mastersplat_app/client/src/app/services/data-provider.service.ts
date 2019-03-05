import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { DataProvider } from '../shared/classes/data-provider';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {
  //private dataProviderUrl = 'https://pw-mastersplat.herokuapp.com/api/v1/data-providers';
  private dataProviderUrl = 'http://localhost:8080/api/v1/data-providers';
  
  
  constructor(private http: HttpClient) { }

  /** Get Data Providers with filter options */
  getDataProviders(query: string = ""): Observable<Object> {
    return this.http.get<any>(this.dataProviderUrl + query)
      .pipe (
        catchError(this.handleError('getDataProviders', []))
      );
  }

  /** Get Data Provider by id */
  getDataProvider(id: string): Observable<Object> {
    const url = `${this.dataProviderUrl}/${id}`;
    return this.http.get<any>(url)
      .pipe(
        catchError(this.handleError(`getDataProvider id=${id}`))
      );
  }

  /** Update Data Provider */
  updateDataProvider (dataProvider: any): Observable<any> {
    const url = `${this.dataProviderUrl}/${dataProvider._id}`;
    
    const toUpdate = [
      { 'property_name': 'name', 'value': dataProvider.name },
      { 'property_name': 'url', 'value': dataProvider.url },
    ];

    return this.http.patch(url, toUpdate, httpOptions).pipe(
      catchError(this.handleError<any>('updateDataProvider'))
    );
  }

  /** Delete Data Provider by id */
  deleteDataProvider(id: string): Observable<any> {
    const url = `${this.dataProviderUrl}/${id}`;
    return this.http.delete(url,httpOptions).pipe(
      catchError(this.handleError<any>('deleteHero'))
    );
  }

  /** Add new Data Provider */
  addDataProvider(dataprovider: DataProvider): Observable<DataProvider> {
    return this.http.post<DataProvider>(this.dataProviderUrl, dataprovider, httpOptions)
      .pipe(
        catchError(this.handleError<DataProvider>('addDataProvider'))
      );
  }

  /** Load all Data Provider */
  harvestAllDataProviders(): Observable<any> {
    const url = `${this.dataProviderUrl}/harvest`;
    return this.http.post<DataProvider>(url,'')
      .pipe(
        catchError(this.handleError<DataProvider>('harvestAllDataProviders'))
      );
  }

  /** Load Data Provider by id */
  harvestDataProvider(id: string): Observable<any> {
    const url = `${this.dataProviderUrl}/${id}/harvest`;
    return this.http.post<DataProvider>(url,'')
      .pipe(
        catchError(this.handleError<DataProvider>('harvestDataProvider'))
      );
  }


  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`>> ${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
