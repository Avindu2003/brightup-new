import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
    httpOptions = {
      headers: new HttpHeaders({
          'Content-Type'                  : 'application/json',
          'Access-Control-Allow-Origin'   : '*',
          'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
      })
    };
  // private apiUrl = 'https://brightup.lk:8084/auth/login/system-user';

  constructor(
    private router              : Router,
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService
  ) {}
    apiUrl = this.localStorageService.getApiServerUrl();


  login(data:any): Observable<any> {
    return this.httpClient.post(this.apiUrl+"/auth/login/system-user", data );
  }

}
