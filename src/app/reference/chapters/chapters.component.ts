import { Component, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NbComponentType, NbWindowRef, NbWindowService } from '@nebular/theme';
import { LocalDataSource } from 'angular2-smart-table';
import { SubjectService } from '../subject/subject.service';
import { ChaptersService } from './chapters.service';
import Swal from 'sweetalert2';
// import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'ngx-chapters',
  templateUrl: './chapters.component.html',
  styleUrls: ['./chapters.component.scss']
})
export class ChaptersComponent {
  ChapterList: any[] = [];
  source: LocalDataSource = new LocalDataSource();
  windowRef: NbWindowRef;
  isChanged: boolean = false;
  chapter: any;
  errorMessage:any;
  loading: boolean = false;
  modelLoading: boolean = false;
  isChecked = true;
  subjectList : any[];
  examCategoryList: any[] = [];
  filteredSubjectList: any[] = [];

  form = new FormGroup({
    chapterId: new FormControl(''),
    // chapterNo: new FormControl('^([0-9]{1,3})$', [Validators.required]),
    chapterNo: new FormControl('', [Validators.required,Validators.pattern(/^([0-9]{1,3})$/)]),
    name: new FormControl('', [Validators.required]),
    sinName: new FormControl('',),
    tamName: new FormControl('',),
    year: new FormControl('', [Validators.pattern(/^([0-9]{1,2})$/)]),
    term: new FormControl('',),
    examCategoryId: new FormControl('',[Validators.required]),
    subjectId:new FormControl('',[Validators.required]),
    noOfPeriods: new FormControl('',[Validators.pattern(/^([0-9]{1,3})$/)]),
    status: new FormControl('', [Validators.required]),
    studyMaterialAvailable:new FormControl(false),

  });

  settings={
    attr: {
      class: 'table table-bordered', 
    },
    actions:{
     add: true,
     edit: true,
     delete: false,
     position: 'right',
    },
    hideSubHeader: true,
    mode: 'external',
     
    add: {
      addButtonContent: '<i class="nb-plus"></i>'
       },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>'
       },

