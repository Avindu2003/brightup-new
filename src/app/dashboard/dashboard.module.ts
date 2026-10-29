import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../@theme/theme.module';
import { Angular2SmartTableModule, } from 'angular2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbSelectModule, NbOptionModule,NbAccordionModule } from '@nebular/theme';
import { DashboardRoutingModule, routedComponents } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NbMenuModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionDashbordComponent } from './subscription-dashbord/subscription-dashbord.component';

@NgModule({
  declarations: [
    DashboardComponent, 
    SubscriptionDashbordComponent,
    ...routedComponents,
  ],
  
  imports: [
    NbAccordionModule,
    CommonModule,
    NbMenuModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    DashboardRoutingModule,
    Angular2SmartTableModule,
    FormsModule,
    NbSelectModule,
    NbOptionModule,
    ReactiveFormsModule,
  ],
  providers: [
    
  ]
})
export class DashboardModule { }
