import { Component } from '@angular/core';
import { ExamCategoryService } from './exam-category.service';
import { LocalDataSource } from 'angular2-smart-table';
import { NbWindowService } from '@nebular/theme';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';



@Component({
  selector: 'ngx-exam-category',
  templateUrl: './exam-category.component.html',
  styleUrls: ['./exam-category.component.scss']
})
export class ExamCategoryComponent {
  examExistsError: boolean = false;
  orginalExamCategory : any;
  ExamCategory : any;
  ExamCategoryList       : any[];
  addForm : FormGroup;
  editForm: FormGroup;
  dialogRef: any;
  createLoading         : boolean = false;
  isChanged : boolean = false;
  loading: boolean = true;
  modelLoading: boolean = false;
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
      code: {
        title: 'Code',
        type: 'string',
      },
      exam: {
        title: 'Exam Category Name',
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
    private examCategoryService: ExamCategoryService,
    private windowService: NbWindowService
  ) {
  }
  
  ngOnInit(){
    this.getExamCategory();
    this.initForm();
  }
  private initForm(){
    this.addForm = new FormGroup({
      'exam'        : new FormControl(null,Validators.required),
      'status'          : new FormControl(null,Validators.required),
      'code'     : new FormControl(null,Validators.required),
    });

    this.editForm = new FormGroup({
      'examCategoryId'       : new FormControl,
      'exam'        : new FormControl(null,Validators.required),
      'status'          : new FormControl(null,Validators.required),
      'code'     : new FormControl({value:null ,disabled: true},Validators.required),
    });
  }
  create(){
    this.addForm.markAllAsTouched();
    this.examExistsError = false;
    this.modelLoading = true;
    if(this.addForm.valid){
      let data = {
        "exam"  : this.addForm.get('exam').value,
        "status"              : this.addForm.get('status').value,
        "code"                : this.addForm.get('code').value,
      }
        this.examCategoryService.create(data).subscribe({
        next: (response) => {
          setTimeout(() => { this.modelLoading = false; }, 1600);
          if (response['code'] == '200') {
            swal.fire('Exam Category Created Successfully!', '', 'success');
            this.getExamCategory();
            this.addForm.reset();
             if (this.dialogRef) this.dialogRef.close();
          } else if (response['code'] == '400'){
            swal.fire('Warning', 'Failed!', 'warning');
          }else if(response['code'] == '416') {
              this.examExistsError = true
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
  }
  getExamCategory(){
    this.loading = true;
    this.examCategoryService.getExamCategory()
    .subscribe((response)=>{
      this.ExamCategoryList = response['responseData']
      this.loading = false;
      this.source.load(this.ExamCategoryList.map(item => ({
          examCategoryId: item.examCategoryId,
          exam: item.exam,
          status: item.status === 'A' ? 'Active' : 'Inactive',
          code: item.code
      })))
    })
  }

  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'exam', search: query },
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
      title: isEdit ? 'Edit Exam Category' : 'Add New Exam Category'
    };
    this.modelLoading = true;
    this.dialogRef = this.windowService.open(contentTemplate, config);
    this.modelLoading = false;
  }

  onFieldChange(){
    const changeExamcCategory= this.editForm.getRawValue();
    if(  changeExamcCategory.exam == this.orginalExamCategory.exam &&
    changeExamcCategory.status == this.orginalExamCategory.status){
      this.isChanged = false;

    }else{
      this.isChanged = true;

    }
  }

  edit(event: any,editModal) {
    this.ExamCategory = event.data; 
    this.modelLoading = true;
    
    this.editForm.patchValue({
      exam: this.ExamCategory.exam,
      status: this.ExamCategory.status  === 'Active' ? 'A' : 'I',
      code: this.ExamCategory.code,
    });
    this.orginalExamCategory =this.editForm.getRawValue();
    this.isChanged = false;
    this.openWindowForm(editModal, true);
    this.modelLoading = false;
  }

  update() {
    if(this.editForm.valid){
      this.modelLoading = true;
      const data ={
        'examCategoryId' : this.ExamCategory.examCategoryId,
        'exam' : this.editForm.value.exam,
        'status':this.editForm.value.status,
        'code':this.editForm.value.code,
      }
      this.examCategoryService.update(data).subscribe({
        next: (response) => {
          setTimeout(() => { this.modelLoading = false; }, 1600);
          if (response['code'] == '200') {
            swal.fire('Warning', 'Exam Category Update Successfully!', 'success');
            this.getExamCategory();
            if (this.dialogRef) this.dialogRef.close();
          }
          else{
            swal.fire('Warning', 'Something went wrong try again later !', 'warning');
          }
        },
        error: (e) => {
          swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
        }
      });
    }else{
     swal.fire('Warning', 'Please fill all required fields!', 'warning');
    }
  }
}
