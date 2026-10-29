import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbWindowRef, NbWindowService } from '@nebular/theme';
import { SubscriptionPackageService } from './subscription-package.service';
import { LocalDataSource } from 'angular2-smart-table';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-subscription-package',
  templateUrl: './subscription-package.component.html',
  styleUrls: ['./subscription-package.component.scss']
})
export class SubscriptionPackageComponent {

  subscriptionPackageForm: FormGroup;
  isChanged : boolean = false;
  subscriptionPackage: any;
  loading: boolean = true;
  modelLoading: boolean = true;
  SubscriptionPackageList : any[];
  source: LocalDataSource = new LocalDataSource();
  windowRef: NbWindowRef;
  errorMessage: any;

  settings = {
    attr: {
      class: 'table table-bordered', 
    },
    actions: {
      add: true,
      edit: true,
      delete:false,
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
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    
    columns: {
      code: {
        title: 'Code',
        type: 'string',
      },
      name: {
        title: 'Package Name',
        type: 'string',
      },
      activationPeriod: {
        title: 'Activation Period',
        type: 'string',
      },
      testCount: {
        title: 'Test Count',
        type: 'string',
      },
      // attemptCount: {
      //   title: 'AttemptCount',
      //   type: 'string',
      // },
      price: {
        title: 'Price',
        type: 'string',
      },
      // sequence: {
      //   title: 'Sequence',
      //   type: 'string',
      // },
      // primaryColor: {
      //   title: 'Primary Color',
      //   type: 'string',
      // },
      // secondaryColor: {
      //   title: 'Secondary Color',
      //   type: 'string',
      // },
      status: {
        title: 'Status',
        type: 'string',
      },
    },
  };

  constructor(
      private subscriptionPackageService: SubscriptionPackageService,
      private windowService: NbWindowService,
  
      private fb: FormBuilder)

    {
      this.subscriptionPackageForm = this.fb.group({
        subscriptionPackageId: [''],
        code: ['', [Validators.required,Validators.pattern(/^[A-Z]{3}$/)]],
        name: ['', Validators.required],
        activationPeriod: ['', [Validators.required,Validators.pattern(/^[0-9]{1,2}$/)]],
        testCount: ['', [Validators.required,Validators.pattern(/^[0-9]{1,6}$/)]],
        attemptCount: ['9999', [Validators.required,Validators.pattern(/^[0-9]{1,4}$/)]],
        sequence: ['', [Validators.required,Validators.pattern(/^[0-9]{1,5}$/)]],
        primaryColor: ['', [Validators.required,Validators.pattern(/^[0-9A-Fa-f]{6}$/)]],
        secondaryColor: ['', [Validators.required,Validators.pattern(/^[0-9A-Fa-f]{6}$/)]],
        price: ['', [Validators.required,Validators.pattern(/^[0-9]{1,6}$/)]],
        status: ['', Validators.required],
      });
    }

  ngOnInit(){
    this.getPayment();

    this.subscriptionPackageForm.valueChanges.subscribe(value => {
      this.isChanged =
        // value.code !== this.SubscriptionPackage.code ||
        value.name !== this.subscriptionPackage.name ||
        value.activationPeriod != this.subscriptionPackage.activationPeriod ||
        value.testCount != this.subscriptionPackage.testCount ||
        value.attemptCount != this.subscriptionPackage.attemptCount ||
        value.price != this.subscriptionPackage.price ||
        value.sequence != this.subscriptionPackage.sequence ||
        value.primaryColor !== this.subscriptionPackage.primaryColor ||
        value.secondaryColor !== this.subscriptionPackage.secondaryColor ||
        value.status !== this.subscriptionPackage.status;
    });

  this.subscriptionPackageForm.get('code')?.valueChanges.subscribe(() => {});

  }

  getPayment(){
    this.loading = true;

    this.subscriptionPackageService.getPayment().subscribe((response)=>{
      this.SubscriptionPackageList = response['responseData']

      const tableData = this.SubscriptionPackageList.map((subscriptionPackage:any) => ({
        subscriptionPackageId: subscriptionPackage.subscriptionPackageId,
        code: subscriptionPackage.code,
        name: subscriptionPackage.name,
        activationPeriod: subscriptionPackage.activationPeriod,
        testCount: subscriptionPackage.testCount,
        attemptCount: subscriptionPackage.attemptCount,
        price: subscriptionPackage.price,
        sequence: subscriptionPackage.sequence,
        primaryColor: subscriptionPackage.primaryColor,
        secondaryColor: subscriptionPackage.secondaryColor,
        status: subscriptionPackage.status
      }));

      this.loading = false;

      this.source.load(tableData);
      console.log("Loaded Subscription Package data:", tableData);

      console.log("SubscriptionPackageList")
      console.log(this.SubscriptionPackageList)
    })
  }

  isEditMode = false;
  selecteCode: string | null=null;

  openWindowForm(contentTemplate: any) {
    this.isEditMode = false;
    this.selecteCode = null;
    this.errorMessage = null;

    this.subscriptionPackage = {
      subscriptionPackageId: null,
      code:'',
      name:'',
      activationPeriod:'',
      testCount:'',
      attemptCount:'',
      price:'',
      sequence:'',
      primaryColor:'',
      secondaryColor:'',
      status:'',
    }

    this.subscriptionPackageForm.reset();
    this.subscriptionPackageForm.get('code')?.enable();
    this.subscriptionPackageForm.get('attemptCount')?.setValue(9999);


    this.modelLoading = true;

    this.windowRef = this.windowService.open(contentTemplate, {
      title: 'Add New Subscription Package',
      hasBackdrop: true,
      closeOnEsc: false
    });

    this.modelLoading = false;
  }

  onEdit(event: any, contentTemplate: any) {
    this.isEditMode = true;
    this.subscriptionPackage = event.data;
    this.selecteCode = event.data.subscriptionPackageId;
    this.subscriptionPackageForm.get('code')?.disable();
    this.errorMessage = null;

    this.modelLoading = true;

    this.subscriptionPackageForm.patchValue({
      subscriptionPackageId:event.data.subscriptionPackageId,
      code:event.data.code,
      name:event.data.name,
      activationPeriod:event.data.activationPeriod,
      testCount:event.data.testCount,
      attemptCount:event.data.attemptCount,
      price:event.data.price,
      sequence:event.data.sequence,
      primaryColor:event.data.primaryColor,
      secondaryColor:event.data.secondaryColor,
      status:event.data.status,
    });

    this.isChanged = false;

    this.windowRef = this.windowService.open(contentTemplate, {
      title: 'Edit Subscription Package',
      hasBackdrop: true,
      closeOnEsc: false
    });

    this.modelLoading = false;
  }

  onSearch(query: string = '') {
    this.loading = true;
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'code', search: query },
        { field: 'name', search: query },
        { field: 'activationPeriod', search: query },
        { field: 'testCount', search: query },
        { field: 'attemptCount', search: query },
        { field: 'price', search: query },
        { field: 'sequence', search: query },
        { field: 'primaryColor', search: query },
        { field: 'secondaryColor', search: query },
        { field: 'status', search: query },
      ], false);
    }
    this.loading = false;

    console.log("")
    console.log(query)
  }

  onSubmit(): void {
      this.subscriptionPackageForm.markAllAsTouched();
      if (this.subscriptionPackageForm.valid) {
        const formValue = this.subscriptionPackageForm.value;
  
        if (this.isEditMode) {
          const payload = {
            subscriptionPackageId: formValue.subscriptionPackageId,
            code: formValue.code,
            name: formValue.name,
            activationPeriod: formValue.activationPeriod,
            testCount: formValue.testCount,
            attemptCount: formValue.attemptCount,
            price: formValue.price,
            sequence: formValue.sequence,
            primaryColor: formValue.primaryColor,
            secondaryColor: formValue.secondaryColor,
            status: formValue.status,
          };
          
          this.modelLoading = true;
  
          this.subscriptionPackageService.updateData(payload.subscriptionPackageId, formValue).subscribe({
            next: (res) => {
              console.log(res);
              if (res.code === 200) {
                this.getPayment();
                this.windowRef.close();
                Swal.fire({
                  title: 'Updated!',
                  text: 'Subscription Package has been updated successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                this.modelLoading = false;
  
              } else if (res.code === 416) {
                
                this.errorMessage = res.message;
                this.modelLoading = false;
  
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: 'Something went wrong while updating Subscription Package.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
                this.modelLoading = false;
              }
            },
            error: () => {
              Swal.fire({
                title: 'Error!',
                text: 'Something went wrong while updating Subscription Package.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
              this.modelLoading = false;
            }
          });

          // this.getPayment();
          // this.subscriptionPackageForm.reset(); 
          // this.subscriptionPackageForm.get('code')?.enable();
  
        } else {
          this.modelLoading = true;
  
          this.subscriptionPackageService.postData(formValue).subscribe({
            next: (res) => {
              if (res.code === 200) {
                this.getPayment();
                this.windowRef.close();
                Swal.fire({
                  title: 'Added!',
                  text: 'Subscription Package has been added successfully.',
                  icon: 'success',
                  confirmButtonText: 'OK'
                });
                this.modelLoading = false;
  
              } else if (res.code === 416) {
  
                this.errorMessage = res.message;
                this.modelLoading = false;
  
              } else {
                Swal.fire({
                  title: 'Error!',
                  text: 'Something went wrong while updating Subscription Package.',
                  icon: 'error',
                  confirmButtonText: 'OK'
                });
                this.modelLoading = false;
              }
            },
            error: () => {
              Swal.fire({
                title: 'Error!',
                text: 'Something went wrong with the request.',
                icon: 'error',
                confirmButtonText: 'OK'
              }); 
              this.modelLoading = false;
            }
          });

          // this.getPayment();
          // this.subscriptionPackageForm.reset(); 
          // this.subscriptionPackageForm.get('code')?.enable();

        }
      }
  }

}