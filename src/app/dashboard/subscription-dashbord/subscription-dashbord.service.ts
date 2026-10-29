import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionDashbordService {

httpOptions = {
      headers: new HttpHeaders({
          'Content-Type'                  : 'application/json',
          'Access-Control-Allow-Origin'   : '*',
          'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
      })
    };
   constructor( 
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService) { }

    apiUrl = this.localStorageService.getApiServerUrl();

  getDashbordDetails() {
    return this.httpClient.get(this.apiUrl+'/user-subscription/dashbord',this.httpOptions)
  }
}
