/* tslint:disable:no-unused-expression */

import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/internal/operators';

@Injectable()
export class AppService {

// TODO: usage of this variable needs to be eliminated
protected baseUrl = '/api';

  constructor(public http: HttpClient) {}

  /**
   * This method will fetch userUID from server
   */
  getUserInfo() {
    // TODO need to add slash after removing slash in baseUrl
    const serviceUrl = this.baseUrl + '/userInfo';
    return this.http.get(serviceUrl).pipe(catchError(err => this.handleError(err)));
  }

  protected handleError (error: any) {
    const errMsg = (error.message) ? error.message : '';
    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return throwError(errMsg);
  }
}
