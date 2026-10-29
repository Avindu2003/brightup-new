import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationSummaryService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + this.localStorageService.getToken(),
    })
  };

  constructor(
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService
  ) { }

  
apiUrl = this.localStorageService.getApiServerUrl() + "/user/web/registration-summary";

getSummary(fromDate: any, toDate: any) {
  return this.httpClient.get(this.apiUrl +"/"+fromDate+"/"+toDate, this.httpOptions)
}




}











