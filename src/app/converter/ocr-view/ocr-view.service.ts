import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class OcrViewService {


  private localStorageService = inject(LocalStorageService);

  constructor( 
    // private router              : Router,
    private httpClient          : HttpClient,
    ) 
    { 
      this.apiUrl = this.localStorageService.getApiServerUrl();
    }

  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type'                  : 'application/json',
        'Access-Control-Allow-Origin'   : '*',
        // 'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
    })
  };

  httpFileOptions = {
    headers: new HttpHeaders({
        'Access-Control-Allow-Origin'   : '*',
        'Authorization'                 : 'Bearer ' + this.localStorageService.getToken(),
    })
  };
  apiUrl: string;
  
  

  imageUrl(formData: any) {
    return this.httpClient.post(this.apiUrl+"/question/file-upload",formData,this.httpFileOptions)
  }
}
