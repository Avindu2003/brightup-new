import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'angular2-smart-table';
import { RegistrationSummaryService } from './registration-summary.service';

@Component({
  selector: 'ngx-registration-summary',
  templateUrl: './registration-summary.component.html',
  styleUrls: ['./registration-summary.component.scss']
})
export class RegistrationSummaryComponent {
  Form: FormGroup;
  dialogRef: any;
  errorMessage: any;
  datevalidationerror: any;
  loading: boolean = false;
  isChanged: boolean = false;
  totalRegistrations: number;
  completeRegistrations: number;
  incompleteRegistrations: number;
  alCount: number;
  bitCount: number;
  olCount: number;

  source: LocalDataSource = new LocalDataSource();

  constructor(
    private registrationSummaryService: RegistrationSummaryService
  ) { }

  ngOnInit() {
    this.initForm();
    this.Form.valueChanges.subscribe(() => {
      this.errorMessage = null;
    });
  }


  getSummary() {
    this.loading = true;
    const fromDate = this.Form.get('fromdate').value;
    const toDate = this.Form.get('todate').value;
    this.registrationSummaryService.getSummary(fromDate, toDate)
      .subscribe((response: any) => {
        const data = response.responseData;

        this.totalRegistrations = data.totalRegistrationCount;
        this.completeRegistrations = data.completeRegistrationCount;
        this.incompleteRegistrations = data.incompleteRegistrationCount;
        this.alCount = data.alStudentCount;
        this.olCount = data.olStudentCount;
        this.bitCount = data.bitStudentCount;
        this.loading = false;

      }, error => {
        this.loading = false;
      });
  }

  private initForm() {
    this.Form = new FormGroup({
      'fromdate': new FormControl(this.today, [Validators.required]),
      'todate': new FormControl(this.today, [Validators.required])
    });
    this.getSummary();
  }

  today = new Date().toISOString().split('T')[0];

  get minToDate() {
    return this.Form.get('fromdate').value || this.today;
  }

  checkDateValidity() {
    const fromdate = this.Form.get('fromdate').value;
    const todate = this.Form.get('todate').value;


    if (!fromdate || !todate || fromdate <= todate) {
      this.datevalidationerror = null;
      this.getSummary();

    } else {
      this.datevalidationerror = "To date should be greater than or equal to From date.";
    }
  }


}
