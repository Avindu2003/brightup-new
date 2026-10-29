import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import { OcrViewComponent } from './ocr-view/ocr-view.component';
import { ShortNotesComponent } from './short-notes/short-notes.component';
import { ContentUploadsComponent } from './content-uploads.component';

const routes: Routes = [{
  path: '',
  component: ContentUploadsComponent,
  children: [
    {
      path: 'short-notes',
      component: ShortNotesComponent,
    },
    // {
    //   path: 'ocr-view',
    //   component: OcrViewComponent,
    // },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConverterRoutingModule {
}
export const routedComponents = [
  ShortNotesComponent,
];