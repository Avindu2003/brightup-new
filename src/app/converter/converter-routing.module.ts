import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { OcrViewComponent } from './ocr-view/ocr-view.component';
import { PaperComponent } from './paper/paper.component';
import { ConverterComponent } from './converter.component';

const routes: Routes = [{
  path: '',
  component: ConverterComponent,
  children: [
    {
      path: 'paper',
      component: PaperComponent,
    },
    {
      path: 'ocr-view',
      component: OcrViewComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConverterRoutingModule {
}
export const routedComponents = [
  OcrViewComponent,
  ConverterComponent,
  PaperComponent
];