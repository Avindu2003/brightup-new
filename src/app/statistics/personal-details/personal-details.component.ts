import { Component, OnInit } from '@angular/core';
import { PersonalDetailsService } from './personal-details.service';
import { LocalDataSource } from 'angular2-smart-table';

@Component({
  selector: 'ngx-personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})
export class PersonalDetailsComponent implements OnInit {

  settings = {
  attr: {
    class: 'table table-bordered',
  },
  actions: {
    add: false,
    edit: false,
    delete: false,
  },
  
  hideSubHeader: true,
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      nic: {
        title: 'NIC',
        type: 'number',
      },
      dob: {
        title: 'DOB',
        type: 'date',
      },
      school: {
        title: 'School',
        type: 'string',
      },
      city: {
        title: 'City',
        type: 'string',
      },
      mobile_no: {
        title: 'Mobile No',
        type: 'number',
      },
    },
  };

  PersonalDetailsService: any;
  userList: any;
  source: LocalDataSource = new LocalDataSource();
  constructor(private personalDetailsService: PersonalDetailsService) {}
    
  ngOnInit(){
    this.getUser();
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  getUser(){
    this.personalDetailsService.getUser()
    .subscribe((response)=>{
      this.userList = response['responseData'];
      const tableData = this.userList.map(user => ({
      name: user.name,
      nic: user.nic,
      dob: user.dob,
      school: user.school && user.school.description ? user.school.description : '-',
      city: user.city && user.city.description ? user.city.description : '-',
      mobile_no: user.mobileNo
    }));

      this.source.load(tableData);
    })
  }
}
