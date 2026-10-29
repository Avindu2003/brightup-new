import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

    httpOptions = {
      headers: new HttpHeaders({
          'Content-Type'                  : 'application/json',
          'Access-Control-Allow-Origin'   : '*',
          'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
      })
    };

  constructor(
    private router              : Router,
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService
  ) {}

  apiUrl = this.localStorageService.getApiServerUrl();

  changepassword(data:any): Observable<any> {
    return this.httpClient.put(this.apiUrl+"/system-user/reset-password",data,this.httpOptions );
  }
}