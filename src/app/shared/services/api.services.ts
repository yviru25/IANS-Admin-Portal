import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError, of, Subject } from 'rxjs';
import { retry, catchError, map, shareReplay, timeoutWith, share, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService  implements OnInit {

    private readonly serviceOrigin = environment.SERVER_ORIGIN;
    private requestTimeoutLogger = of('logging request timeout');
    private _refreshNeeded$ = new Subject<void>();
    private timeoutThreshold = 5000;
    constructor(private http: HttpClient){}

    ngOnInit(): void {
        // throw new Error('Method not implemented.');
    }

    getRefreshNeeded() {
        return this._refreshNeeded$;
    }

    public sendGetRequest(url: string): Observable<any> {
        return this.http.get<any>(this.serviceOrigin + url);
    }

    public sendDeleteRequest(url: string): Observable<any> {
        return this.http.delete<any>(this.serviceOrigin + url);
    }

    public sendPostFormRequest(url: string, body: any): Observable<Object> {
        const headers = { 'content-type': 'application/json'} 
         return this.http.post<any>(this.serviceOrigin + url, body,{'headers':headers});
     }

     public download(url: string): Observable<Blob> {
       return this.http.get(this.serviceOrigin + url, {responseType: 'blob'});
      }
     public downloadPost(url: string, body: any): Observable<Blob> {
       return this.http.post(this.serviceOrigin + url, body, {responseType: 'blob'});
      }

    private getServerErrorMessage(error: HttpErrorResponse) {
        switch (error.status) {
            case 404: {
                return throwError('404 Not Found, The URL has not been modified accordingly, or that you have misspelled the URL');
            }
            case 403: {
                return throwError('403 Forbidden, You don’t have permission to access on this server');
            }
            case 500: {
                return throwError('500 Internal Server Error, The server encountered an unexpected condition that prevented it from fulfilling the request.');
            }
            case 400: {
                 // this.toast.error('Bad request');
                 return throwError('400 Bad Request, The server can not process the request');
            }
            case 201: {
                return throwError('Success');
            }
            default: {
                return throwError('Success');
            }

        }
    }




}
