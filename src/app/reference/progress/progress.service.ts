import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type'                  : 'application/json',
        'Access-Control-Allow-Origin'   : '*',
        'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
    })
  };

  constructor(
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService
  ) { }
  apiUrl = this.localStorageService.getApiServerUrl() + "/user";


  getUser() {
    return this.httpClient.get(this.apiUrl+"/web/A",this.httpOptions)
  }

  getProgress(id) {
    return this.httpClient.get(this.apiUrl+`/test-profile/${id}`,this.httpOptions)
  }
}
