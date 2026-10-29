import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ContentSummaryService  {
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

    apiUrl = this.localStorageService.getApiServerUrl() ;

  getContentSummaryDetails() {
    return this.httpClient.get(this.apiUrl+"/dashboard-web/overview",this.httpOptions)
  }

  getSubjectWithExamCategory() {
    return this.httpClient.get(this.apiUrl+"/common/subjects/exam-category/chapters",this.httpOptions)
  }

  filter(data: any) {
    return this.httpClient.post(this.apiUrl+"/dashboard-web/statistics",data,this.httpOptions)
  }
}
