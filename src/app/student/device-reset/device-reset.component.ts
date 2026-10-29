import { Component } from '@angular/core';
import { DeviceResetService } from './device-reset.service';
import { LocalDataSource } from 'angular2-smart-table';
import Swal from 'sweetalert2';


@Component({
  selector: 'ngx-device-reset',
  templateUrl: './device-reset.component.html',
  styleUrls: ['./device-reset.component.scss']
})
export class DeviceResetComponent {
  userList       : any[];


  modelLoading: boolean = false;
  loading: boolean = false;


  settings = {
    attr: {
      class: 'table table-bordered', 
    },
    actions: {
      add: false,
      edit: false,
      delete: true,
      position: 'right',
    },
  hideSubHeader: true,
    delete: {
      deleteButtonContent: '<i class="nb-loop"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      device_id: {
        title: 'Device ID',
        type: 'number',
      },
      mobile_no: {
        title: 'Mobile Number',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private deviceResetService: DeviceResetService) {
  }
  
  ngOnInit(){
    this.getUser();
  }



  onResetConfirm(event): void {
    Swal.fire({
      title: "Warning!",
      text: "Are you sure you want to reset this device?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, reset it!"
    })
    .then((result) => {
      if (result.isConfirmed) {
        const mobileNo = event.data.mobile_no;
        
        this.modelLoading= true;
        this.deviceResetService.resetDevice(mobileNo).subscribe({
          next: (response) => {
            if (response['code'] == 200) {
              Swal.fire('Reset!', 'Device has been reset successfully.', 'success');
              // this.updateModal.close();
              this.source.setFilter([]);
              this.getUser();
              this.modelLoading= false;
                
            // } else if (response['code'] == '403'){
            //   Swal.fire('Failed !', '', 'warning');
            }else{
              Swal.fire('Warning', 'Something went wrong try again later !', 'warning');
              this.modelLoading= false;
            }
          },
        });
      } else {
        event.confirm.reject();
        
      }
    });
  }
  getUser(){
    this.loading = true;
    this.deviceResetService.getUser()
    // .pipe(takeUntil(this.destroy$))
    .subscribe((response)=>{
      // setTimeout(()=>1500)
      this.loading =false;
      this.userList = response['responseData'];
      // this.temptechnicianList = response['responseData'];
      const tableData = this.userList.map(user => ({
      name: user.name,
      Student_id: user.userId,
      device_id: user.device_id,
      mobile_no: user.mobileNo
    }));

      this.source.load(tableData);
      console.log("Loaded user data:", tableData);

      console.log("userList")
      console.log(this.userList)
    })
  }
  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'name', search: query },
        { field: 'mobile_no', search: query },
      ], false);
    }
  }
  
}
