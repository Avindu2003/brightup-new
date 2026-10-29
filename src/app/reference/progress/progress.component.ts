import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder } from '@nebular/theme';
import { ProgressService } from './progress.service';

@Component({
  selector: 'ngx-fs-icon',
  template: `
   <nb-tree-grid-row-toggle
     [expanded]="expanded"
     *ngIf="isDir()">
   </nb-tree-grid-row-toggle>
 `,
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}

export interface User {
  userId: any;
  name: string;
  mobileNo: string;
}

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
  kind?: string;
}

interface pastPaperUnit {
  subject: string;
  unitWiseTest?: string;
  quetionCompletion?: string;
  totalAttempts?: string;
  avgMarks?: string;
  kind: string;
}

interface pastPaperMixUnit {
  subject: string;
  MixedUnitTest?: string;
  chapters?: string;
  totalAttempts?: string;
  avgMarks?: string;
  kind: string;
}

interface modelPaperUnit {
  subject: string;
  unitWiseTest?: string;
  quetionCompletion?: string;
  totalAttempts?: string;
  avgMarks?: string;
  kind: string;
}

interface modelPaperMixUnit {
  subject: string;
  MixedUnitTest?: string;
  chapters?: string;
  totalAttempts?: string;
  avgMarks?: string;
  kind: string;
}

@Component({
  selector: 'ngx-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss']
})
export class ProgressComponent implements OnInit {

  radio: any[] = []; 
  selectedOption: string = ''; 

  myControl = new FormControl<string | User>(''); 
  filteredOptions: Observable<User[]>; 
  user: any = {};
  UseList: User[];
  loading: boolean = false;
  showData: boolean = false;

  // Past Paper - Unit Wise
  customColumnPPUnit = 'subject';
  defaultColumnsPPUnit = ['unitWiseTest', 'quetionCompletion', 'totalAttempts', 'avgMarks'];
  allColumnsPPUnit = [this.customColumnPPUnit, ...this.defaultColumnsPPUnit];
  dataSourcePPUnit: NbTreeGridDataSource<pastPaperUnit>;
  sortColumnPPUnit: string;
  sortDirectionPPUnit: NbSortDirection = NbSortDirection.NONE;
  ppUnitHeaders = {
    subject: 'Subject',
    unitWiseTest: 'Unit Wise Test',
    quetionCompletion: 'Question Completion',
    totalAttempts: 'Total Attempts',
    avgMarks: 'Avg Marks %'
  };

  // Past Paper - Mix Unit
  customColumnPPMixUnit = 'subject';
  defaultColumnsPPMixUnit = ['MixedUnitTest', 'chapters', 'totalAttempts', 'avgMarks'];
  allColumnsPPMixUnit = [this.customColumnPPMixUnit, ...this.defaultColumnsPPMixUnit];
  dataSourcePPMixUnit: NbTreeGridDataSource<pastPaperMixUnit>;
  sortColumnPPMixUnit: string;
  sortDirectionPPMixUnit: NbSortDirection = NbSortDirection.NONE;
  ppMixUnitHeaders = {
    subject: 'Subject',
    MixedUnitTest: 'Mixed Unit Test',
    chapters: 'Chapters',
    totalAttempts: 'Total Attempts',
    avgMarks: 'Avg Marks %'
  };

  // Model Paper - Unit Wise
  customColumnMPUnit = 'subject';
  defaultColumnsMPUnit = ['unitWiseTest', 'quetionCompletion', 'totalAttempts', 'avgMarks'];
  allColumnsMPUnit = [this.customColumnMPUnit, ...this.defaultColumnsMPUnit];
  dataSourceMPUnit: NbTreeGridDataSource<modelPaperUnit>;
  sortColumnMPUnit: string;
  sortDirectionMPUnit: NbSortDirection = NbSortDirection.NONE;
  mpUnitHeaders = {
    subject: 'Subject',
    unitWiseTest: 'Unit Wise Test',
    quetionCompletion: 'Question Completion', 
    totalAttempts: 'Total Attempts',
    avgMarks: 'Avg Marks %'
  };

  // Model Paper - Mix Unit
  customColumnMPMixUnit = 'subject';
  defaultColumnsMPMixUnit = ['MixedUnitTest', 'chapters', 'totalAttempts', 'avgMarks'];
  allColumnsMPMixUnit = [this.customColumnMPMixUnit, ...this.defaultColumnsMPMixUnit];
  dataSourceMPMixUnit: NbTreeGridDataSource<modelPaperMixUnit>;
  sortColumnMPMixUnit: string;
  sortDirectionMPMixUnit: NbSortDirection = NbSortDirection.NONE;
  mpMixUnitHeaders = {
    subject: 'Subject',
    MixedUnitTest: 'Mixed Unit Test',
    chapters: 'Chapters',
    totalAttempts: 'Total Attempts',
    avgMarks: 'Avg Marks %'
  };

