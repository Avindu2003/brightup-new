import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';


@Injectable({
  providedIn: 'root'
})
export class ShortNotesService {
  httpOptions = {
      headers: new HttpHeaders({
          // 'Content-Type'                  : 'application/json',
          'Access-Control-Allow-Origin'   : '*',
          'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
      })
    };
  constructor(
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService
  ) { }

  apiUrl = this.localStorageService.getApiServerUrl();


  getSubjectByExamCategory(code) {
    return this.httpClient.get(this.apiUrl+`/subject/grade-category/${code}`,this.httpOptions)
  }
  getChapterBySubject(code) {
    return this.httpClient.get(this.apiUrl+`/chapter/subject/${code}`,this.httpOptions)
  }
  // getChapterByMedium(code) {
  //   return this.httpClient.get(this.apiUrl+`/subject/grade-category/${code}`,this.httpOptions)
  // }
  // getChapterBySubject() {
  //   return this.httpClient.get(this.apiUrl+"/status/null",this.httpOptions)
  // }
  getExamCategory() {
    return this.httpClient.get(this.apiUrl+"/reference/grade-category",this.httpOptions)
  }
  create(formData) {
    return this.httpClient.post(this.apiUrl+"/study-material/bulk-file-upload",formData,this.httpOptions)
  }
}
