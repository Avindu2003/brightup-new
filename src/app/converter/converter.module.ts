import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConverterComponent } from './converter.component';
import { ConverterRoutingModule, routedComponents } from './converter-routing.module';
import { OcrViewComponent } from './ocr-view/ocr-view.component';
import { PaperComponent } from './paper/paper.component';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from '../@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [ConverterComponent],
  imports: [
    CommonModule,
    ConverterRoutingModule,
    OcrViewComponent,
    NbMenuModule,
    PaperComponent,
    ThemeModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class ConverterModule { }
