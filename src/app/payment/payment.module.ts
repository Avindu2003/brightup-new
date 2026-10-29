import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaymentComponent } from './payment.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbMenuModule, NbCardModule, NbTreeGridModule, NbIconModule, NbInputModule, NbSelectModule, NbButtonModule, NbWindowModule, NbOptionModule, NbCheckboxModule, NbFormFieldModule, NbPrefixDirective } from '@nebular/theme';
import { Angular2SmartTableModule, } from 'angular2-smart-table';
import { ThemeModule } from '../@theme/theme.module';
import { PaymentRoutingModule,routedComponents } from './payment-routing.module';
import { PromosComponent } from './promos/promos.component';
import { NbEvaIconsModule } from '@nebular/eva-icons';



@NgModule({
  declarations: [
    PaymentComponent,
    ...routedComponents,
    PromosComponent
  ],
  imports: [
    CommonModule,
    NbMenuModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbEvaIconsModule,
    NbInputModule,
    NbFormFieldModule,
    ReactiveFormsModule, 
    Angular2SmartTableModule,
    FormsModule,
    NbSelectModule,
    NbButtonModule,
    NbWindowModule.forChild(),
    NbOptionModule,
    ThemeModule,
    NbCheckboxModule,
    PaymentRoutingModule
  ],
  providers: [
  ]
})
export class PaymentModule { }
