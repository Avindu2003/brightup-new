import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../local-storage.service';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class SchoolService {

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

    apiUrl = this.localStorageService.getApiServerUrl()+'/school';
  
  postData(data:any): Observable<any> {
    console.log("sumbit");
    console.log(data);

    return this.httpClient.post(this.apiUrl+" ",data,this.httpOptions);
  }

  getSchool(){
    return this.httpClient.get(this.apiUrl+"/null",this.httpOptions);
  }

  updateData(schoolId: string, data: any): Observable<any> {
  return this.httpClient.put(this.apiUrl+" ",data,this.httpOptions);
  }
}
