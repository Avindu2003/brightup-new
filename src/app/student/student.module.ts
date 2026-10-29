import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceResetComponent } from './device-reset/device-reset.component';
import { ThemeModule } from '../@theme/theme.module';
import { Angular2SmartTableModule, } from 'angular2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbSelectModule, NbOptionModule, NbButtonModule } from '@nebular/theme';
import { StudentRoutingModule, routedComponents } from './student-routing.module';
import { StudentComponent } from './student.component';
import { NbMenuModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationSummaryComponent } from './registration-summary/registration-summary.component';
import { RegistrationSummaryService } from './registration-summary/registration-summary.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    StudentComponent,
    ...routedComponents,
    RegistrationSummaryComponent,
  ],
  imports: [
    CommonModule,
    NbMenuModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    StudentRoutingModule,
    Angular2SmartTableModule,
    RouterModule,
    NbMenuModule,
    FormsModule,
    NbSelectModule,
    NbOptionModule,
    ReactiveFormsModule,
    NbButtonModule
  ],
  providers: [
    RegistrationSummaryService
  ]
})
export class StudentModule { }
