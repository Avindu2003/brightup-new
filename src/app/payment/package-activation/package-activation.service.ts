import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../local-storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackageActivationService {
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type'                  : 'application/json',
        'Access-Control-Allow-Origin'   : '*',
        'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
        // 'IP-Address'                    :  this.localStorageService.getIP()
    })
  };
  constructor( 
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService) { }

    apiUrl = this.localStorageService.getApiServerUrl();

  getUser (){
    return this.httpClient.get(this.apiUrl+"/user/registered-students",this.httpOptions)
  }
  submit (data:any) {
    console.log("ff")
    return this.httpClient.put(this.apiUrl+"/payment/package-activation" , data , this.httpOptions)
  }
}
