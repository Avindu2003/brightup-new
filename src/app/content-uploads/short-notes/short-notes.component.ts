import { Component } from '@angular/core';
import { ShortNotesService } from './short-notes.service';
import { LocalDataSource } from 'angular2-smart-table';
import { NbWindowService } from '@nebular/theme';
import * as JSZip from 'jszip';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';
@Component({
  selector: 'ngx-short-notes',
  templateUrl: './short-notes.component.html',
  styleUrl: './short-notes.component.scss'
})
export class ShortNotesComponent {
  imagePreviews: string[] = []; 
  selectedFiles: File[] = [];
  loading: boolean = false;
  dialogRef: any;
  imageUrl              : any ;
  modelLoading: boolean = true;
  addForm : FormGroup;
  editForm: FormGroup;
  file: any;
  subjectList: any[] = [];
  MediumList: any[] = [];
  chapterList: any[] = [];
  checkUpdate : boolean = false;
  ExamCategoryList       : any[];
  allowSize = 10485760;
  settings = {
    attr: {
      class: 'table table-bordered', 
    },
    actions: {
      add: false,
      edit: true,
      delete: false,
      position: 'right',
    },
    hideSubHeader: true,
    mode: 'external',

    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    columns: {
      examCategoryId: {
        title: 'Exam Category',
        type: 'string',
      },
      subject: {
        title: 'Subject',
        type: 'string',
      },
      medium: {
        title: 'Medium',
        type: 'string',
      },
      chapter: {
        title: 'Chapter',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'string',
      },

    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private shortNotesService: ShortNotesService,
    private windowService: NbWindowService
  ) {
  }
  
  ngOnInit(){
    this.getExamCategory();
    this.initForm();
  }
  private initForm(){
    this.addForm = new FormGroup({
      'examCategoryId'        : new FormControl(null,Validators.required),
      'subject'        : new FormControl(null,Validators.required),
      // 'status'          : new FormControl(null,Validators.required),
      'medium'     : new FormControl(null,Validators.required),
      'chapter'     : new FormControl(null,Validators.required),
      'image': new FormControl(null,Validators.required),

    });

    this.editForm = new FormGroup({
      'examCategory'        : new FormControl(null,Validators.required),
      'shortNoteId'       : new FormControl,
      'subject'        : new FormControl(null,Validators.required),
      'status'          : new FormControl(null,Validators.required),
      'chapter'     : new FormControl(null,Validators.required),
      'medium'     : new FormControl(null,Validators.required),
      'image': new FormControl(null),
    });
  }

  create(){
    this.addForm.markAllAsTouched();
    
    if(this.addForm.valid){
      let data = {
        "studyMaterialType"  : "SN",
        "chapterId"              : this.addForm.get('chapter').value,
        "medium"                : this.addForm.get('medium').value,
      }
      this.modelLoading = true;
      const formData: FormData = new FormData();
      formData.append('data', JSON.stringify(data));

      this.selectedFiles.forEach(file => formData.append('fileList', file));
      
      this.shortNotesService.create(formData).subscribe({
        next: (response) => {
          setTimeout(() => { this.modelLoading = false; }, 1600);
          if (response['code'] == '200') {
            swal.fire('Files to upload Successfully!', '', 'success');
            // this.getExamCategory();
            this.addForm.reset();
            this.file = null;
            this.addForm.reset();
            this.selectedFiles = [];
            this.imagePreviews = [];
             if (this.dialogRef) this.dialogRef.close();
          } else if (response['code'] == '400'){
            swal.fire('Warning', 'Failed!', 'warning');
          }else if(response['code'] == '416') {
              // this.examExistsError = true
          }
          
          
          else{
            swal.fire('Warning', 'Something went wrong try again later', 'warning');
          }
        },
        error: (e) => {
          swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
          this.modelLoading = false;
        }
      });
    }
  }
  // create() {
  //   this.addForm.markAllAsTouched();
  //   this.modelLoading = true;
  //   if (this.addForm.valid) {
  //     let data = {
  //       studyMaterialType: "SN",
  //       chapterId: this.addForm.get('chapter')?.value,
  //       medium: this.addForm.get('medium')?.value,
  //     };

  //     const formData = new FormData();
  //     formData.append('data', JSON.stringify(data));

  //     // ---------------------------
  //     // ZIP all selected files
  //     // ---------------------------
  //     const zip = new JSZip();

  //     if (this.selectedFiles && this.selectedFiles.length > 0) {
  //       this.selectedFiles.forEach(file => {
  //         zip.file(file.name, file);
  //       });
  //     }

  //     // Generate ZIP and upload
  //     zip.generateAsync({ type: "blob" }).then(zipBlob => {
  //       formData.append('fileList', zipBlob, "files.zip");

  //       console.log("ZIP file created...");
  //       console.log("Sending only one fileList entry...");

  //       this.shortNotesService.create(formData).subscribe({
  //         next: (response:any) => {
  //           setTimeout(() => { this.modelLoading = false; }, 1600);

  //           if (response.code === '200') {
  //             swal.fire('Files uploaded Successfully!', '', 'success');
  //             this.addForm.reset();
  //             this.selectedFiles = [];
  //             this.imagePreviews = [];
  //             if (this.dialogRef) this.dialogRef.close();

  //           } else if (response.code === '400') {
  //             swal.fire('Warning', 'Failed!', 'warning');

  //           } else if (response.code === '416') {
  //             // optional handling
  //           } else {
  //             swal.fire('Warning', 'Something went wrong, try again later', 'warning');
  //           }
  //         },
  //         error: () => {
  //           swal.fire('Warning', 'Something bad happened, please try again later!', 'warning');
  //         }
  //       });
  //     });
  //   }
  // }
  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'subject', search: query },
      ], false);
    }
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  openWindowForm(contentTemplate:any, isEdit: boolean = false) {
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title: isEdit ? 'Edit Short Notes' : 'Add New Short Notes'
    };
    this.modelLoading = true;
    this.dialogRef = this.windowService.open(contentTemplate, config);
    this.modelLoading = false;
  }
  getExamCategory() {
    this.shortNotesService.getExamCategory().subscribe((response: any) => {
      
      // Debug: Look at the full object first
      console.log('Full Response Object:', response);

      // If the response IS the array, assign it directly:
      this.ExamCategoryList = response; 
      
      console.log('Assigned List:', this.ExamCategoryList);
    });
  }
  getSubjectByExamCategory(event: any) {
    const data = this.addForm.get('examCategoryId').value
    this.shortNotesService.getSubjectByExamCategory(data).subscribe({
      next: (response: any) => {
        setTimeout(() => { this.modelLoading = false; }, 1600);
        if (response['code'] == '200') {
          this.loading = false;
          this.subjectList = response.responseData;
          // swal.fire('Exam Category Created Successfully!', '', 'success');
          // this.getExamCategory();
          // this.addForm.reset();
          this.file = null;
          //  if (this.dialogRef) this.dialogRef.close();
        } else if (response['code'] == '400'){
          swal.fire('Warning', 'Failed!', 'warning');
        }else if(response['code'] == '416') {
            // this.examExistsError = true
        }
        
        
        else{
          swal.fire('Warning', 'Something went wrong try again later', 'warning');
        }
      },
      error: (e) => {
        swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
      }
    });
  }


  getChapterBySubject(event: any) {
    const data = this.addForm.get('subject').value
    this.shortNotesService.getChapterBySubject(data).subscribe({
      next: (response: any) => {
        setTimeout(() => { this.modelLoading = false; }, 1600);
        if (response['code'] == '200') {
          this.loading = false;
          this.chapterList = response.responseData;
          // swal.fire('Exam Category Created Successfully!', '', 'success');
          // this.getExamCategory();
          // this.addForm.reset();
          this.file = null;
          //  if (this.dialogRef) this.dialogRef.close();
        } else if (response['code'] == '400'){
          swal.fire('Warning', 'Failed!', 'warning');
        }else if(response['code'] == '416') {
            // this.examExistsError = true
        }
        
        
        else{
          swal.fire('Warning', 'Something went wrong try again later', 'warning');
        }
      },
      error: (e) => {
        swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
      }
    });
  }

  // getChapterByMedium(event: any) {
  //   const data = this.addForm.get('subject').value
  //   this.shortNotesService.getChapterByMedium(data).subscribe({
  //     next: (response: any) => {
  //       setTimeout(() => { this.modelLoading = false; }, 1600);
  //       if (response['code'] == '200') {
  //         this.loading = false;
  //         this.subjectList = response.responseData;
  //         // swal.fire('Exam Category Created Successfully!', '', 'success');
  //         // this.getExamCategory();
  //         // this.addForm.reset();
  //         this.file = null;
  //         //  if (this.dialogRef) this.dialogRef.close();
  //       } else if (response['code'] == '400'){
  //         swal.fire('Warning', 'Failed!', 'warning');
  //       }else if(response['code'] == '416') {
  //           // this.examExistsError = true
  //       }
        
        
  //       else{
  //         swal.fire('Warning', 'Something went wrong try again later', 'warning');
  //       }
  //     },
  //     error: (e) => {
  //       swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
  //     }
  //   });
  // }
  onFileSelected(event: Event, isEdit: boolean = false) {
    this.checkUpdate = false;
    const input = event.target as HTMLInputElement;

    this.selectedFiles = [];
    this.imagePreviews = [];

    if (input.files && input.files.length > 0) {
      let totalSize = 0;
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      const newFiles: File[] = [];

      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];

        if (!allowedTypes.includes(file.type)) {
          swal.fire('Warning', `File "${file.name}" is not a valid image. Only JPG/PNG allowed.`, 'warning');
          this.resetFileInput(input, isEdit);
          return;
        }

        totalSize += file.size;
        newFiles.push(file);
      }
      if (totalSize > this.allowSize) {
        swal.fire('Warning', 'Total file size exceeds 10MB limit.', 'warning');
        this.resetFileInput(input, isEdit);
        return;
      }

      this.selectedFiles = newFiles;

      if (isEdit) {
        this.editForm.get('image')?.setValue('valid'); 
        this.checkUpdate = true;
      } else {
        this.addForm.get('image')?.setValue('valid');
      }

      // Generate Previews
      newFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagePreviews.push(e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  resetFileInput(input: HTMLInputElement, isEdit: boolean) {
    input.value = '';
    this.selectedFiles = [];
    this.imagePreviews = [];
    if (isEdit) {
      this.editForm.get('image')?.setValue(null);
    } else {
      this.addForm.get('image')?.setValue(null);
    }
  }
  
    // edit(event: any,editModal) {
    //   // this.ExamCategory = event.data; 
    //   this.modelLoading = true;
      
    //   this.editForm.patchValue({
    //     // subject: this.ExamCategory.subject,
    //     // status: this.ExamCategory.status  === 'Active' ? 'A' : 'I',
    //     // code: this.ExamCategory.code,
    //   });
    //   // this.orginalExamCategory =this.editForm.getRawValue();
    //   // this.isChanged = false;
    //   this.openWindowForm(editModal, true);
    //   this.modelLoading = false;
    // }
  
    update() {
      // if(this.editForm.valid){
      //   const data ={
      //     'shortNoteId' : this.ExamCategory.shortNoteId,
      //     'subject' : this.editForm.value.subject,
      //     'status':this.editForm.value.status,
      //     'code':this.editForm.value.code,
      //   }
      //   this.examCategoryService.update(data).subscribe({
      //     next: (response) => {
      //       setTimeout(() => { this.createLoading = false; }, 1600);
      //       if (response['code'] == '200') {
      //         swal.fire('Warning', 'Exam Category Update Successfully!', 'success');
      //         // this.getExamCategory();
      //         if (this.dialogRef) this.dialogRef.close();
      //       }
      //       else{
      //         swal.fire('Warning', 'Something went wrong try again later !', 'warning');
      //       }
      //     },
      //     error: (e) => {
      //       swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
      //     }
      //   });
      // }else{
      //  swal.fire('Warning', 'Please fill all required fields!', 'warning');
      // }
    }
}
