import { Component } from '@angular/core';

@Component({
  selector: 'ngx-package-histoty',
  templateUrl: './package-histoty.component.html',
  styleUrls: ['./package-histoty.component.scss']
})
export class PackageHistotyComponent {
  selectedGrade: string | null = null;
  selectedYear: number | null = null;
  selectedStream: string | null = null;
  selectedMedium: string | null = null;


  settings = {
  attr: {
    class: 'table table-bordered', 
  },
  actions: {
    add: false,
    edit: false,
    delete: false,
    // position: 'right',
  },
  hideSubHeader: true,
    // add: {
    //   addButtonContent: '<i class="nb-plus"></i>',
    //   createButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // edit: {
    //   editButtonContent: '<i class="nb-edit"></i>',
    //   saveButtonContent: '<i class="nb-checkmark"></i>',
    //   cancelButtonContent: '<i class="nb-close"></i>',
    // },
    // delete: {
    //   deleteButtonContent: '<i class="nb-trash"></i>',
    //   confirmDelete: true,
    // },
    columns: {
      name: {
        title: 'Name',
        type: 'string',
      },
      year: {
        title: 'Year',
        type: 'number',
        // filter: {
        //   type: 'list',
        //   config: {
        //     selectText: 'Select...',
        //     list: [
        //       { value: '2025', title: '2025' },
        //       { value: '2026', title: '2026' },
        //       { value: '2027', title: '2027' },
        //     ],
        //   },
        // },
      },
      stream: {
        title: 'Stream',
        type: 'string',
      },
      cureent_package: {
        title: 'Cureent Package',
        type: 'string',

      },
      Previous_package: {
        title: 'Previous Package',
        type: 'string',
      },
    },
  };
  years = [2022, 2023, 2024, 2025, 2026];
  streams = ['Science', 'Commerce', 'Arts'];
  mediums = ['English', 'Sinhala'];
  grades = ['A/L', 'O/L'];
  data = [
    { name: "Leanne", year: 2026, stream: "Bret", cureent_package: "Sincere@april.biz", Previous_package: "Bret" },
    { name: "Ervin", year: 2022, stream: "Antonette", cureent_package: "Shanna@melissa.tv", Previous_package: "Bret" },
    { name: "Nicholas", year: 2022, stream: "Nicholas.Stanton", cureent_package: "Rey.Padberg@rosamond.biz", Previous_package: "Bret" }
  ];

  constructor() {
  }
  filters(){

  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