  pastPaperUnitData: TreeNode<pastPaperUnit>[] = [];
  pastPaperMixUnitData: TreeNode<pastPaperMixUnit>[] = [];
  modelPaperUnitData: TreeNode<modelPaperUnit>[] = [];
  modelPaperMixUnitData: TreeNode<modelPaperMixUnit>[] = [];

  private allTestSummaryData: any[] = [];
  constructor(
    private dataSourceBuilder: NbTreeGridDataSourceBuilder<any>,
    private progressService: ProgressService,
  ) {
    //  data sources
    this.dataSourcePPUnit = this.dataSourceBuilder.create(this.pastPaperUnitData);
    this.dataSourcePPMixUnit = this.dataSourceBuilder.create(this.pastPaperMixUnitData);
    this.dataSourceMPUnit = this.dataSourceBuilder.create(this.modelPaperUnitData);
    this.dataSourceMPMixUnit = this.dataSourceBuilder.create(this.modelPaperMixUnitData);
  }

  ngOnInit() {
    this.getUser(); 
  }

  getUser() {
    this.progressService.getUser().subscribe(
      (response: any) => {
        this.UseList = response?.responseData || []; 
        this.filteredOptions = this.myControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const searchTerm = typeof value === 'string' ? value : value?.name;
            return searchTerm ? this._filter(searchTerm) : this.UseList?.slice();
          }),
        );
      },
      (error) => {
        console.error("Error fetching user list:", error);
        this.UseList = []; 

         this.filteredOptions = this.myControl.valueChanges.pipe(
           startWith(''),
           map(value => []) 
         );
      }
    );
  }

  search() {
    let selectedValue: any = this.myControl.value;
    let selectedUser: User | undefined;
    if (typeof selectedValue === 'string') {
      if (this.UseList) {
        selectedUser = this.UseList.find(u => 
          `${u.mobileNo} - ${u.name}` === selectedValue
        );
      }
    } else {
      selectedUser = selectedValue;
    }

    // 3. Validation
    if (!selectedUser || !selectedUser.userId) {
      console.error("No valid user selected. Please pick a user from the list.");
      return;
    }
    this.loading = true;
    this.showData = false;
    this.resetTableData(); 

    this.progressService.getProgress(selectedUser.userId).subscribe(
      (response: any) => {

        if (response && response.student && response.testSummaryData) {

          // --- User Info ---
          this.user = {
            name: response.student.name,
            nic: response.student.nic,
            mobileNo: response.student.mobileNo,
            medium: response.student.medium,
            school: response.student.school?.description, 
            city: response.student.city?.description,  
            stream: response.student.stream?.description,     

          };

          // --- Radio Buttons ---
          if (Array.isArray(response.testSummaryData)) {
            this.radio = response.testSummaryData.map(summary => ({
              id: summary.examCategory.code,    
              value: summary.examCategory.code, 
              label: summary.examCategory.exam  
            }));
            this.allTestSummaryData = response.testSummaryData; 

          } else {
            this.radio = [];
            this.allTestSummaryData = [];
          }

          if (this.radio.length > 0) {
            this.selectedOption = this.radio[0].value; 
          } else {
            this.selectedOption = '';
          }

          this.updateTablesForCategory();

          this.showData = true; 

        } else {
          console.warn("API response missing student or testSummaryData.");
          this.handleSearchError(); 
        }

        this.loading = false; 
      },
      (error) => {
        console.error("Error fetching progress data:", error);
        this.handleSearchError(); 
        this.loading = false;
      }
    );
  }

  onCategoryChange(): void {
    this.updateTablesForCategory();
  }

  private updateTablesForCategory(): void {
    let summaryData: any = {};
    if (this.selectedOption && this.allTestSummaryData.length > 0) {
      summaryData = this.allTestSummaryData.find(s => s.examCategory.code === this.selectedOption);
    }
    summaryData = summaryData || {};

    this.pastPaperUnitData   = this.transformUnitData(summaryData.ppUnitSubjectTestList);
    this.pastPaperMixUnitData  = this.transformMixData(summaryData.ppMixSubjectTestList);
    this.modelPaperUnitData  = this.transformUnitData(summaryData.mpUnitSubjectTestList);
    this.modelPaperMixUnitData = this.transformMixData(summaryData.mpMixSubjectTestList);

    this.dataSourcePPUnit.setData(this.pastPaperUnitData);
    this.dataSourcePPMixUnit.setData(this.pastPaperMixUnitData);
    this.dataSourceMPUnit.setData(this.modelPaperUnitData);
    this.dataSourceMPMixUnit.setData(this.modelPaperMixUnitData);
  }

  private resetTableData() {
      this.pastPaperUnitData = [];
      this.pastPaperMixUnitData = [];
      this.modelPaperUnitData = [];
      this.modelPaperMixUnitData = [];
      this.dataSourcePPUnit?.setData(this.pastPaperUnitData);
      this.dataSourcePPMixUnit?.setData(this.pastPaperMixUnitData);
      this.dataSourceMPUnit?.setData(this.modelPaperUnitData);
      this.dataSourceMPMixUnit?.setData(this.modelPaperMixUnitData);
  }

  private handleSearchError() {
      this.user = {};
      this.radio = [];
      this.selectedOption = '';
      this.allTestSummaryData = [];
      this.resetTableData();
      this.showData = false; 
  }

  private transformUnitData(list: any[]): TreeNode<pastPaperUnit | modelPaperUnit>[] {
    if (!list) {
      return [];
    }

    return list.map(subject => {
      const children: TreeNode<pastPaperUnit | modelPaperUnit>[] = subject.chapterTestList?.map(chapter => {
        return {
          data: {
            subject: chapter.name,
            unitWiseTest: `${chapter.completedTests}/${chapter.totalTests}`,
            quetionCompletion: `${chapter.completedQuestions}/${chapter.totalQuestions}`,
            totalAttempts: chapter.totalAttempts?.toString() || '0',
            avgMarks: chapter.averageMarks?.toFixed(0) || '0',      
            kind: ''
          }
        };
      }) || [];

      return {
        data: {
          subject: subject.subject,
          unitWiseTest: `${subject.completedTests}/${subject.totalTests}`,
          quetionCompletion: `${subject.completedQuestions}/${subject.totalQuestions}`,
          totalAttempts: subject.totalAttempts?.toString() || '0', 
          avgMarks: subject.averageMarks?.toFixed(0) || '0',     
          kind: 'dir'
        },
        children: children
      };
    });
  }

  private transformMixData(list: any[]): TreeNode<pastPaperMixUnit | modelPaperMixUnit>[] {
    if (!list) {
      return [];
    }

    return list.map(subject => {
      const children: TreeNode<pastPaperMixUnit | modelPaperMixUnit>[] = subject.mixTestList?.map((mixTest, index) => {
        const chapterNos = mixTest.chapters?.map(c => c.chapterNo).join(', ') || '';

        return {
          data: {
            subject: mixTest.testName,
            MixedUnitTest: '-',
            chapters: chapterNos,
            totalAttempts: mixTest.totalAttempts?.toString() || '0',
            avgMarks: mixTest.averageMarks?.toFixed(0) || '0',      
            kind: ''
          }
        };
      }) || [];

      return {
        data: {
          subject: subject.subject,
          MixedUnitTest: subject.totalTests?.toString() || '0', 
          chapters: '-',
          totalAttempts: subject.totalAttempts?.toString() || '0', 
          avgMarks: subject.averageMarks?.toFixed(0) || '0',      
          kind: 'dir'
        },
        children: children
      };
    });
  }

  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }

  private _filter(searchTerm: string): User[] {
    if (!this.UseList) {
      return [];
    }

    const filterValue = searchTerm.toLowerCase();

    return this.UseList.filter(option => {
      const nameMatch = option.name && option.name.toLowerCase().includes(filterValue);
      const mobileMatch = option.mobileNo && option.mobileNo.toLowerCase().includes(filterValue);
      return nameMatch || mobileMatch;
    });
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  updateSortPPUnit(sortRequest: NbSortRequest): void {
    this.sortColumnPPUnit = sortRequest.column;
    this.sortDirectionPPUnit = sortRequest.direction;
    this.dataSourcePPUnit.sort(sortRequest); 
  }
  getSortDirectionPPUnit(column: string): NbSortDirection {
    if (this.sortColumnPPUnit === column) { return this.sortDirectionPPUnit; }
    return NbSortDirection.NONE;
  }

  updateSortPPMixUnit(sortRequest: NbSortRequest): void {
    this.sortColumnPPMixUnit = sortRequest.column;
    this.sortDirectionPPMixUnit = sortRequest.direction;
    this.dataSourcePPMixUnit.sort(sortRequest); 
  }
  getSortDirectionPPMixUnit(column: string): NbSortDirection {
    if (this.sortColumnPPMixUnit === column) { return this.sortDirectionPPMixUnit; }
    return NbSortDirection.NONE;
  }

  updateSortMPUnit(sortRequest: NbSortRequest): void {
    this.sortColumnMPUnit = sortRequest.column;
    this.sortDirectionMPUnit = sortRequest.direction;
    this.dataSourceMPUnit.sort(sortRequest);
  }
  getSortDirectionMPUnit(column: string): NbSortDirection {
    if (this.sortColumnMPUnit === column) { return this.sortDirectionMPUnit; }
    return NbSortDirection.NONE;
  }

  updateSortMPMixUnit(sortRequest: NbSortRequest): void {
    this.sortColumnMPMixUnit = sortRequest.column;
    this.sortDirectionMPMixUnit = sortRequest.direction;
    this.dataSourceMPMixUnit.sort(sortRequest); 
  }
  getSortDirectionMPMixUnit(column: string): NbSortDirection {
    if (this.sortColumnMPMixUnit === column) { return this.sortDirectionMPMixUnit; }
    return NbSortDirection.NONE;
  }
}