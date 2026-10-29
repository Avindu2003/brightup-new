import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../@theme/theme.module';
import { Angular2SmartTableModule, } from 'angular2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbSelectModule, NbOptionModule,NbAccordionModule, NbCheckboxModule, NbButtonModule, NbWindowModule  } from '@nebular/theme';
import { NotificationsRoutingModule, routedComponents } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { NbMenuModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NotificationsComponent, 
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
    NotificationsRoutingModule,
    Angular2SmartTableModule,
    FormsModule,
    NbSelectModule,
    NbOptionModule,
    ReactiveFormsModule,
  ],
  providers: [
    
  ]
})
export class NotificationsModule { }
