import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../local-storage.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class DeviceResetService {
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
    return this.httpClient.get(this.apiUrl+"/user/registered-students",this.httpOptions)
  }
  resetDevice(mobileNo: string) {
    return this.httpClient.put(this.apiUrl+"/user/device-res/" + mobileNo, null, this.httpOptions);
  }
}
