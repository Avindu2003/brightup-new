import { Component, NgModule, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'angular2-smart-table';
import { SchoolService } from './school.service';
import { NbWindowRef, NbWindowService } from '@nebular/theme';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'ngx-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.scss']
})
export class SchoolComponent {
  
  School: any;
  SchoolList : any[];
  source: LocalDataSource = new LocalDataSource();
  windowRef: NbWindowRef;
  errorMessage: any;
  schoolForm: FormGroup;
  isChanged : boolean = false;
  loading: boolean = true;
  modelLoading: boolean = true;

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
      description: {
        title: 'School Name',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'string',
      },
    },
  };

  constructor(
    private schoolService: SchoolService,
    private windowService: NbWindowService,

    private fb: FormBuilder
  ) {
    this.schoolForm = this.fb.group({
      schoolId: [''],
      description: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit(){
    this.getSchool();

    this.schoolForm.valueChanges.subscribe(val => {
      this.isChanged =
        val.description !== this.School.description ||
        val.status !== this.School.status;
    });
  }

  getSchool(){
    this.loading = true;

    this.schoolService.getSchool().subscribe((response)=>{
      this.SchoolList = response['responseData']
      const tableData = this.SchoolList.map((School:any) => ({
        schoolId: School.schoolId,
        description: School.description,
        status: School.status
      }));

      this.loading = false;

      this.source.load(tableData);
      console.log("Loaded school data:", tableData);

      console.log("SchoolList")
      console.log(this.SchoolList)
    })
  }

  isEditMode = false;
  selecteCode: string | null=null;

  openWindowForm(contentTemplate: any) {
    this.isEditMode = false;
    this.selecteCode = null;
    this.errorMessage = null;
    this.schoolForm.reset();

    this.modelLoading = true;

    this.windowRef = this.windowService.open(contentTemplate, {
      title: 'Add New School',
      hasBackdrop: true,
      closeOnEsc: false
    });

    this.modelLoading = false;
  }

  onEdit(event: any, contentTemplate: any) {
    this.isEditMode = true;
    this.School = event.data;
    this.selecteCode = event.data.schoolId;
    this.errorMessage = null;

    this.modelLoading = true;

    this.schoolForm.patchValue({
      schoolId:event.data.schoolId,
      description:event.data.description,
      status:event.data.status,
    });

    this.isChanged = false;

    this.windowRef = this.windowService.open(contentTemplate, {
      title: 'Edit School',
      hasBackdrop: true,
      closeOnEsc: false
    });

    this.modelLoading = false;
  }

  onSubmit(): void {
    this.schoolForm.markAllAsTouched();
    if (this.schoolForm.valid) {
      const formValue = this.schoolForm.value;

      if (this.isEditMode) {
        const payload = {
          schoolId: formValue.schoolId,
          description: formValue.description,
          status: formValue.status,
        };
        this.modelLoading = true;

        this.schoolService.updateData(payload.schoolId, formValue).subscribe({
          next: (res) => {
            console.log(res);
            if (res.code === 200) {
              this.getSchool();
              this.windowRef.close();
              Swal.fire({
                title: 'Updated!',
                text: 'School has been updated successfully.',
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
                text: 'Something went wrong while updating school.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
              this.modelLoading = false;
            }
          },
          error: () => {
            Swal.fire({
              title: 'Error!',
              text: 'Something went wrong while updating school.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
            this.modelLoading = false;
          }
        });

      } else {
        this.modelLoading = true;


        this.schoolService.postData(formValue).subscribe({
          next: (res) => {
            if (res.code === 200) {
              this.getSchool();
              this.windowRef.close();
              Swal.fire({
                title: 'Added!',
                text: 'School has been added successfully.',
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
                text: 'Something went wrong while updating school.',
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
      }
    }
  }

  onSearch(query: string = '') {
    this.loading = true;
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'description', search: query },
        // { field: 'status', search: query },
      ], false);
    }
    this.loading = false;

    console.log("")
    console.log(query)
  }

}
