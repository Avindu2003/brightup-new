import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Paper } from '../app/converter/paper/paper.component';

// const API_SERVER_URL = '//localhost:8020';

// const API_SERVER_URL = 'http://64.227.189.112:8084'
const API_SERVER_URL = 'https://brightup.lk:8084'
// const API_SERVER_URL = ''

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(
    private router: Router
  ) { }
  getToken(): string {
    const token = localStorage.getItem('BU-backoffice-token');
    if (token == null) {
      this.router.navigate(['auth/login']);
    }
    return token;
  }

  getApiServerUrl(): string {
    return API_SERVER_URL;
  }

  setToken(token: string): void {
    localStorage.setItem('BU-backoffice-token', token);
  }

  logout(): void {
    localStorage.removeItem('BU-backoffice-token');
    this.router.navigate(['auth/login']);
  }





  // paper
  setPaper(paper: Paper): void {
    // call getPapers() and check if paper exists with same subject, year, medium, questionType, if so, update it or create a new one
    const papers = this.getPapers();
    const existingPaperIndex = papers.findIndex(p =>
      p.subject === paper.subject &&
      p.year === paper.year &&
      p.medium === paper.medium &&
      p.questionType === paper.questionType
    );
    if (existingPaperIndex !== -1) {
      // Update existing paper
      papers[existingPaperIndex] = paper;
    } else {
      // Add new paper
      papers.push(paper);
    }
    window.localStorage.setItem('OCR-papers', JSON.stringify(papers));
  }
  
  getPapers(): Paper[] {
    if (window.localStorage.getItem('OCR-papers') == null) {
      window.localStorage.setItem('OCR-papers', JSON.stringify([]));
    }
    console.log('papers', window.localStorage.getItem('OCR-papers'));
    return JSON.parse(window.localStorage.getItem('OCR-papers') || '[]');
  }

  getPaperData(paper: Paper): Paper {
    let localPaper: Paper = paper;
    const papers = this.getPapers();
    const existingPaperIndex = papers.findIndex(p =>
      p.subject === paper.subject &&
      p.year === paper.year &&
      p.medium === paper.medium &&
      p.questionType === paper.questionType
    );
    if (existingPaperIndex !== -1) {
      // Update existing paper
      localPaper = papers[existingPaperIndex];
    }
    return localPaper;
  }

  setSelectedPaper(paper: Paper): void {
    console.log('Setting selected paper:');
    console.log(paper);
    window.localStorage.setItem('selected-paper', JSON.stringify(paper));
  }

  getSelectedPaper(): Paper {
    if (window.localStorage.getItem('selected-paper') == null) {
      return {} as Paper; // Return an empty object if no paper is selected
    }
    return JSON.parse(window.localStorage.getItem('selected-paper') || '{}');
  }

  clearSelectedPaper(): void {
    window.localStorage.removeItem('selected-paper'); 
  }

  checkPaperExist(): any[] {
    if (window.localStorage.getItem('OCR-papers') == null) {
      window.localStorage.setItem('OCR-papers', JSON.stringify([]));
    }
    return JSON.parse(window.localStorage.getItem('OCR-papers') || '[]');
  }

  //  settings
  setSettings(settings: any): void {
    window.localStorage.setItem('settings-OCR', JSON.stringify(settings));
  }

  getSettings(): any[] {
    if (window.localStorage.getItem('settings-OCR') == null) {
      let data = [
        {
          key: 'questionIdentifier',
          value: '1)'
        },
        {
          key: 'optionIdentifier',
          value: '(I)'
        },
        {
          key: 'answerIdentifier',
          value: '(I)'
        }
      ]
      window.localStorage.setItem('settings-OCR', JSON.stringify(data));
    }
    return JSON.parse(window.localStorage.getItem('settings-OCR') || '[]');
  }

  //token
  // setToken(token: string): void {
  //   window.localStorage.setItem('token-OCR', token);
  // }

  // getToken(): string {
  //   const token = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUyIsInVzZXJOYW1lIjoiYWRtaW4iLCJ1c2VySWQiOjEsImlhdCI6MTc2MjUwMTYxMSwiZXhwIjoxNzcwMjc3NjExLCJpc3MiOiJvcGVuYXJjIn0.RK5zA0ZI7vb07vryGwTGg6C_jzJKgxyGdnTaDBmcYrk"
  //   // const token = localStorage.getItem('token-OCR');
  //   if (token == null) {
  //     this.router.navigate(['auth/login']);
  //   }
  //   return token;
  // }

  // Remove storage data
  public removeLocalStorageData() {
    window.localStorage.removeItem('token-OCR');
    window.localStorage.removeItem('data-OCR');
  }

  //set data
  setData(data: any): void {
    window.localStorage.setItem('data-OCR', JSON.stringify(data));
  }

  getData(): any {
    return JSON.parse(window.localStorage.getItem('data-OCR') || '');
  }

  //authenticate login -- true / false
  authenticateLogin(): boolean {
    if (this.getData() != null && this.getToken() != null) {
      return true;
    } else {
      return false;
    }
  }

  //logout
  clearLogin(): void {
    window.localStorage.clear();
  }

  logOut() {
    // this.clearLogin();
    this.removeLocalStorageData();
    this.router.navigate(['/backoffice']);
  }
  //get server api url
  // getApiServerUrl(): string {
  //   return API_SERVER_URL;
  // }








}
