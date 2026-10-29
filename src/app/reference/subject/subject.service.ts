import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type'                  : 'application/json',
        'Access-Control-Allow-Origin'   : '*',
        'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
    })
  };

  httpFileOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin'   : '*',
        'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
    })
  };
  constructor( 
    private router              : Router,
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService) { }

    apiUrl = this.localStorageService.getApiServerUrl() + "/subject";
  // getExamCategory() {
  //   return this.httpClient.get(this.apiUrl+"/null",this.httpOptions)
  // }
  getSubject() {
    return this.httpClient.get(this.apiUrl+"/status/null",this.httpOptions)
  }

  getSubjectStream(code) {
    return this.httpClient.get(this.apiUrl+`/stream/${code}`,this.httpOptions)
  }

  create(data: any) {
    return this.httpClient.post(this.apiUrl,data,this.httpFileOptions)
  }
  
  update(formData: FormData){
      return this.httpClient.put(this.apiUrl , formData , this.httpFileOptions)
  }
}
