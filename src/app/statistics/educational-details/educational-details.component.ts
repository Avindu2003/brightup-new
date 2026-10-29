import { Component } from '@angular/core';
import { EducationalDetailsService } from './educational-details.service';
import { LocalDataSource } from 'angular2-smart-table';
import { NbWindowService, } from '@nebular/theme';

@Component({
  selector: 'ngx-educational-details',
  templateUrl: './educational-details.component.html',
  styleUrls: ['./educational-details.component.scss']
})
export class EducationalDetailsComponent {
  selectedGrade: string | null = null;
  selectedYear: number | null = null;
  selectedStream: string | null = null;
  selectedMedium: string | null = null;
  loading: boolean = true;
  EducationalDetailsList       : any[];
  modelLoading: boolean = true;
  dialogRef: any;
  selectedRecord: any = null;
  subjectList: any[] = [];
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
        title: 'Mobile No',
        type: 'string',
      },
      year: {
        title: 'Year',
        type: 'number',
      },
      stream: {
        title: 'Stream',
        type: 'string',
      },
      medium: {
        title: 'Medium',
        type: 'string',
      },
      noOfTestsCreated: {
        title: 'Tests Created',
        type: 'number',
      },
      attemptsSubmitted: {
        title: 'Attempts Submitted',
        type: 'number',
      },
    },
  };
  years = [2022, 2023, 2024, 2025, 2026];
  streams = ['Science', 'Commerce', 'Arts'];
  mediums = ['English', 'Sinhala'];
  grades = ['A/L', 'O/L'];
items = ['First', 'Second', 'Third'];
data = [
  { name: "Leanne", year: 2023, mobileNo: 7795645157, stream: "Graham", medium: "Bret", noOfTestsCreated: "Sincere@april.biz", attemptsSubmitted: 30 },
  { name: "Ervin", year: 2023, mobileNo: 7799571234, stream: "Howell", medium: "Antonette", noOfTestsCreated: "Shanna@melissa.tv", attemptsSubmitted: 25 },
  { name: "Kavindu", year: 2024, mobileNo: 778545157, stream: "DuBuque", medium: "Nicholas.Stanton", noOfTestsCreated: "Rey.Padberg@rosamond.biz", attemptsSubmitted: 28 },
  { name: "Alice", year: 2022, mobileNo: 7791234567, stream: "Science", medium: "English", noOfTestsCreated: "alice@example.com", attemptsSubmitted: 15 },
  { name: "Bob", year: 2021, mobileNo: 7709876543, stream: "Commerce", medium: "Sinhala", noOfTestsCreated: "bob@example.com", attemptsSubmitted: 20 },
  { name: "Jane", year: 2023, mobileNo: 7790001112, stream: "Arts", medium: "Tamil", noOfTestsCreated: "jane@example.com", attemptsSubmitted: 12 },
  { name: "John", year: 2022, mobileNo: 7712345678, stream: "Science", medium: "English", noOfTestsCreated: "john@example.com", attemptsSubmitted: 18 },
  { name: "Erika", year: 2023, mobileNo: 7723456789, stream: "Graham", medium: "Bret", noOfTestsCreated: "erika@example.com", attemptsSubmitted: 22 },
];


  source: LocalDataSource = new LocalDataSource();
  constructor(
    private educationalDetailsService: EducationalDetailsService,
    private windowService: NbWindowService
  ) {}

  ngOnInit(){
    this.getEducationalDetails();
    this.getSubject();
  }

  
  getEducationalDetails(){
    this.loading = true;
    this.educationalDetailsService.getEducationalDetails()
    .subscribe((response)=>{
      this.EducationalDetailsList = response['student']
      console.log(this.EducationalDetailsList)
      this.loading = false;
      this.source.load(this.EducationalDetailsList.map(item => ({
          educationalDetailId: item.educationalDetailId,
          mobileNo: item.mobileNo,
          year: item.year,
          stream: item.stream,
          medium: item.medium,
          noOfTestsCreated: item.noOfTestsCreated,
          attemptsSubmitted: item.attemptsSubmitted
      })))
    })
  }
//  getSubject() {
//     this.educationalDetailsService.getSubject().subscribe((res: any) => {
//       this.subjectList = res.data; 
//     });
//   }
getSubject() {
  this.educationalDetailsService.getSubject().subscribe({
    next: (res: any) => {
      this.subjectList = res.data && res.data.length > 0 
        ? res.data 
        : [
            { id: 1, label: 'Profile' },
            { id: 2, label: 'Results' },
            { id: 3, label: 'Achievements' }
          ];
    },
    error: () => {
      
      this.subjectList = [
        { id: 1, label: 'Maths' },
        { id: 2, label: 'Bio' },
        { id: 4, label: 'Maths' },
        { id: 5, label: 'Bio' },
        { id: 3, label: 'Bio' }
      ];
    }
  });
}
  onButtonClick(button: any) {
    console.log('Clicked:', button);
    // You can add logic like opening modals or fetching data
  }
  onSearch(query: string = '') {
    if (query.trim() === '') {
      this.source.setFilter([], true);
    }else{
      this.source.setFilter([
        { field: 'mobileNo', search: query },
      ], false);
    }
  }
  openWindowForm(contentTemplate:any, ) {
    let config: any = {
      hasBackdrop: true,
      closeOnEsc: false,
      title:  'View Educational Details',
      windowClass: 'custom-width-modal', 
    };
    this.modelLoading = true;
    this.dialogRef = this.windowService.open(contentTemplate, config);

      this.dialogRef.onClose.subscribe(() => {}
    );
    this.modelLoading = false;
    
  }
  view(event: any,viewModal) {
    console.log("view")
    // this.selectedRecord = event.data;
    console.log("this.EducationalDetailsList ");
    console.log(this.EducationalDetailsList )
    
    this.selectedRecord =this.EducationalDetailsList 


    // this.formCheck = true;
    // this.subject = event.data;  
    // this.getSubjectStream(this.subject.code).subscribe(
    // ({ streamList, mappedStreamIds }) => {
    // this.SubjectStreamList = streamList;
    // this.modelLoading = true;
    // this.mappedStreamIds = mappedStreamIds;
    // this.editForm.patchValue({
    //   subjectId: this.subject.subjectId,
    //   subject: this.subject.subject,
    //   code: this.subject.code,
    //   examCategoryId: this.subject.examCategory?.examCategoryId || null,
    //   status: this.subject.status,
    //   relevantTo: this.subject.relevantTo,
    //   contentAvailable: this.subject.contentAvailable ?? false,
    //   engAvailable: this.subject.engAvailable ?? false,
    //   sinAvailable: this.subject.sinAvailable ?? false,
    //   tamAvailable: this.subject.tamAvailable ?? false,
    //   stream: mappedStreamIds
    // });
    // this.imageUrl = this.subject.image || null;
    // this.orginalimageUrl= this.subject.image || null;
    // this.examChanges()
    // this.orginalSubject = Object.assign({}, this.subject);
    // this.isChanged = false;
    // this.examChanges();
    this.openWindowForm(viewModal);
    // },
    // );v
    // this.modelLoading = false;
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
