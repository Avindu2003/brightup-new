import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../local-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChaptersService {
  httpOptions = {
        headers: new HttpHeaders({
            'Content-Type'                  : 'application/json',
            'Access-Control-Allow-Origin'   : '*',
            'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
        })
      };

  constructor( 
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService){ }

    apiUrl = this.localStorageService.getApiServerUrl()+'/chapter';

    getChapters(){
      return this.httpClient.get(this.apiUrl+"/null",this.httpOptions)
    }

    postData(data: any): Observable<HttpResponse<any>>{
      console.log("Post");
      console.log(data);
      return this.httpClient.post<any>(this.apiUrl, data,this.httpOptions);
    }

    updateData(code:string,data:any): Observable<HttpResponse<any>>{
    return this.httpClient.put<any>(this.apiUrl, data, this.httpOptions);
    }

    apiUrlNew = this.localStorageService.getApiServerUrl()+'/common';

    getExamCategory() {
      return this.httpClient.get(this.apiUrlNew + "/exam-category/subjects" , this.httpOptions);
    }

}
