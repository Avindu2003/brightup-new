import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators,FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PushNotificationsService } from './push-notifications.service';
import { LocalDataSource } from 'angular2-smart-table';
import { NbWindowService } from '@nebular/theme';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../../@core/data/users';
@Component({
  selector: 'push-notification',
  templateUrl: './push-notifications.component.html',
  styleUrls: ['./push-notifications.component.scss'],
})
export class PushNotificationsComponent  {
  UseList: User[];
  imageUrl              : any ;
  file: any;
  allResponseData: any[] = [];
  selectedExam : any;
  streamList: any[] = [];
  semesterList: any[] = [];
  subjectList: any[] = [];
  mediumList: any[] = [];
  showRelevantTo:boolean = false;
  showStream: boolean = false;
  selectedExamData: any;
  subject : any;
  pushNotificationsList : any [];
  examCategoryList : any [];
  availableUsers: User[] = [];
  selectedUsers: User[] = [];
  myControl = new FormControl<string | User>(''); 
  uploadForm: FormGroup;
  filteredOptions: Observable<User[]>; 
  dialogRef: any;
  addForm: FormGroup;
  loading: boolean = false;
  modelLoading: boolean = false;
  settings = {
    attr: {
      class: 'table table-bordered', 
    },
    actions: {
      add: false,
      edit: false,
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
      // ios: {
      //   title: 'IOS',
      //   type: 'string',
      // },
      // android: {
      //   title: 'Android',
      //   type: 'string',
      // },
      title: {
        title: 'Title',
        type: 'string',
      },
      message: {
        title: 'Message',
        type: 'string',
      },
      url: {
        title: 'URL',
        type: 'string',
      },
      date: {
        title: 'Date',
        type: 'string',
      },
    },
  };
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private fb: FormBuilder, 
    private pushNotificationsService: PushNotificationsService,
    private windowService: NbWindowService
  ) {
     this.uploadForm = this.fb.group({
      image: [''] 
    });
  }
  
  ngOnInit(){
    this.initForm();
    this.getUser();
    this.getPushNotification();
    this.getSubjectWithExamCategory();
  }
    private initForm(){
    this.addForm = new FormGroup({
      'title'          : new FormControl(null, Validators.required),

      'type'        : new FormControl('G'),
      'group'            : new FormControl(true),
      'student'           : new FormControl(null),
      'bulk'        : new FormControl(false),
      'mobileNo'          : new FormControl(null),


      'subject'          : new FormControl(null),
      'semester'          : new FormControl(null),
      'stream'          : new FormControl(null),
      'medium'          : new FormControl(null),
      'examCategory'          : new FormControl(null),

      'message': new FormControl(null, Validators.required),
      'image': new FormControl(null),
    });
  }

  private _filter(searchTerm: string): User[] {
    if (!this.UseList) return [];

    const filterValue = searchTerm.toLowerCase();

    return this.UseList.filter((user: any) => {
      const nameMatch = user.name?.toLowerCase().includes(filterValue);
      const mobileMatch = user.mobileNo?.toLowerCase().includes(filterValue);

      const notSelected = !this.selectedUsers.some(
        s => s.mobileNo === user.mobileNo
      );

      return (nameMatch || mobileMatch) && notSelected;
    });
  }

  openWindowForm(contentTemplate:any) {
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title:  'Add Push Notification'
    };
    this.modelLoading = true;
    this.dialogRef = this.windowService.open(contentTemplate, config);
    this.modelLoading = false;
    this.dialogRef.onClose.subscribe(() => {
       this.resetFormToDefaults();
      }
    );
  }
  getPushNotification() {
    this.loading = true;
    this.pushNotificationsService.getPushNotification().subscribe((response) => {
      this.pushNotificationsList = response['responseData'];
      this.loading = false;

      //Storing Data In A Table

      this.source.load(this.pushNotificationsList.map(item => ({
        title: item.title,
        message: item.message,
        url: item.imgUrl,
        date: item.date,
        // image: item.image,
        // exam: item.examCategory.exam,
        // status: item.status,
        // relevantTo: item.relevantTo === null ? '-' : item.relevantTo,
        // contentAvailable: item.contentAvailable,
        // engAvailable: item.engQuestionsAvailable,
        // sinAvailable: item.sinQuestionsAvailable,
        // tamAvailable: item.tamQuestionsAvailable,
        image:item.imgUrl
      })));
    });
  }
  getUser() {
    this.pushNotificationsService.getUser().subscribe(
      (response: any) => {
        this.UseList = response?.responseData || []; 
        this.availableUsers = [...this.UseList];
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const searchTerm = typeof value === 'string' ? value : value?.name;
            return searchTerm ? this._filter(searchTerm) : this.UseList?.slice();
          }),
        );
      },
      (error) => {
        console.error("Error fetching user list:", error);
        this.UseList = []; 
        this.availableUsers = [];
          this.filteredOptions = this.myControl.valueChanges.pipe(
            startWith(''),
            map(value => []) 
          );
      }
    );
  }

  getSubjectWithExamCategory() {
    this.pushNotificationsService.getSubjectWithExamCategory().subscribe((response)=>{
      this.allResponseData = response['responseData'] || [];
      this.mediumList = response['mediumList'],
      
      console.log(this.subjectList )
      console.log(this.mediumList )
      this.examCategoryList = this.allResponseData.map(item => item.examCategoryDto);
    })
  } 

  onChangeUserType(selectedType: string) {
    if (selectedType === 'group') {
      this.addForm.patchValue({
        type: 'G',
        group: true,
        bulk: false
      });
      this.addForm.patchValue({
        examCategory: null,
        stream: null,
        semester: null,
        subject: null,
        medium: null
      });
      this.showStream = false;
      this.showRelevantTo = false;
      this.streamList = [];
      this.semesterList = [];
      this.subjectList = [];
      this.selectedExamData = null;

    } else if (selectedType === 'bulk') {
      this.addForm.patchValue({
        type: 'B',
        group: false,
        bulk: true
      });

      this.selectedUsers = []; 
      if (this.UseList) {
        this.availableUsers = [...this.UseList];
      }
    }
  }

  onUserSelected(event: any) {
    const value = event.target.value;
    const user = this.availableUsers.find(
      u => `${u.mobileNo} - ${u.name}` === value
    );

    if (!user) return;
    if (!this.selectedUsers.some(u => u.mobileNo === user.mobileNo)) {
      this.selectedUsers.push(user);
      this.availableUsers = this.availableUsers.filter(u => u.mobileNo !== user.mobileNo);
    }

    event.target.value = '';
    this.myControl.setValue('');
  }

  removeUser(mobileNo: string) {
    const user = this.selectedUsers.find(u => u.mobileNo === mobileNo);
    if (!user) return;

    this.availableUsers.push(user);
    this.availableUsers.sort((a, b) => {
    const nameA = a.name ? a.name.toLowerCase() : '';
    const nameB = b.name ? b.name.toLowerCase() : '';
    return nameA.localeCompare(nameB);
  });

    this.selectedUsers = this.selectedUsers.filter(u => u.mobileNo !== mobileNo);
  }


  examChanges(event: any) {

    this.addForm.patchValue({ stream: null, semester: null, subject: null });
    this.streamList = [];
    this.semesterList = [];
    this.subjectList = [];

    const selectedExamId = this.addForm.get('examCategory')?.value;

    this.selectedExamData = this.allResponseData.find(
      x => x.examCategoryDto.examCategoryId == selectedExamId
    );

    if (!this.selectedExamData) return;

    const code = this.selectedExamData.examCategoryDto.code;

    if (code === 'BIT') {
      this.showRelevantTo = true; 
      this.showStream = false;    

      this.semesterList = this.selectedExamData.streamSubjectList.map(item => ({
        ...item,
        nameSinhala: item.description 
      }));

    }else if(code === 'AL'){
      this.showStream = true;   
      this.showRelevantTo = false; 

      this.streamList = this.selectedExamData.streamSubjectList.map(item => ({
        ...item,
        nameSinhala: item.description
      }));
    }
      else {
      this.showStream = false;   
      this.showRelevantTo = false; 

      this.streamList = this.selectedExamData.streamSubjectList.map(item => ({
        ...item,
        nameSinhala: item.description
      }));
        if (this.streamList.length > 0) {
        const olStream = this.streamList[0];
        this.addForm.get('stream')?.setValue(olStream.streamId);
        this.subjectList = olStream.subjects || [];
      }
    }
  }
  streamChanges(event: any) {
    const selectedStreamId = this.addForm.get('stream')?.value;

    if (!this.selectedExamData || !this.selectedExamData.streamSubjectList) {
      this.subjectList = [];
      return;
    }

    const selectedStream = this.selectedExamData.streamSubjectList.find(
      (item: any) => item.streamId == selectedStreamId
    );

    if (selectedStream) {
      this.subjectList = selectedStream.subjects || [];
    } else {
      this.subjectList = [];
    }

    this.addForm.get('subject')?.setValue(null);
  }

  semesterChanges(event: any) {
    const selectedCode = this.addForm.get('semester')?.value;
    if (!this.selectedExamData || !this.selectedExamData.streamSubjectList) {
      this.subjectList = [];
      return;
    }

    const selectedSemester = this.selectedExamData.streamSubjectList.find(
      (item: any) => item.code === selectedCode
    );

    if (selectedSemester) {
      this.subjectList = selectedSemester.subjects || [];
    } else {
      this.subjectList = [];
    }
    this.addForm.get('subject')?.setValue(null);
  }
  onFileSelected(event: Event, isEdit: boolean = false) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(file.type)) {
        Swal.fire('Warning', 'Only JPG, JPEG, or PNG files are allowed.', 'warning');
          this.addForm.get('image')?.setValue(null);

        input.value = '';
        this.imageUrl = null;
        return;
      }

      this.file = file;
      // this.addForm.get('image')?.setValue(file);
      console.log(file)
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSearch(query: string = '') {
    console.log("hi")
    if (query.trim() === '') {
      this.source.setFilter([], true);
    } else {
      this.source.setFilter([
        { field: 'message', search: query },  
      ], false); 
    }
  }
  resetFormToDefaults() {
    this.addForm.reset();
    this.addForm.patchValue({
      type: 'G',
      group: true,
      bulk: false,
      title: null,
      message: null
    });
    this.selectedUsers = [];
    this.imageUrl = null;
    this.file = null;
    this.showStream = false;
    this.showRelevantTo = false;
    this.myControl.setValue('');
  }
  create() {

    this.addForm.markAllAsTouched();
    if (this.addForm.invalid) {
      return;
    }
    if (this.addForm.value.type === 'G' && this.selectedUsers.length === 0) {
      return;
    }

    this.modelLoading = true;

    let data: any = {
      message: this.addForm.value.message,
      bulk: this.addForm.value.type === 'B',
      notificationType:"PUS",
      title: this.addForm.value.title,
    };
    
    if (this.addForm.value.type === 'G') {
      data.studentIdList = this.selectedUsers.map(user => user.userId);

    } else {
      const selectedCategory = this.examCategoryList.find(
        c => c.examCategoryId == this.addForm.value.examCategory
      );
      data.studentIdList = [] ,
      data.examCategory = selectedCategory ? selectedCategory.code : null;
      data.medium = this.addForm.value.medium;
      // data.subjectId = this.addForm.value.subject;
      if (this.showStream) {
        data.streamId = this.addForm.value.stream;
      } else if (this.showRelevantTo) {
        data.streamId = 0;
        // data.semesterCode = this.addForm.value.semester; 
      }else{
        data.streamId = 0;
      }
    }
    const formData: FormData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (this.file != null) {
      formData.append('image',this.file);
    }
    console.log(data)
      this.pushNotificationsService.create(formData).subscribe({
        next: (response) => {
          setTimeout(() => { this.modelLoading = false; }, 1600);
          if (response['code'] == '200') {
            Swal.fire('Success', 'Push Notification Sent Successfully!', 'success');
            this.getPushNotification();
            if (this.dialogRef) this.dialogRef.close();
          } else if (response['code'] == '400'){
            Swal.fire('Warning', 'Failed!', 'warning');
          }
          else{
            Swal.fire('Warning', 'Something went wrong try again later', 'warning');
          }
        },
        error: (e) => {
          Swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
          this.modelLoading = false;
        }
      });
  }
}