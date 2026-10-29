import { Component } from '@angular/core';
import { SecurityQuestionService } from './security-question.service';
import { LocalDataSource } from 'angular2-smart-table';
import { NbWindowService } from '@nebular/theme';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'ngx-security-question',
  templateUrl: './security-question.component.html',
  styleUrls: ['./security-question.component.scss']
})

export class SecurityQuestionComponent {

  SecurityQuestion: any;
  SecurityQuestionList: any[];
  addForm: FormGroup;
  editForm: FormGroup;
  dialogRef: any;
  errorMessage: any;
  loading: boolean = false;
  modelLoading: boolean = false;
  isChanged: boolean = false;
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
        type: 'string'
      },
      question: {
        title: 'Question',
        type: 'string'
      },
      status: {
        title: 'Status',
        type: 'string',
        valuePrepareFunction: (value) => {
          return value === 'A' ? 'Active' : 'Inactive';
        }
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  

  constructor(
    private securityQuestionService: SecurityQuestionService,
    private windowService: NbWindowService
  ) {
  }

  ngOnInit() {
    this.getSecurityQuestion();
    this.initForm();
    this.addForm.valueChanges.subscribe(() => {
      this.errorMessage=null;
    });
      
  }
  private initForm() {
    this.addForm = new FormGroup({
      'code': new FormControl('', [Validators.required]),
      'question': new FormControl('', [Validators.required]),
      'status': new FormControl('', [Validators.required])
    });

    this.editForm = new FormGroup({
      'securityQuestionId': new FormControl(''),
      'code': new FormControl('', [Validators.required]),
      'question': new FormControl('', [Validators.required]),
      'status': new FormControl('', [Validators.required]),
    });
  }

  create() {
    this.addForm.markAllAsTouched();
    this.errorMessage=null;
    if (this.addForm.valid) {
      let data = {
        "code": this.addForm.get('code').value,
        "question": this.addForm.get('question').value,
        "status": this.addForm.get('status').value
      }

      this.modelLoading= true;
      this.securityQuestionService.create(data).subscribe({
        next: (response:any) => {
          if (response['code'] === 200) {
            swal.fire('Success', 'Security Question Created Successfully!', 'success');
            this.addForm.reset();
            this.getSecurityQuestion();
            this.dialogRef.close();
            this.modelLoading= false;
            
          } else if (response['code'] === 400) {
            swal.fire('Failed!', '', 'warning');
            this.modelLoading= false;

          } else if (response['code'] === 416) {
            this.errorMessage = response['message'];
            this.modelLoading= false;
          }
           else {
            swal.fire('Failed!', 'Something went wrong try again later', 'warning');
            this.modelLoading= false;
          } 
        },
        error: (e) => {
          swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
          this.modelLoading= false;
        },
      });
    }
  }

  getSecurityQuestion() {
    this.loading = true;
    this.securityQuestionService.getSecurityQuestion()
    .subscribe((response) => {
        this.SecurityQuestionList = response['responseData'];
        const tableData = this.SecurityQuestionList.map(SecurityQuestion => ({
        }));

        this.source.load(this.SecurityQuestionList.map(item => ({
          securityQuestionId: item.securityQuestionId,
          code: item.code,
          question: item.question,
          status: item.status,
        })));
         this.loading = false;
    });
  }

  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    } else {
      this.source.setFilter([
        { field: 'code', search: query },
        { field: 'question', search: query },
      ], false);
    }

  }

  openWindowForm(contentTemplate: any, isEdit: boolean = false) {
    this.errorMessage=null;
    this.addForm.reset();
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title: isEdit ? 'Edit Security Question' : 'Add New Security Question'
    };

    this.dialogRef = this.windowService.open(contentTemplate, config);
  }

  onFieldChange() {
    let question = this.editForm.get('question')?.value;
    let status = this.editForm.get('status')?.value;
    this.isChanged = (question !== this.SecurityQuestion.question) || (status !== this.SecurityQuestion.status);
  }

  edit(event: any, contentTemplate: any) {
  this.SecurityQuestion = event.data;
  this.editForm.patchValue({
    code: this.SecurityQuestion.code,
    question: this.SecurityQuestion.question,
    status: this.SecurityQuestion.status,
    securityQuestionId: this.SecurityQuestion.securityQuestionId,
  });
   this.editForm.get('code')?.disable();
  let config: any = {
    hasBackdrop: true,
    closeOnEsc: false,
    title: 'Edit Security Question'
  };

  this.modelLoading= true;
  this.dialogRef = this.windowService.open(contentTemplate, config);
  this.isChanged = false;
  this.modelLoading= false;
}

  update() {
    if (this.editForm.valid) {
      const data = {
        'securityQuestionId': this.SecurityQuestion.securityQuestionId,
        'code': this.editForm.getRawValue().code,
        'question': this.editForm.getRawValue().question,
        'status': this.editForm.getRawValue().status,
      }

      this.modelLoading= true;
      this.securityQuestionService.update(data).subscribe({
        next: (response:any) => {
          if (response['code'] === 200) {
            swal.fire('Success', 'Security Question Updated Successfully!', 'success');
            this.getSecurityQuestion();
            this.addForm.reset();
            this.dialogRef.close();
            this.modelLoading= false;
          }
          else {
            swal.fire('Warning', 'Something went wrong try again later !', 'warning');
            this.modelLoading= false;
          }
          this.modelLoading= false;

          
        },
        error: (e) => {
          this.modelLoading= false;
          swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
        }
      });
    } else {
      swal.fire('Warning', 'Please fill all required fields!', 'warning');
    }
  }



}
