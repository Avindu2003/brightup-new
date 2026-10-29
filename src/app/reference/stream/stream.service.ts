import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StreamService {
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
    private localStorageService : LocalStorageService){ }

  
    apiUrl = this.localStorageService.getApiServerUrl()+'/stream';

  getStream() {
    return this.httpClient.get(this.apiUrl+"/null",this.httpOptions)
  }

  getStreamByStatus(){
    return this.httpClient.get(this.apiUrl+"/A",this.httpOptions)
  }

  postData(data: any): Observable<HttpResponse<any>>{
    console.log("Post");
    console.log(data);
    return this.httpClient.post<any>(this.apiUrl + "", data,this.httpOptions);
  }
  updateData(code:string,data:any): Observable<HttpResponse<any>>{
    //return this.httpClient.post(this.apiUrl + "/stream/${code}", data, this.httpOptions);
    return this.httpClient.put<any>(this.apiUrl + "", data, this.httpOptions);
  }
}
