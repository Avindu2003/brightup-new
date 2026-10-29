import { Component, TemplateRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'angular2-smart-table';
import { StreamService } from './stream.service';
import { NbComponentType, NbWindowRef, NbWindowService } from '@nebular/theme';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'ngx-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss'],

})
export class StreamComponent {
  
  StreamList: any[] = [];
  source: LocalDataSource = new LocalDataSource();
  windowRef: NbWindowRef;
  isChanged : boolean = false;

  form = new FormGroup({
    streamId: new FormControl(''),
    code: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required])
  });
  

  settings={
    attr: {
      class: 'table table-bordered', 
    },
    actions:{
     add: true,
     edit: true,
     delete: false,
     position: 'right',
    },

    hideSubHeader: true,
    mode: 'external',
     
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },

     columns: {
      code: {
        title: 'Code',
        type: 'string',
      },
       description: {
        title: 'Stream Name',
        type: 'string',
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

  //data: any;
  formPopup: TemplateRef<any> | NbComponentType;
  stream: any;
  errorMessage:any;
  loading: boolean = false;
  modelLoading: boolean = false;

  constructor(
    private windowService: NbWindowService,
    private streamService: StreamService
  ) {}

    ngOnInit() {
      this.getStream();
      this.form.valueChanges.subscribe(val => {
      this.isChanged =
        val.description !== this.stream.description ||
        val.status !== this.stream.status;
      });
      this.form.get('code')?.valueChanges.subscribe(() => {});
      
    }

  getStream(){
      this.loading = true;

      this.streamService.getStream()
     .subscribe((response)=>{
       this.StreamList = response['responseData']
       const tableData = this.StreamList.map(stream => ({
       streamId:stream.streamId,
       code: stream.code,
       description: stream.description,
       status: stream.status,

      
    }));
      this.loading = false;
      this.source.load(tableData);
      console.log("Loaded user data:", tableData);

      console.log("stream")
      console.log(this.StreamList)

})}

  isEditMode = false;
  selectedCode: string | null = null;
  
  openWindowForm(contentTemplate: any) {
    this.isEditMode = false;
    this.selectedCode = null;
    this.errorMessage=null;
    
    this.form.reset();  
    this.form.get('code')?.enable();  
    this.windowRef = this.windowService.open(contentTemplate, {
      title: 'Add New Stream',
      hasBackdrop: true,
      closeOnEsc: false,
    });
  }

  edit(event: any, contentTemplate: any) {
    this.isEditMode = true;
    this.stream = event.data;
    this.selectedCode = event.data;
    this.form.get('code')?.disable();
    this.errorMessage=null;
    // patch form with selected row data
    this.form.patchValue({
      streamId: event.data.streamId,
      code: event.data.code,
      description: event.data.description,
      status: event.data.status,
    });
    this.isChanged = false;
    this.modelLoading= true;
    this.windowRef = this.windowService.open(contentTemplate, {
      title: 'Edit Stream',
      hasBackdrop: true,
      closeOnEsc: false,
    });
    
    this.modelLoading= false;
  }
  
  submitForm(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      //const formValue = this.form.value;
      const formValue = this.form.getRawValue();

      if (this.isEditMode) {
      
        const payload = {
          streamId: formValue.streamId,   // backend expects stream_id
          code: formValue.code,
          description: formValue.description,
          status: formValue.status,
        };

        this.modelLoading= true;
        this.streamService.updateData(payload.streamId, payload).subscribe({
        //this.streamService.updateData(data.streamId, data).subscribe({
          next: (res:any) => {
            //console.log(res)
            if (res['code'] === 200) {
              Swal.fire('Updated!', 'Stream updated successfully.', 'success');
              this.getStream();
              this.form.reset();
              this.windowRef.close();
              console.log("edit Success")
              this.modelLoading= false;
            } else {
              Swal.fire('Error!', 'Failed to update stream.', 'error');
              this.modelLoading= false;
            }
          },
          error:(err) => {
            console.error('HttpErrorResponse:', err);
            Swal.fire('Error!', 'Failed to update stream.', 'error');
            this.modelLoading= false;
          }

      });
        
      } else {
          this.modelLoading= true;
          const payload = {
          code: formValue.code,
          description: formValue.description,
          status: formValue.status,
        };
         this.streamService.postData(payload).subscribe({
          next: (res) => {
            console.log(res)
            if (res['code'] === 200) {
              Swal.fire('Created!', 'Stream added successfully.', 'success');
              this.getStream();
              this.form.reset();
              this.windowRef.close();
             this.modelLoading= false;
            }
            
            else if (res['code']=== 416) { 
              this.errorMessage=res['message'];
              this.modelLoading= false;
            } 
            else {
              Swal.fire('Error!', 'Failed to create stream.', 'error');
              this.modelLoading= false;
            }
          },
          error: (err) => {
            console.error('HttpErrorResponse:', err);
            Swal.fire('Error!', 'Server not reachable or crashed.', 'error');
            this.modelLoading= false;
          }

        });
          this.getStream();
          this.form.reset(); 
          this.form.get('code')?.enable();
          console.log("create")

      }};
      }  

       onSearch(query: string = '') {
        if (query.trim() === '') {
          this.source.setFilter([], true);
        }else{
          this.source.setFilter([
            { field: 'code', search: query },
            { field: 'description', search: query },
          ], false);
        }

        console.log("")
        console.log(query)
      }
  // data1 = [
  //   { code: "Leanne",  description: "Bret", status: "A" },
  //   { code: "Ervin",   description:  "Antonette", status: "I"  },
  //   { code: "Nicholas",  description:  "Nicholas.Stanton", status: "A"  }
  // ];
            
}

