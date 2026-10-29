import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { catchError } from 'rxjs';
import { _throw } from 'rxjs-compat/observable/throw';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PersonalDetailsService {

  httpOptions = {
      headers: new HttpHeaders({
          'Content-Type'                  : 'application/json',
          'Access-Control-Allow-Origin'   : '*',
          'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
          // 'IP-Address'                    :  this.localStorageService.getIP()
      })
    };
  constructor( 
    private router              : Router,
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService) { }

    apiUrl = this.localStorageService.getApiServerUrl();

  getUser (){
    return this.httpClient.get(this.apiUrl+"/statistic/user-data-stats/0/0/null/null",this.httpOptions)
    // .pipe(
    //     catchError(this.handleError)
    // ); 
  }
}