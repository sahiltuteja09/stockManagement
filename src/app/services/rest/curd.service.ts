import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { CoreConfigConstant } from '../../../configconstants';

@Injectable({
  providedIn: 'root'
})
export class CurdService {

  END_POINT: string = CoreConfigConstant.apiUrl;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }
  getData(apiMethod: string, param?: string) {
    if (!param) {
      param = '';
    }
    return this.http.get(this.END_POINT + apiMethod + param).pipe(
      retry(3), // retry a failed request up to 3 times
      catchError(this.handleError)// then handle the error
    );
  }
  postData(apiMethod: string, param: any): Observable<any> {
    return this.http.post(this.END_POINT + apiMethod, param, this.httpOptions).pipe(
      catchError(this.handleError)// then handle the error
    );
  }

  updateData(id: number, param: any): Observable<any> {
    return this.http.put(this.END_POINT + id, param, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }
  deleteData(id: number): Observable<any> {
    return this.http.delete(this.END_POINT + id, this.httpOptions).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