     columns: {
      chapterNo: {
        title: 'Chapter No',
        type: 'string',
      },
      name: {
        title: 'Chapter Name',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'string',
        valuePrepareFunction: (value) => {
          return value === 'A' ? 'Active' : 'Inactive';
        }
      },
      subjectName:{
        title: 'Subject Name',
        type: 'string',
      },
      studyMaterialAvailable:{
        title:'Study Material Available',
        type:'boolean'
      }

      
    },
  };
  
  formPopup: TemplateRef<any> | NbComponentType;
  
  constructor(
      private windowService: NbWindowService,
      private subjectService: SubjectService,
      private chapterService: ChaptersService
  ) {}

  ngOnInit() {
    
    this.getExamCategories();
    
    this.getChapters();
    this.getSubject();
  }

  onFieldChange() {
    this.isEditMode = true;
    if (this.isEditMode) {
      const CurrntObjectValue = this.form.getRawValue();
      const normalizedListOrginal = {
        chapterNo: this.chapter.chapterNo,
        name: this.chapter.name,
        sinName: this.chapter.sinName,
        tamName: this.chapter.tamName,
        subjectId: this.chapter.subjectId,
        examCategoryId: this.chapter.examCategoryId,
        year: this.chapter.year,
        term: this.chapter.term,
        noOfPeriods: this.chapter.noOfPeriods,
        status: this.chapter.status,
        studyMaterialAvailable: this.chapter.studyMaterialAvailable,
      };
      const normalizedListCurrnt = {
        chapterNo: CurrntObjectValue.chapterNo,
        name: CurrntObjectValue.name,
        sinName: CurrntObjectValue.sinName,
        tamName: CurrntObjectValue.tamName,
        subjectId: CurrntObjectValue.subjectId,
        examCategoryId: CurrntObjectValue.examCategoryId,
        year: CurrntObjectValue.year,
        term: CurrntObjectValue.term,
        noOfPeriods: CurrntObjectValue.noOfPeriods,
        status: CurrntObjectValue.status,
        studyMaterialAvailable: CurrntObjectValue.studyMaterialAvailable,
      }
      if(JSON.stringify(normalizedListOrginal) == JSON.stringify(normalizedListCurrnt)) {
        this.isChanged = false;
      } else{
        this.isChanged = true;
      }
    }
  }

  getSubject() {
    this.subjectService.getSubject().subscribe({
      next: (res: any) => {
        if (res['code'] === 200) {
          this.subjectList = res['responseData']; //correctly assigned
          // console.log("Subjects loaded:", this.subjects);
        }
      },
      error: (err) => {
        console.error("Error loading subjects", err);
      }
    });
  }

  getExamCategories() {
    this.chapterService.getExamCategory().subscribe({
      next: (res: any) => {
        if (res.code === 200) {
          this.examCategoryList = res['responseData'];
          console.log("Exam CategoryList loaded:", this.examCategoryList);
        }
      },
      error: (err) => {
        console.error("Error loading subjects", err);
      }
    });
  }

  onExamCategoryChange(examCategoryId: number) {

    const selectedCategory = this.examCategoryList.find(
      category => category.examCategoryId === examCategoryId
    );
    this.filteredSubjectList = selectedCategory ? selectedCategory.subjectList : [];

    this.form.get('subjectId')?.reset();

    console.log('Selected Category:', examCategoryId);
    console.log('Filtered Subjects:', this.filteredSubjectList);
  }

  getChapters(){
    this.loading=true;
    this.chapterService.getChapters().subscribe((response)=>{
      this.ChapterList= response['responseData']
      const tableData = this.ChapterList.map(chapter=> ({
      chapterId: chapter.chapterId,
      chapterNo: chapter.chapterNo,
      name: chapter.name,         //edit form
      sinName:chapter.nameSinhala,
      tamName:chapter.nameTamil,
      year:chapter.year,
      term:chapter.term,
      noOfPeriods:chapter.noOfPeriods,
      status: chapter.status,
      subjectName: chapter.subject?.subject,         //table
      studyMaterialAvailable:chapter.studyMaterialAvailable,

      subjectId: chapter.subject?.subjectId,
      examCategoryId: chapter.subject?.examCategory?.examCategoryId
      
    }));

      this.loading = false;
      this.source.load(tableData);
      console.log("Loaded user data:", tableData);

      console.log("chapters")
      console.log(this.ChapterList)
    })
  }

  isEditMode = false;
  selecteChapterNo: string | null = null;
  
  openWindowForm(contentTemplate: any) {
    this.isEditMode = false;
    this.selecteChapterNo = null;
    this.errorMessage = null;
    
    this.form.reset();  
    // this.form.get('code')?.enable();  
    this.windowRef = this.windowService.open(contentTemplate, {
      title: 'Add New Chapter',
      hasBackdrop: true,
      closeOnEsc: false,
    });
  }
  
  edit(event: any, contentTemplate: any) {
    this.isEditMode = true;
    this.chapter = event.data;
    this.errorMessage = null;

    console.log("Event Data:",event.data)

    this.onExamCategoryChange(event.data.examCategoryId);

    // patch form with selected row data
    this.form.patchValue({
      chapterId: event.data.chapterId,
      chapterNo:event.data.chapterNo,
      name: event.data.name,
      sinName:event.data.sinName,
      tamName:event.data.tamName,
      year:event.data.year,
      term:event.data.term,
      noOfPeriods:event.data.noOfPeriods,
      status: event.data.status,
      subjectId: event.data.subjectId,
      studyMaterialAvailable: event.data.studyMaterialAvailable,

      examCategoryId: event.data.examCategoryId,
    });

    this.isChanged = false;
    this.modelLoading= true;

    this.windowRef = this.windowService.open(contentTemplate, {
      title: 'Edit Chapter',
      hasBackdrop: true,
      closeOnEsc: false,
    });
    
    this.modelLoading= false;
  }

  submitForm(): void {
      this.form.markAllAsTouched();
      if (this.form.valid) {
        const formValue = this.form.getRawValue();
  
        if (this.isEditMode) {
          const payload = {
            chapterId: formValue.chapterId,
            chapterNo: formValue.chapterNo,
            name: formValue.name,
            status: formValue.status,
            examCategory: {examCategoryId: formValue.examCategoryId},
            subject: {subjectId: formValue.subjectId},
            nameSinhala:formValue.sinName,
            nameTamil:formValue.tamName,
            year:formValue.year,
            term:formValue.term,
            noOfPeriods:formValue.noOfPeriods,
            studyMaterialAvailable: formValue.studyMaterialAvailable
          };
  
          this.modelLoading= true;
          this.chapterService.updateData(payload.chapterId, payload).subscribe({
            next: (res:any) => {
              //console.log(res)
              if (res['code'] === 200) {
                Swal.fire('Updated!', 'Chapter updated successfully.', 'success');
                // this.getSubject();
                this.getChapters();
                this.form.reset();
                this.windowRef.close();
                console.log("edit Success")
                this.modelLoading= false;
              } else {
                Swal.fire('Error!', 'Failed to update chapter.', 'error');
                this.modelLoading= false;
              }
            },
            error:(err) => {
              console.error('HttpErrorResponse:', err);
              Swal.fire('Error!', 'Failed to update chapter.', 'error');
              this.modelLoading= false;
            }
  
          });
          
        } else {
            this.modelLoading= true;
            const payload = {
              chapterNo: formValue.chapterNo,
              name: formValue.name,
              status: formValue.status,
              nameSinhala:formValue.sinName,
              nameTamil:formValue.tamName,
              year:formValue.year,
              term:formValue.term,
              noOfPeriods:formValue.noOfPeriods,
              examCategory: {examCategoryId: formValue.examCategoryId},
              subject: { subjectId: formValue.subjectId },
              // studyMaterialAvailable: formValue.studyMaterialAvailable
          };
           this.chapterService.postData(payload).subscribe({
            next: (res) => {
              console.log(res)
              if (res['code'] === 200) {
                Swal.fire('Created!', 'Chapter added successfully.', 'success');
                this.getChapters();
                this.form.reset();
                this.windowRef.close();
                this.modelLoading= false;
              }else {
                Swal.fire('Error!', 'Failed to create chapter.', 'error');
                this.modelLoading= false;
              }
            },
            error: (err) => {
              console.error('HttpErrorResponse:', err);
              Swal.fire('Error!', 'Server not reachable or crashed.', 'error');
              this.modelLoading= false;
            }
  
          });
  
        }};
  }

  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'chapterNo', search: query },
        { field: 'name', search: query },
        { field: 'subjectName', search: query },
      ], false);
    }

    console.log("")
    console.log(query)
  }  
}

