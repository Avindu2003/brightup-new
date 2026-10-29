import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../@theme/theme.module';
import { Angular2SmartTableModule, } from 'angular2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbSelectModule, NbOptionModule,NbAccordionModule } from '@nebular/theme';
import { StatisticsRoutingModule, routedComponents } from './statistics-routing.module';
import { StatisticsComponent } from './statistics.component';
import { NbMenuModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    StatisticsComponent, 
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
    StatisticsRoutingModule,
    Angular2SmartTableModule,
    FormsModule,
    NbSelectModule,
    NbOptionModule,
    ReactiveFormsModule,
  ],
  providers: [
    
  ]
})
export class StatisticsModule { }
