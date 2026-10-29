import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { LocalStorageService } from '../../local-storage.service';
import { _throw } from 'rxjs-compat/observable/throw';
import { catchError } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
  })
  export class PushNotificationsService {

httpOptions= {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + this.localStorageService.getToken()
    })
  };

  httpOptionsFile = {
    headers: new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + this.localStorageService.getToken()
    })
  };
  constructor(
    private httpClient: HttpClient,
    private localStorageService: LocalStorageService,
    //private common: CommonServiceService,
  ) { }


apiUrl = this.localStorageService.getApiServerUrl() +'/notification';
apiUrl2 = this.localStorageService.getApiServerUrl();

// HTTP request error handling
private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error('Backend returned code error' + error);
    }
    return _throw('Something bad happened; please try again later.');
  }

  getUser() {
    return this.httpClient.get(this.apiUrl2+"/user/web/A",this.httpOptions)
  }
  getPushNotification(){
    return this.httpClient.get(this.apiUrl2+"/push-notification",this.httpOptions)
  }

  create(formData: FormData) {
    //this.common.validateToken();
    return this.httpClient.post(this.apiUrl+"/send " , formData ,this.httpOptionsFile).pipe(
      catchError(this.handleError)
    );
  }

  getAll(){
    return this.httpClient.get(this.apiUrl,this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }
  getSubjectWithExamCategory() {
    return this.httpClient.get(this.apiUrl2+"/common/subjects/stream/exam-category",this.httpOptions)
  }
}