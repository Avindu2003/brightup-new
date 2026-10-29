import { Component } from '@angular/core';
import { SubjectService } from './subject.service';
import { LocalDataSource } from 'angular2-smart-table';
import { NbWindowService } from '@nebular/theme';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { ExamCategoryService } from '../exam-category/exam-category.service';
import { StreamService } from '../stream/stream.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ngx-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent {
  orginalSubjectStream:any[];
  selectedExam : any;
  uploadForm: FormGroup;
  dialogRef: any;
  subjectList       : any[];
  addForm: FormGroup;
  formCheck : boolean = false;
  showStream: boolean = false;
  editForm: FormGroup;
  mappedStreamIds: any[] = []
  ExamCategoryList       : any[];
  SubjectStreamList : any[];
  showRelevantTo:boolean = false;
  streamList       : any[];
  subject : any;
  imageUrl              : any ;
  orginalimageUrl: any ;
  orginalSubject : any;
  loading: boolean = true;
  modelLoading: boolean = true;
  orginalSubjectList : any;
  isChanged : boolean = false;
  checkUpdate : boolean = false;
  InValidStream : boolean = false;
  isFileEmpty     : boolean = false;
  file: any;
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
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-loop"></i>',
      confirmDelete: true,
    },
    columns: {
      subject: {
        title: 'Subject',
        type: 'string',
      },
      exam: {
        title: 'Exam Category',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'string',
      },
      contentAvailable: {
        title: 'Content Available',
        type: 'boolean',
      },
      relevantTo: {
        title: 'Relevant To',
        type: 'string',
      },
    },
  };
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private fb: FormBuilder, 
    private examCategoryService: ExamCategoryService,
    private subjectService: SubjectService,
    private streamService: StreamService,
    private windowService: NbWindowService
  ) {
     this.uploadForm = this.fb.group({
      image: [''] 
    });
  }
  
  ngOnInit(){
    this.getStreamByStatus()
    this.getExamCategory();
    this.initForm();
    this.getSubject(); 
  }
  

  private initForm(){
  this.addForm = new FormGroup({
    'subject'        : new FormControl(null,Validators.required),
    'code'            : new FormControl(null,Validators.required),
    'examCategoryId'           : new FormControl(null,Validators.required),
    'status'        : new FormControl(null,Validators.required),
    'relevantTo'          : new FormControl(null),
    'stream': new FormControl([]), 
    'image': new FormControl(null,Validators.required),
  });

  this.editForm = new FormGroup({
      'subjectId'        : new FormControl(null,Validators.required),
      'subject'        : new FormControl(null,Validators.required),
      'code'     : new FormControl({value:null ,disabled: true},Validators.required),
      'examCategoryId'           : new FormControl(null,Validators.required),
      'status'        : new FormControl(null,Validators.required),
      'relevantTo'          : new FormControl(null),
      'contentAvailable': new FormControl(false), 
      'engAvailable': new FormControl(false),
      'sinAvailable': new FormControl(false),
      'tamAvailable': new FormControl(false),
      'image': new FormControl(null),
      'stream': new FormControl([]),
    });
  }
  getSubjectStream(code: any) {
    return this.subjectService.getSubjectStream(code).pipe(
      map((response: any) => {
        const streamList = response['streamList'] || response['responseData'] || [];
        this.orginalSubjectStream = streamList.map(x => Object.assign({}, x));
        // collect mapped stream IDs
        const mappedStreamIds = streamList
          .filter((s: any) => s.mapped)
          .map((s: any) => s.streamId);

        // return both
        return { streamList, mappedStreamIds };
      })
    );
  }

  onStreamToggle(event: any, streamId: number, formType: 'add' | 'edit') {
    const control = formType === 'add' ? this.addForm.get('stream') : this.editForm.get('stream');
    let selected = control?.value || [];

    if (event.checked) {
      selected.push(streamId);
    } else {
      selected = selected.filter((id: number) => id !== streamId);
    }

    control?.setValue(selected);
    control?.updateValueAndValidity();
    this.InValidStream = selected.length === 0;

    if (formType === 'edit') {
      this.SubjectStreamList = this.SubjectStreamList.map(s => ({
        ...s,
        mapped: selected.includes(s.streamId)
      }));
    }
    this.InValidStream = selected.length === 0;

    this.checkUpdateDisable();
  }

  checkUpdateDisable() {
    
    if (this.orginalSubjectStream.every(
    (value, index) =>
      value.mapped === this.SubjectStreamList[index].mapped &&
      value.streamId === this.SubjectStreamList[index].streamId
      )) {
      this.checkUpdate = false;
    } else {
      this.checkUpdate = true;
    }
  }
  onFiledChange(){
    const CurrntObjectValue = this.editForm.getRawValue();
    const normalizedListOrginal = {
      subjectId: this.orginalSubject.subjectId,
      subject: this.orginalSubject.subject,
      code: this.orginalSubject.code,
      examCategoryId: this.orginalSubject.examCategory.examCategoryId,
      status: this.orginalSubject.status,
      contentAvailable: this.orginalSubject.contentAvailable,
      engAvailable: this.orginalSubject.engAvailable,
      sinAvailable: this.orginalSubject.sinAvailable,
      tamAvailable: this.orginalSubject.tamAvailable,
      relevantTo: this.orginalSubject.relevantTo === "-" ? null : this.orginalSubject.relevantTo,
    };
    const normalizedListCurrnt = {
      subjectId: CurrntObjectValue.subjectId,
      subject: CurrntObjectValue.subject,
      code: CurrntObjectValue.code,
      examCategoryId: CurrntObjectValue.examCategoryId,
      status: CurrntObjectValue.status,
      contentAvailable: CurrntObjectValue.contentAvailable,
      engAvailable: CurrntObjectValue.engAvailable,
      sinAvailable: CurrntObjectValue.sinAvailable,
      tamAvailable: CurrntObjectValue.tamAvailable,
      relevantTo: CurrntObjectValue.relevantTo === "-" ? null : CurrntObjectValue.relevantTo,
    }
    if(JSON.stringify(normalizedListOrginal) === JSON.stringify(normalizedListCurrnt)) {
      this.checkUpdate = false;
    } else{
      this.checkUpdate = true;
    }
  }
  getExamCategory(){
    this.examCategoryService.getExamCategory()
    .subscribe((response)=>{
      this.ExamCategoryList = response['responseData']
    })
  }
  getStreamByStatus(){
    this.streamService.getStreamByStatus()
    .subscribe((response)=>{
      this.streamList = response['responseData']
    })
  }
  streamValidator(min: number) {
    return (control: FormControl) => {
      const value = control.value || [];
      return value.length >= min ? null : { InValidStream : true };
    };
  }

  examChanges() {
    let relevantControl: FormControl;
    let streamControl: FormControl;
    //Form Check
    if (!this.formCheck) {
      //Add Form
      this.selectedExam = this.ExamCategoryList.find(
        ec => ec.examCategoryId == this.addForm.get('examCategoryId')?.value
      );
      relevantControl = this.addForm.get('relevantTo') as FormControl;
      streamControl = this.addForm.get('stream') as FormControl;
    } else {
      //Edit Form
      this.selectedExam = this.ExamCategoryList.find(
        ec => ec.examCategoryId == this.editForm.get('examCategoryId')?.value
      );
      relevantControl = this.editForm.get('relevantTo') as FormControl;
      streamControl = this.editForm.get('stream') as FormControl;
    }

    const examCode = this.selectedExam?.code;

    if (examCode === 'BIT') {
      this.showRelevantTo = true;
      this.showStream = false;
      this.checkUpdate = false;
      relevantControl.setValidators([Validators.required]);
      relevantControl.updateValueAndValidity();

      if (this.formCheck && this.subject?.examCategory?.examCategoryId === this.selectedExam.examCategoryId) {
        relevantControl.setValue(this.subject?.relevantTo || null);
      } else if (!this.formCheck) {
        relevantControl.setValue(null); 
      }
      
        streamControl.setValue([]);
        streamControl.clearValidators();
        streamControl.updateValueAndValidity();

    } else if (examCode === 'AL') {
      this.showStream = true;
      this.showRelevantTo = false;
      this.checkUpdate = false;
      streamControl.setValidators([this.streamValidator(1)]);
      streamControl.updateValueAndValidity();

      if (this.formCheck && this.subject?.examCategory?.examCategoryId === this.selectedExam.examCategoryId) {
        streamControl.setValue(this.mappedStreamIds || []);
      } else if (!this.formCheck) {
        streamControl.setValue([]); 
      }

      relevantControl.setValue(null);
      relevantControl.clearValidators();
      relevantControl.updateValueAndValidity();

    } else {
      this.showRelevantTo = false;
      this.showStream = false;

      streamControl.setValue([]);
      streamControl.clearValidators();
      streamControl.updateValueAndValidity();

      relevantControl.setValue(null);
      relevantControl.clearValidators();
      relevantControl.updateValueAndValidity();
    }
  }



  getSubject() {
    this.loading = true;
    this.subjectService.getSubject().subscribe((response) => {
      this.subjectList = response['responseData'];
      this.orginalSubjectList = this.subjectList.map(x => Object.assign({}, x));
      this.loading = false;

      //Storing Data In A Table

      this.source.load(this.subjectList.map(item => ({
        examCategory: item.examCategory,
        subjectId: item.subjectId,
        subject: item.subject,
        code: item.code,
        exam: item.examCategory.exam,
        status: item.status,
        relevantTo: item.relevantTo === null ? '-' : item.relevantTo,
        contentAvailable: item.contentAvailable,
        engAvailable: item.engQuestionsAvailable,
        sinAvailable: item.sinQuestionsAvailable,
        tamAvailable: item.tamQuestionsAvailable,
        image:item.imgUrl
      })));
    });
  }
  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'subject', search: query },
        { field: 'exam', search: query },
        { field: 'status', search: query },
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
      title: isEdit ? 'Edit Subject' : 'Add New Subject',
      windowClass: 'custom-width-modal', 
    };
    this.modelLoading = true;
    this.dialogRef = this.windowService.open(contentTemplate, config);
    if (!isEdit) {
      this.dialogRef.onClose.subscribe(() => {
        this.addForm.reset();
        this.InValidStream=false;
        this.showStream=false;
        this.showRelevantTo=false;
      }
    );
    }else{
      this.dialogRef.onClose.subscribe(() => {
        this.InValidStream = false;
        this.showStream = false;
        this.showRelevantTo = false;
        this.imageUrl = null;
        this.file = null;
        this.orginalSubjectStream = [];
        this.checkUpdate = false;
        this.formCheck = false;
        }
      )
    }
    this.modelLoading = false;
  }

  onFileSelected(event: Event, isEdit: boolean = false) {
    this.checkUpdate = false;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        swal.fire('Warning', 'Only JPG, JPEG, or PNG files are allowed.', 'warning');
        if (isEdit) {
          this.editForm.get('image')?.setValue(null);
        } else {
          this.addForm.get('image')?.setValue(null);
        }
        input.value = '';
        this.imageUrl = null;
        return;
      }

      this.file = file;
      if (isEdit) {
        this.editForm.get('image')?.setValue(file);
        if(file!==null){
          this.checkUpdate = true;
        }
          
      } else {
        this.addForm.get('image')?.setValue(file);
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  create(){
    this.addForm.markAllAsTouched();

    if (this.showStream && (this.addForm.get('stream')?.value?.length === 0)) {
      this.InValidStream = true;
      return; 
    }
    this.formCheck = false;
    this.InValidStream = false;
    if (this.addForm.invalid) return;
    let selectedExamId = this.addForm.get('examCategoryId')?.value;
    this.modelLoading = true;
    if(this.addForm.valid){
      let data = {
        "code"                : this.addForm.get('code').value,
        "subject"             : this.addForm.get('subject').value,
        "status"              : this.addForm.get('status').value,
        "examCategory" :{
          "examCategoryId": selectedExamId
        },
        "relevantTo"                : this.addForm.get('relevantTo').value || '',
        "mappedStreamList": this.addForm.get('stream').value || [],  
        
      };
      const formData: FormData = new FormData();
      formData.append('data', JSON.stringify(data));
      formData.append('image',this.file);

      this.subjectService.create(formData).subscribe({
        next: (response) => {
          setTimeout(() => { this.modelLoading = false; }, 1600);
          if (response['code'] == '200') {
            swal.fire('Success', 'Subject Created Successfully!', 'success');

            this.getSubject();
            this.addForm.reset();
            this.file = null;
            if (this.dialogRef) this.dialogRef.close();
          } else if (response['code'] == '400'){
            swal.fire('Warning', 'Failed!', 'warning');
          }else if(response['code'] == '416') {
            swal.fire('Warning', 'Subject id duplicate', 'warning');
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

  edit(event: any,editModal) {
    this.formCheck = true;
    this.subject = event.data;  
    this.getSubjectStream(this.subject.code).subscribe(
    ({ streamList, mappedStreamIds }) => {
    this.SubjectStreamList = streamList;
    this.modelLoading = true;
    this.mappedStreamIds = mappedStreamIds;
    this.editForm.patchValue({
      subjectId: this.subject.subjectId,
      subject: this.subject.subject,
      code: this.subject.code,
      examCategoryId: this.subject.examCategory?.examCategoryId || null,
      status: this.subject.status,
      relevantTo: this.subject.relevantTo,
      contentAvailable: this.subject.contentAvailable ?? false,
      engAvailable: this.subject.engAvailable ?? false,
      sinAvailable: this.subject.sinAvailable ?? false,
      tamAvailable: this.subject.tamAvailable ?? false,
      stream: mappedStreamIds
    });
    this.imageUrl = this.subject.image || null;
    this.orginalimageUrl= this.subject.image || null;
    this.examChanges()
    this.orginalSubject = Object.assign({}, this.subject);
    this.isChanged = false;
    this.examChanges();
    this.openWindowForm(editModal, true);
    },
    );
    this.modelLoading = false;
  }
  
  update() {
    this.editForm.markAllAsTouched();
    
    if (this.showStream && (this.editForm.get('stream')?.value?.length === 0)) {
      this.InValidStream = true;
      return;
    }
    this.InValidStream = false;
    const selectedExamId = this.editForm.get('examCategoryId')?.value;
    const examCode = this.selectedExam?.code;
    if(this.editForm.valid){

      if (examCode === 'BIT') {
        this.SubjectStreamList = this.SubjectStreamList.map(s => ({
          ...s,
          mapped: false
        }));
        this.editForm.get('stream')?.setValue([]);
      }
      const streamListPayload = this.SubjectStreamList.map(s => ({
        streamId: s.streamId,
        mapped: s.mapped
      }));
      const data ={
        subjectId: this.editForm.get('subjectId')?.value,
        subject: this.editForm.get('subject')?.value,
        status: this.editForm.get('status')?.value,
        examCategory: {
          examCategoryId: selectedExamId,
        },
        relevantTo: this.editForm.get('relevantTo')?.value || null,
        contentAvailable: this.editForm.get('contentAvailable')?.value ?? false,
        engQuestionsAvailable: this.editForm.get('engAvailable')?.value ?? false,
        sinQuestionsAvailable: this.editForm.get('sinAvailable')?.value ?? false,
        tamQuestionsAvailable: this.editForm.get('tamAvailable')?.value ?? false,
        streamList: streamListPayload || []
      }
      const formData: FormData = new FormData();
      formData.append('data', JSON.stringify(data));
      this.modelLoading = true;
      formData.append('image', this.file || "null");
      this.subjectService.update(formData).subscribe({
        next: (response) => {
          setTimeout(() => { this.modelLoading = false; }, 1600);
          if (response['code'] == '200') {
            swal.fire('Success', 'Subject Updated Successfully!', 'success');
            this.getExamCategory();
            if (this.dialogRef) this.dialogRef.close();
             this.modelLoading = false;
             this.getSubject();
          }
          else{
            swal.fire('Warning', 'Something went wrong try again later !', 'warning');
            this.modelLoading = false
          }
        },
        error: (e) => {
          swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
          this.modelLoading = false
        }
      });
    }else{
     swal.fire('Warning', 'Please fill all required fields!', 'warning');
     this.modelLoading = false
    }
  }
}