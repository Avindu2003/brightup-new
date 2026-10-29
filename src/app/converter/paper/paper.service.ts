import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class PaperService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  subjectApiUrl: string;

  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.subjectApiUrl = this.localStorageService.getApiServerUrl() + '/subject';
   }

  

  getSubjectsByGradeCategory(gradeCategorty: string) {
    return this.httpClient.get(this.subjectApiUrl + "/grade-category/" + gradeCategorty, this.httpOptions);
  }

}
