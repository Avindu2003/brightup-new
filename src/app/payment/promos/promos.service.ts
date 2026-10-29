import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PromosService {

    httpOptions = {
      headers: new HttpHeaders({
          'Content-Type'                  : 'application/json',
          'Access-Control-Allow-Origin'   : '*',
          'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
      })
    };

  constructor(
    private httpClient          : HttpClient,
    private localStorageService : LocalStorageService
  ) { }

   
    apiUrl = this.localStorageService.getApiServerUrl() + "/promo";

  getpromo() {
    return this.httpClient.get(this.apiUrl+"/status/null",this.httpOptions)
  }

  create(data: any) : Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(this.apiUrl,data,this.httpOptions)
  }


  delete(id: any)  {
    return this.httpClient.delete(this.apiUrl+"/"+id,this.httpOptions)
  }
   update(data: any) : Observable<HttpResponse<any>>{
    return this.httpClient.put<any>(this.apiUrl + "", data, this.httpOptions);        
  }

}










