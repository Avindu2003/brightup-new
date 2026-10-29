import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { ExamCategoryComponent } from './exam-category/exam-category.component';
import { SubjectComponent } from './subject/subject.component';
import { ReferenceComponent } from './reference.component';
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';
import { SecurityQuestionComponent } from './security-question/security-question.component';
import { SchoolComponent } from './school/school.component';
import { StreamComponent } from './stream/stream.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { SystemUserComponent } from './system-user/system-user.component';
import { ProgressComponent } from './progress/progress.component';
const routes: Routes = [{
  path: '',
  component: ReferenceComponent,
  children: [
    {
      path: 'exam-category',
      component: ExamCategoryComponent,
    },
    {
      path: 'progress',
      component: ProgressComponent,
    },
    {
      path: 'subject',
      component: SubjectComponent,
    },
    {
      path: 'school',
      component: SchoolComponent,
    },
    {
      path: 'stream',
      component: StreamComponent,
    },
    {
      path: 'security-question',
      component: SecurityQuestionComponent,
    },
    {
      path: 'chapters',
      component: ChaptersComponent,
    },
    {
      path: 'system-user',
      component: SystemUserComponent,
    },
    {
      path: '',
      redirectTo: 'exam-category',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReferenceRoutingModule {
}
export const routedComponents = [
  ExamCategoryComponent,
  SubjectComponent,
  SecurityQuestionComponent
];