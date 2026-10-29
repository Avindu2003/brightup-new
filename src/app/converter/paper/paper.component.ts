import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaperService } from './paper.service';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from '../../local-storage.service';
import { Router } from '@angular/router';

export interface Paper {
  gradeCategory: string;
  subject: string;
  questionType: string;
  year: number;
  medium: string;
  questions?: any[];
  paperBase64?: string;
  paperMarkdown?: string;
  paperImages?: any[];
}

@Component({
  selector: 'app-paper',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    PaperService
  ],
  templateUrl: './paper.component.html',
  styleUrls: [ './paper.component.scss']
})
export class PaperComponent {

  questionForm!: FormGroup;
  paperBase64: string = '';

  gradeCategories = ['OL', 'AL', 'BIT'];
  questionTypes = ['PP', 'MP'];
  mediums = [
    { label: 'English', value: 'ENG' },
    { label: 'Sinhala', value: 'SIN' },
    { label: 'Tamil', value: 'TAM' }
  ];
  years: number[] = [];

  subjects: any[] = [];
  isTextMode: boolean = false;
  paperText: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private paperService: PaperService,
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.initYears();

    this.questionForm = this.fb.group({
      gradeCategory: ['', Validators.required],
      subject: ['', Validators.required],
      questionType: ['', Validators.required],
      year: ['', Validators.required],
      text: [''],
      medium: ['', Validators.required]
    });
  }

  initYears() {
    let currentYear = new Date().getFullYear();
    for (;currentYear >= 2000; currentYear--) {
      this.years.push(currentYear);
    }
  }

  loadSubjects() {
    let gradeCategory = this.questionForm?.get('gradeCategory')?.value;
    this.paperService.getSubjectsByGradeCategory(gradeCategory).subscribe({
      next: (response: any) => {
        if(response['code'] === 200) {
          this.subjects = response['responseData'];
        }
      },
      error: (error: any) => {
        console.error('Failed to load subjects', error);
      }
    });
  }

  submit() {
    // console.log('this.questionForm')
    // console.log('this.questionForm', this.questionForm.value);
    // console.log('this.paperBase64', this.paperBase64);
    // if (this.questionForm.valid && this.paperBase64) {
    if (this.questionForm.valid) {
      let data: Paper = {
        gradeCategory: this.questionForm.get('gradeCategory')?.value,
        subject: this.questionForm.get('subject')?.value,
        questionType: this.questionForm.get('questionType')?.value,
        year: this.questionForm.get('year')?.value,
        medium: this.questionForm.get('medium')?.value,
        
      }
      if (this.isTextMode) {
        data.paperMarkdown = this.questionForm.get('text')?.value;
      }else{
        data.paperBase64 = this.paperBase64;
      }
      this.localStorageService.setSelectedPaper(data);
      this.localStorageService.setPaper(data);
      this.router.navigate(['/converter/ocr-view']);
    } else {
      this.questionForm.markAllAsTouched();
    }
  }

  onSelectFile(event: any) {
    console.log('File selected:', event);
    if (event.target.files) {
      let file = event.target.files[0];
       console.log('file', file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log('File loaded:', reader.result);
        this.paperBase64 = reader.result as string;
        // console.log('Paper Base64:', this.paperBase64);
      }
    }
  }
  onChange(event: any) {
    this.isTextMode = event.target.checked;
  }
}
