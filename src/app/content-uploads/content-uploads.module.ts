import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentUploadsComponent } from './content-uploads.component';
import { ConverterRoutingModule, routedComponents } from './content-uploads-routing.module';
import { ShortNotesComponent } from './short-notes/short-notes.component';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { NbCardModule, NbButtonModule, NbInputModule } from '@nebular/theme'; 
import { Angular2SmartTableModule } from 'angular2-smart-table'; 
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ContentUploadsComponent,
    ShortNotesComponent
  ],
  imports: [
    CommonModule,
    ConverterRoutingModule,
    NbMenuModule,
    ThemeModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
    Angular2SmartTableModule,
    NbCardModule, 
    NbButtonModule, 
    NbInputModule

  ]
})
export class ConverterModule { }
