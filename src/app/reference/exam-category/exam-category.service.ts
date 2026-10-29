import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class ExamCategoryService {

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

    apiUrl = this.localStorageService.getApiServerUrl() + "/exam-category";

  getExamCategory() {
    return this.httpClient.get(this.apiUrl+"/null",this.httpOptions)
  }

  create(data: any) {
    return this.httpClient.post(this.apiUrl+"",data,this.httpOptions)
  }

  delete(id: any) {
    return this.httpClient.delete(this.apiUrl+"/"+id,this.httpOptions)
  }
  update(data:any){
      return this.httpClient.put(this.apiUrl , data , this.httpOptions)
  }
}
