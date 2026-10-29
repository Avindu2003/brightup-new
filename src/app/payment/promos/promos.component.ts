import { Component } from '@angular/core';
import { PromosService } from './promos.service';
import { LocalDataSource } from 'angular2-smart-table';
import { NbWindowService } from '@nebular/theme';
import { FormControl, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'ngx-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.scss']
})
export class PromosComponent {

  promos: any;
  promosList: any[];
  addForm: FormGroup;
  editForm: FormGroup;
  dialogRef: any;
  errorMessage: any;
  datevalidationerror: any;
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
      promoType: {
        title: 'Promo Type',
        type: 'string',
        valuePrepareFunction: (value) => {
          if (value === 'CAD') return 'Cash Flat Amount Discount';
          else if (value === 'QCD') return 'Quiz Count Discount';
          else if (value === 'CPD') return 'Cash Percentage Discount';
          else return 'Unknown';
        }
      },
      amount: {
        title: 'Amount',
        type: 'string'
      },
      startDate: {
        title: 'Start Date',
        type: 'string'
      },
      expireDate: {
        title: 'Expire Date',
        type: 'string'
      },
      status: {
        title: 'Status',
        type: 'string',
        valuePrepareFunction: (value) => {
          return value === 'A' ? 'Active' : 'Inactive';
        }
      },
      applicablePackage: {
        title: 'Applicable Package',
        type: 'string',
        valuePrepareFunction: (value) => {
          if (value === 'ALL') return 'ALL';
          else if (value === 'BEG') return 'BEG';
          else if (value === 'INT') return 'INT';
          else if (value === 'PRO') return 'PRO';
          else return 'Unknown';
        }
      },
      couponCode: {
        title: 'Coupon Code',
        type: 'string'
      },
      description: {
        title: 'Description',
        type: 'string'
      },
      colorTitle: {
        title: 'Color Title',
        type: 'string'
      },
      colorBody: {
        title: 'Color Body',
        type: 'string'
      },
      colorPackage: {
        title: 'Color Package',
        type: 'string'
      },
      count: {
        title: 'Count',
        type: 'string'
      },
      personalized: {
        title: 'Personalized',
        type: 'boolean'
      }
    },

  };

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private promosService: PromosService,
    private windowService: NbWindowService
  ) {
  }

  ngOnInit() {
    this.getpromo();
    this.initForm();
    this.addForm.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });

  }

  private initForm() {
    this.addForm = new FormGroup({
      'promoType': new FormControl('', [Validators.required]),
      'amount': new FormControl('', [Validators.required, Validators.pattern('^[0-9A-Za-z%]+$')]),
      'startDate': new FormControl('', [Validators.required]),
      'expireDate': new FormControl('', [Validators.required]),
      'status': new FormControl('', [Validators.required]),
      'applicablePackage': new FormControl('', [Validators.required]),
      'couponCode': new FormControl('', [Validators.required, Validators.minLength(6),  Validators.pattern('^[A-ZAa-z0-9]+$')]),
      'description': new FormControl('', [Validators.required]),
      'colorTitle': new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[A-F0-9]+$')]),
      'colorBody': new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[A-F0-9]+$')]),
      'colorPackage': new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[A-F0-9]+$')]),
      'count': new FormControl('', [Validators.pattern('^[0-9]+$')]),
      'personalized': new FormControl(false)
    });

    this.editForm = new FormGroup({
      'promoId': new FormControl(''),
      'promoType': new FormControl('', [Validators.required]),
      'amount': new FormControl('', [Validators.required, Validators.pattern('^[0-9A-Za-z%]+$')]),
      'startDate': new FormControl('', [Validators.required]),
      'expireDate': new FormControl('', [Validators.required]),
      'status': new FormControl('', [Validators.required]),
      'applicablePackage': new FormControl('', [Validators.required]),
      'couponCode': new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[A-Za-z0-9]+$')]),
      'description': new FormControl('', [Validators.required]),
      'colorTitle': new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[A-F0-9]+$')]),
      'colorBody': new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[A-F0-9]+$')]),
      'colorPackage': new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern('^[A-F0-9]+$')]),
      'count': new FormControl('', [Validators.pattern('^[0-9]+$')]),
      'personalized': new FormControl(false)

    });
  }

  today = new Date().toISOString().split('T')[0];

  get minExpireDate() {
    return this.addForm.get('startDate').value || this.today;
  }

  get minExpireDate1() {
    return this.editForm.get('startDate').value || this.today;
  }

  checkDateValidity() {
    const startDate = this.addForm.get('startDate').value;
    const expireDate = this.addForm.get('expireDate').value;


    if (!startDate || !expireDate || startDate <= expireDate) {
      this.datevalidationerror = null

    } else {
      this.datevalidationerror = "Expire date should be greater than or equal to start date."
    }

  }

  checkDateValidity1() {
    const startDate1 = this.editForm.get('startDate').value;
    const expireDate2 = this.editForm.get('expireDate').value;

    if (!startDate1 || !expireDate2 || startDate1 <= expireDate2) {
      this.datevalidationerror = null

    } else {
      this.datevalidationerror = "Expire date should be greater than or equal to start date."
    }
    
  }


  create() {
    this.addForm.markAllAsTouched();
    this.errorMessage = null;
    if (this.addForm.valid) {
      let data = {
        "promoType": this.addForm.get('promoType').value,
        "amount": this.addForm.get('amount').value,
        "startDate": this.addForm.get('startDate').value,
        "expireDate": this.addForm.get('expireDate').value,
        "status": this.addForm.get('status').value,
        "applicablePackage": this.addForm.get('applicablePackage').value,
        "couponCode": this.addForm.get('couponCode').value,
        "description": this.addForm.get('description').value,
        "colorTitle": this.addForm.get('colorTitle').value,
        "colorBody": this.addForm.get('colorBody').value,
        "colorPackage": this.addForm.get('colorPackage').value,
        "count": this.addForm.get('count').value || 0,
        "personalized": this.addForm.get('personalized').value
      }

      this.modelLoading = true;
      this.promosService.create(data).subscribe({
        next: (response: any) => {
          if (response['code'] === 200) {
            swal.fire('Success', 'Promo Created Successfully!', 'success');
            this.addForm.reset();
            this.getpromo();
            this.dialogRef.close();
            this.modelLoading = false;

          } else if (response['code'] === 400) {
            swal.fire('Failed!', '', 'warning');
            this.modelLoading = false;

          } else if (response['code'] === 416) {
            this.errorMessage = response['message'];
            this.modelLoading = false;
          }
          else {
            swal.fire('Failed!', 'Something went wrong try again later', 'warning');
            this.modelLoading = false;
          }
        },
        error: (e) => {
          swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
          this.modelLoading = false;
        },
      });
    }
  }

  getpromo() {
    this.loading = true;
    this.promosService.getpromo()
      .subscribe((response) => {
        this.promosList = response['responseData'];
        const tableData = this.promosList.map(promos => ({
        }));

        this.source.load(this.promosList.map(item => ({
          promoId: item.promoId,
          promoType: item.promoType,
          amount: item.amount,
          startDate: item.startDate,
          expireDate: item.expireDate,
          status: item.status,
          applicablePackage: item.applicablePackage,
          couponCode: item.couponCode,
          description: item.description,
          colorTitle: item.colorTitle,
          colorBody: item.colorBody,
          colorPackage: item.colorPackage,
          count: item.count,
          personalized: item.personalized
        })));
        this.loading = false;
      });
  }

  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    } else {
      this.source.setFilter([
        { field: 'promoType', search: query },
        { field: 'status', search: query },
        { field: 'applicablePackage', search: query },
      ], false);
    }

  }

  openWindowForm(contentTemplate: any, isEdit: boolean = false) {
    this.errorMessage = null;
    this.addForm.reset();
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title: isEdit ? 'Edit Promo' : 'Add New Promo'
    };

    this.dialogRef = this.windowService.open(contentTemplate, config);
  }

  onFieldChange() {
    let promoType = this.editForm.get('promoType')?.value;
    let amount = this.editForm.get('amount')?.value;
    let startDate = this.editForm.get('startDate')?.value;
    let expireDate = this.editForm.get('expireDate')?.value;
    let status = this.editForm.get('status')?.value;
    let applicablePackage = this.editForm.get('applicablePackage')?.value;
    let couponCode = this.editForm.get('couponCode')?.value;
    let description = this.editForm.get('description')?.value;
    let colorTitle = this.editForm.get('colorTitle')?.value;
    let colorBody = this.editForm.get('colorBody')?.value;
    let colorPackage = this.editForm.get('colorPackage')?.value;
    let count = this.editForm.get('count')?.value;
    let personalized = this.editForm.get('personalized')?.value;
    this.isChanged = (promoType !== this.promos.promoType) || (amount !== this.promos.amount) || (startDate !== this.promos.startDate) || (expireDate !== this.promos.expireDate) || (status !== this.promos.status) ||
      (applicablePackage !== this.promos.applicablePackage) || (couponCode !== this.promos.couponCode) || (description !== this.promos.description) || (colorTitle !== this.promos.colorTitle) || (colorBody !== this.promos.colorBody) ||
      (colorPackage !== this.promos.colorPackage) || (count !== this.promos.count) || (personalized !== this.promos.personalized);
  }

  edit(event: any, contentTemplate: any) {
    this.promos = event.data;
    this.editForm.patchValue({
      promoId: this.promos.promoId,
      promoType: this.promos.promoType,
      amount: this.promos.amount,
      startDate: this.promos.startDate,
      expireDate: this.promos.expireDate,
      status: this.promos.status,
      applicablePackage: this.promos.applicablePackage,
      couponCode: this.promos.couponCode,
      description: this.promos.description,
      colorTitle: this.promos.colorTitle,
      colorBody: this.promos.colorBody,
      colorPackage: this.promos.colorPackage,
      count: this.promos.count,
      personalized: this.promos.personalized
    });
    // this.editForm.get('username')?.disable();
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title: 'Edit Promo'
    };

    this.modelLoading = true;
    this.dialogRef = this.windowService.open(contentTemplate, config);
    this.isChanged = false;
    this.modelLoading = false;
  }

  update() {
    this.errorMessage = null;
    if (this.editForm.valid) {
      const data = {
        'promoId': this.promos.promoId,
        'promoType': this.editForm.getRawValue().promoType,
        'amount': this.editForm.getRawValue().amount,
        'startDate': this.editForm.getRawValue().startDate,
        'expireDate': this.editForm.getRawValue().expireDate,
        'status': this.editForm.getRawValue().status,
        'applicablePackage': this.editForm.getRawValue().applicablePackage,
        'couponCode': this.editForm.getRawValue().couponCode,
        'description': this.editForm.getRawValue().description,
        'colorTitle': this.editForm.getRawValue().colorTitle,
        'colorBody': this.editForm.getRawValue().colorBody,
        'colorPackage': this.editForm.getRawValue().colorPackage,
        'count': this.editForm.getRawValue().count,
        'personalized': this.editForm.getRawValue().personalized
      }

      this.modelLoading = true;
      this.promosService.update(data).subscribe({
        next: (response: any) => {
          if (response['code'] === 200) {
            swal.fire('Success', 'Promo Updated Successfully!', 'success');
            this.getpromo();
            this.addForm.reset();
            this.dialogRef.close();
            this.modelLoading = false;
          }
          else {
            swal.fire('Warning', 'Something went wrong try again later !', 'warning');
            this.modelLoading = false;
          }
          this.modelLoading = false;


        },
        error: (e) => {
          this.modelLoading = false;
          swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
        }
      });
    } else {
      swal.fire('Warning', 'Please fill all required fields!', 'warning');
      console.log(this.editForm);
    }
  }

}























