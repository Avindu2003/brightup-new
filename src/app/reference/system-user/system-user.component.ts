import { Component } from '@angular/core';
import { SystemUserService } from './system-user.service';
import { LocalDataSource } from 'angular2-smart-table';
import { NbWindowService } from '@nebular/theme';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert2';


@Component({
  selector: 'ngx-system-user',
  templateUrl: './system-user.component.html',
  styleUrls: ['./system-user.component.scss']
})
export class SystemUserComponent {

  systemUser: any;
  systemUserList: any[];
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
      name: {
        title: 'Name',
        type: 'string'
      },
      userName: {
        title: 'Username',
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
    private systemUserService: SystemUserService,
    private windowService: NbWindowService
  ) { }

  ngOnInit() {
    this.getSystemUser();
    this.initForm();
    this.addForm.valueChanges.subscribe(() => {
      this.errorMessage=null;
    });
  }

  private initForm() {
    this.addForm = new FormGroup({
      'name': new FormControl('', [Validators.required]),
      'userName': new FormControl('', [Validators.required]),
      'status': new FormControl('', [Validators.required])
    });

    this.editForm = new FormGroup({
      'systemUserId': new FormControl(''),
      'name': new FormControl('', [Validators.required]),
      'userName': new FormControl('', [Validators.required]),
      'status': new FormControl('', [Validators.required]),
      'resetPassword' : new FormControl(false)
    });
  }

  create() {
    this.addForm.markAllAsTouched();
    this.errorMessage=null;
    if (this.addForm.valid) {
      let data = {
        "name": this.addForm.get('name').value,
        "userName": this.addForm.get('userName').value,
        "status": this.addForm.get('status').value
      }

      this.modelLoading= true;
      this.systemUserService.create(data).subscribe({
        next: (response:any) => {
          if (response['code'] === 200) {
            swal.fire('Success', 'System User Created Successfully!', 'success');
            this.addForm.reset();
            this.getSystemUser();
            this.dialogRef.close();
            this.modelLoading= false;
          } else if (response['code'] === 400) {
            swal.fire('Failed!', '', 'warning');
            this.modelLoading= false;
          } else if (response['code'] === 416) {
            this.errorMessage = response['message'];
            this.modelLoading= false;
          }else {
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

  getSystemUser() {
    this.loading = true;
    this.systemUserService.getSystemUser()
    .subscribe((response) => {
        this.systemUserList = response['responseData'];

        this.source.load(this.systemUserList.map(item => ({
          systemUserId: item.systemUserId,
          name: item.name,
          userName: item.userName,
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
        { field: 'name', search: query },
        { field: 'userName', search: query },
      ], false);
    }
  }

  openWindowForm(contentTemplate: any, isEdit: boolean = false) {
    this.errorMessage=null;
    this.addForm.reset();
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title: isEdit ? 'Edit System User' : 'Add New System User'
    };

    this.dialogRef = this.windowService.open(contentTemplate, config);
  }

  onFieldChange() {
    let name = this.editForm.get('name')?.value;
    let status = this.editForm.get('status')?.value;
    let resetPassword = this.editForm.get('resetPassword')?.value;
    this.isChanged = (name !== this.systemUser.name) || (status !== this.systemUser.status) || (resetPassword === true);
  }

  edit(event: any, contentTemplate: any) {
  this.systemUser = event.data;
  this.editForm.patchValue({
    name: this.systemUser.name,
    userName: this.systemUser.userName,
    status: this.systemUser.status,
    systemUserId: this.systemUser.systemUserId,
    resetPassword: false
  });
   this.editForm.get('userName')?.disable();
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title: 'Edit System User'
    };

  this.modelLoading= true;
  this.dialogRef = this.windowService.open(contentTemplate, config);
  this.isChanged = false;
  this.modelLoading= false;
}

  update() {
    if (this.editForm.valid) {
      const data = {
        'systemUserId': this.systemUser.systemUserId,
        'name': this.editForm.getRawValue().name,
        'userName': this.editForm.getRawValue().userName,
        'status': this.editForm.getRawValue().status,
        'resetPassword' : this.editForm.getRawValue().resetPassword
      }

      this.modelLoading= true;
      this.systemUserService.update(data).subscribe({
        next: (response:any) => {
          if (response['code'] === 200) {
            swal.fire('Success', 'System User Updated Successfully!', 'success');
            this.getSystemUser();
            this.addForm.reset();
            this.dialogRef.close();
            this.modelLoading= false;
          } else {
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