import { Component } from '@angular/core';
import { LocalDataSource } from 'angular2-smart-table';
import { ContentSummaryService } from './content-summary.service';
import { NbWindowService, } from '@nebular/theme';
import swal from 'sweetalert2';

@Component({
  selector: 'ngx-content-summary',
  templateUrl: './content-summary.component.html',
  styleUrl: './content-summary.component.scss'
})
export class ContentSummaryComponent {
  selectedCategory: string;
  selectedExamData: any;

  showRelevantTo :boolean = false;
  showStream: boolean = true;
  selectedSubject: string;
  examCategoryList : any[] = [];
  chapterList :any[] = [];
  selectedPaper: string;
  allResponseData: any[] = [];
  streamList: any[] = [];
  semesterList: any[] = [];
  mediumList: any[] = [];
  tableList: any[] = [];
  isChanged :boolean = false;
  selectedSemester : string;
  selectedStream: string;
  selectedChapter: string | 0;
  selectedMedium: string | null = null;
  loading: boolean = true;
  totalOverviewList       : any[];
  modelLoading: boolean = true;
  dialogRef: any;
  selectedRecord: any = null;
  subjectList: any[] = [];
  totalCategory: any;
  totalStream: any;
  totalMedium: any;
  totalSubject: any;
  totalChapter: any;
  settings = {
    attr: {
      class: 'table table-bordered', 
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
      position: 'right',
    },
    hideSubHeader: true,
    mode: 'external',
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
    },
    columns: {
      category: {
        title: 'Chapter',
        type: 'string',
      },
      ppTtQuetion: {
        title: 'Past Paper Total',
        type: 'html',
        valuePrepareFunction: (cell) => `<b class="text-purple">${cell}</b>`
      },
      ppActiveQuetion: {
        title: 'PP Active Quetion',
        type: 'html',
        valuePrepareFunction: (cell) => `<b class="text-success">${cell}</b>`
      },
      ppInactiveQuetion: {
        title: 'PP Inactive Quetion',
        type: 'html',
        valuePrepareFunction: (cell) => `<b class="text-danger">${cell}</b>`
      },
      mpTtQuetion: {
        title: 'Model Paper Total',
        type: 'html',
        valuePrepareFunction: (cell) => `<b class="text-purple">${cell}</b>`
      },
      mpActiveQuetion: {
        title: 'MP Active Quetion',
        type: 'html',
        valuePrepareFunction: (cell) => `<b class="text-success">${cell}</b>`
      },
      mpInactiveQuetion: {
        title: 'MP Inactive Quetion',
        type: 'html',
        valuePrepareFunction: (cell) => `<b class="text-danger">${cell}</b>`
      },
    },
  };


  source: LocalDataSource = new LocalDataSource();
  constructor(
    private contentSummaryService: ContentSummaryService,
    private windowService: NbWindowService
  ) {}

  ngOnInit(){
    this.getContentSummaryDetails();
    this.getSubjectWithExamCategory();
  }

  
  getContentSummaryDetails(){
    this.loading = true;
    this.contentSummaryService.getContentSummaryDetails()
    .subscribe((response: any)=>{
      this.totalOverviewList = response;
      console.log("overview")
       this.totalCategory = response.totalCategories;
       this.totalStream = response.totalStreams;
       this.totalMedium = response.totalMediums;
       this.totalSubject = response.totalSubjects;
       this.totalChapter = response.totalChapters;
      console.log(this.totalOverviewList)
      this.loading = false;
    })
  }

