import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionPackageService {

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
        private localStorageService : LocalStorageService) { }

        apiUrl = this.localStorageService.getApiServerUrl()+'/subscription-package';

        getPayment(){
          return this.httpClient.get(this.apiUrl+"/null",this.httpOptions);
        }
        getSubscriptionPackage(){
          return this.httpClient.get(this.apiUrl+"/A",this.httpOptions);
        }
        updateData(subscriptionPackageId: string, data: any): Observable<any> {
          return this.httpClient.put(this.apiUrl+" ",data,this.httpOptions);
        }

        postData(data:any): Observable<any> {
          console.log("sumbit");
          console.log(data);

          return this.httpClient.post(this.apiUrl+" ",data,this.httpOptions);
        }
}