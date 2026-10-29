import { Component } from '@angular/core';
import { LocalDataSource } from 'angular2-smart-table';
import swal from 'sweetalert2';
import { NbWindowService } from '@nebular/theme';
import { PackageActivationService } from './package-activation.service';
import { SubscriptionPackageService } from '../subscription-package/subscription-package.service';
import { FormControl, FormGroup } from '@angular/forms';
@Component({
  selector: 'ngx-package-activation',
  templateUrl: './package-activation.component.html',
  styleUrls: ['./package-activation.component.scss']
})
export class PackageActivationComponent {
  loading: boolean = true;
  user : any;
  checkSubmit : boolean = false;
  userList       : any[];
  dialogRef: any;
  modelLoading: boolean = true;
  form: FormGroup;
  SubscriptionPackageList : any [];
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
        type: 'string',
      },
      mobileNo: {
        title: 'Mobile Number',
        type: 'number',
      },
      gradeCategory: {
        title: 'Grade Category',
        type: 'string',
      },
      nic: {
        title: 'NIC',
        type: 'number',
      },
    },
  };
  source: LocalDataSource = new LocalDataSource();

  constructor(
    private packageActivationService: PackageActivationService,
    private subscriptionPackageService: SubscriptionPackageService,
    private windowService: NbWindowService,
  ) {
  }
  
  ngOnInit(){
    this.getUser();
    this.initForm();
    this.getSubscriptionPackage();
  }
  private initForm(){
  this.form = new FormGroup({
      'userId'        : new FormControl(null),
      'name'        : new FormControl({value:null ,disabled: true}),
      'mobileNo'        : new FormControl({value:null ,disabled: true}),
      'subscriptionPackageId'        : new FormControl(null),
    });
  }

  getUser(){
    this.loading = true;
    this.packageActivationService.getUser()
    .subscribe((response)=>{
      this.userList = response['responseData'];
      this.loading = false;
      const tableData = this.userList.map(user => ({
      
      name: user.name,
      userId: user.userId,
      gradeCategory: user.gradeCategory,
      mobileNo: user.mobileNo,
      nic: user.nic === null ? "-" : user.nic
    }));

      this.source.load(tableData);
    })
  }
  getSubscriptionPackage(){
    this.subscriptionPackageService.getSubscriptionPackage()
    .subscribe((response)=>{
      this.SubscriptionPackageList = response['responseData']
    })
  }
  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'name', search: query },
        { field: 'mobileNo', search: query },
      ], false);
    }
  }
  onFieldChange(){
    this.checkSubmit = true;
  }
  openWindowForm(contentTemplate:any) {
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title:  'Package Activation',
      windowClass: 'custom-width-modal', 
    };
    this.modelLoading = true;
    this.dialogRef = this.windowService.open(contentTemplate, config);
      this.dialogRef.onClose.subscribe(() => {
        this.checkSubmit = false;
        this.form.reset();
      }
    )
    this.modelLoading = false;
  }
  edit(event: any,modal){
    this.user = event.data;
    this.form.patchValue({
      userId: this.user.userId,
      name: this.user.name,
      mobileNo: this.user.mobileNo,
    });
    this.openWindowForm(modal);
  }
submit() {
  if (!this.form.valid) {
    swal.fire('Warning', 'Form is invalid. Please check inputs.', 'warning');
    return;
  }
  const selectedPackageId =this.form.get('subscriptionPackageId')?.value;
  const selectedPackage = this.SubscriptionPackageList.find(
    pkg => pkg.subscriptionPackageId === selectedPackageId
  );
  const data = {
    userId:this.form.get('userId')?.value,
    subscriptionPackageId:selectedPackageId,
    mobileNo:this.form.get("mobileNo").value
  };
  console.log('Selected package:', selectedPackage?.name);
  console.log(selectedPackageId );
  swal.fire({
    title: "Warning!",
    text: "Are you sure to activate '" + selectedPackage?.name +"' package?" ,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes"
  }).then((result) => {
    if (result.isConfirmed) {
      console.log(data)
      this.packageActivationService.submit(data).subscribe({
        next: (response) => {
          if (response['code'] == 200) {
            swal.fire('Success', 'Package Activation Successfully!.', 'success');
            this.getUser();
            if (this.dialogRef) {
              this.dialogRef.close();
            }
          } else {
            swal.fire('Warning', 'Something went wrong, try again later!', 'warning');
          }
        },
        error: () => {
          swal.fire('Error', 'Something bad happened please try again later. !', 'error');
        }
      });
    }
  });
}

  // submit(){
  //   if(this.form.valid){
  //     const data ={
  //       name: this.form.get('name')?.value,
  //       mobileNo: this.form.get('mobileNo')?.value,
  //       subscription: {
  //         subscriptionPackageId: this.form.get('subscriptionPackageId')?.value,
  //       },
  //     }
  //       this.packageActivationService.submit(data).subscribe({
  //         next: (response) => {
  //           setTimeout(() => { this.modelLoading = false; }, 1600);
  //           if (response['code'] == '200') {
  //             swal.fire('Success', 'Package Activation Successfully!', 'success');
  //             if (this.dialogRef) this.dialogRef.close();
  //              this.modelLoading = false;
  //              this.getUser();
  //           }
  //           else{
  //             swal.fire('Warning', 'Something went wrong try again later !', 'warning');
  //             this.modelLoading = false
  //           }
  //         },
  //         error: (e) => {
  //           swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
  //           this.modelLoading = false
  //         }
  //       });
  //   }  
  // }
}