getSubjectWithExamCategory() {
    this.contentSummaryService.getSubjectWithExamCategory().subscribe((response: any) => {
      this.allResponseData = response['responseData'];
      this.mediumList = response['mediumList']
      this.examCategoryList = this.allResponseData
        .filter(item => item && item.examCategoryDto) 
        .map(item => item.examCategoryDto);
        
      console.log('Category List:', this.examCategoryList);
    });
  } 

  onCategoryChange(selectedCategoryId: number) {
    this.isChanged =false;
    this.selectedStream = null;
    this.selectedSubject = null;
    this.selectedChapter = null;
    this.streamList = [];
    this.subjectList = [];
    this.chapterList = [];

    this.selectedExamData = this.allResponseData.find(
      (item) => item.examCategoryDto.examCategoryId === selectedCategoryId
    );

     if (!this.selectedExamData) return;

    const code = this.selectedExamData.examCategoryDto.code;

    if (code === 'BIT') {
      this.showRelevantTo = true; 
      this.showStream = false;    

      this.semesterList = this.selectedExamData.streamSubjectList.map(item => ({
        ...item,
        nameSinhala: item.description 
      }));

    }else if(code === 'AL'){
      this.showStream = true;   
      this.showRelevantTo = false; 

      this.streamList = this.selectedExamData.streamSubjectList.map(item => ({
        ...item,
        nameSinhala: item.description
      }));
    }
      else {
      this.showStream = false;   
      this.showRelevantTo = false; 

      this.streamList = this.selectedExamData.streamSubjectList.map(item => ({
        ...item,
        nameSinhala: item.description
      }));
        if (this.streamList.length > 0) {
        const olStream = this.streamList[0];
        this.subjectList = olStream.subjects || [];
      }
    }
  }

  onStreamChange(selectedStreamId: any) {
    this.selectedSubject = null;
    this.selectedChapter = null;
    this.subjectList = [];
    this.chapterList = [];
    this.isChanged =false;
    const categoryObj = this.allResponseData.find(
      (item) => item.examCategoryDto.examCategoryId === this.selectedCategory
    );

    if (categoryObj) {
      const streamObj = categoryObj.streamSubjectList.find(
        (s: any) => s.streamId === selectedStreamId
      );

      if (streamObj) {
        this.subjectList = streamObj.subjects;
      }
    }
  }

  onSemesterChange(selectedSemesterCode: any) {
    this.selectedSubject = null;
    this.selectedChapter = null;
    this.subjectList = [];
    this.chapterList = [];
    this.isChanged =false;

    const categoryObj = this.allResponseData.find(
      (item) => item.examCategoryDto.examCategoryId === this.selectedCategory
    );

    if (categoryObj) {
      const semesterObj = categoryObj.streamSubjectList.find(
        (s: any) => s.code === selectedSemesterCode
      );

      if (semesterObj) {
        this.subjectList = semesterObj.subjects;
      }
    }
  }
  onMeadiumChange(SelectedMedium: any) {
    if(this.selectedSubject){
      this.isChanged =true;
    }
  }

  onSubjectChange(selectedSubjectId: any) {
    this.selectedChapter = null;
    this.chapterList = [];
    if(this.selectedMedium){
      this.isChanged =true;
    }
    const categoryObj = this.allResponseData.find(
      (item) => item.examCategoryDto.examCategoryId === this.selectedCategory
    );

    if (categoryObj) {
      let parentObj;

      if (this.selectedStream != null) {
        parentObj = categoryObj.streamSubjectList.find(
          (s: any) => s.streamId == this.selectedStream 
        );
      } else if (this.selectedSemester) {
        parentObj = categoryObj.streamSubjectList.find(
          (s: any) => s.code === this.selectedSemester
        );
      }

      if (parentObj) {
        const subjectObj = parentObj.subjects.find(
          (sub: any) => sub.subjectId === selectedSubjectId
        );

        if (subjectObj) {
          this.chapterList = subjectObj.chapters || []; 
          console.log("Chapters loaded:", this.chapterList);
        }
      }
    }
  }
  onSubjectChapter(selectedChapterId: any) {
    console.log("Chapter selected:", selectedChapterId);
  }

  onButtonClick(button: any) {
    console.log('Clicked:', button);
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
    console.log("this.EducationalDetailsList ");

    
  
    this.openWindowForm(viewModal);

  }
  filters(){
    this.loading = true;
      if(this.selectedSubject && this.selectedMedium){
        this.isChanged =true;
        let data = {
          "subjectId"  : this.selectedSubject,
          "chapterId"  :this.selectedChapter || 0,
          "medium"     :this.selectedMedium,          
        }
          this.contentSummaryService.filter(data).subscribe({
          next: (response) => {
            setTimeout(() => { this.modelLoading = false; }, 1600);
            if (response['code'] == '200') {
              this.tableList = response['responseData']
                this.source.load(this.tableList.map(item => ({
                  category: item.name ? item.name : `Chapter ${item.chapterNo}`,
                  ppTtQuetion: item.pastPaperQuestionCount,
                  ppActiveQuetion: item.pastPaperActiveQuestionCount,
                  ppInactiveQuetion: item.pastPaperInactiveQuestionCount,
                  mpTtQuetion:item.modelPaperQuestionCount,
                  mpActiveQuetion:item.modelPaperActiveQuestionCount,
                  mpInactiveQuetion:item.modelPaperInactiveQuestionCount,
                })));
                this.loading = false;
            } else if (response['code'] == '400'){
              swal.fire('Warning', 'Failed!', 'warning');
            }
            else{
              swal.fire('Warning', 'Something went wrong try again later', 'warning');
            }
          },
          error: (e) => {
            swal.fire('Warning', 'Something bad happened please try again later. !', 'warning');
          }
        });
      }
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
