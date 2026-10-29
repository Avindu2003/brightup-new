import { NgModule } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ReferenceComponent } from './reference.component';
import { Angular2SmartTableModule, } from 'angular2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbSelectModule, NbOptionModule,NbCheckboxModule, NbButtonModule, NbWindowModule } from '@nebular/theme';
import { ReferenceRoutingModule, routedComponents } from './reference-routing.module';
import { NbMenuModule } from '@nebular/theme';
import { ThemeModule } from "../@theme/theme.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SchoolComponent } from './school/school.component';
import { StreamComponent } from './stream/stream.component';
import { ChaptersComponent } from './chapters/chapters.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SecurityQuestionComponent } from './security-question/security-question.component';
import { SystemUserComponent } from './system-user/system-user.component';
import { ProgressComponent, FsIconComponent  } from './progress/progress.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NbEvaIconsModule } from '@nebular/eva-icons';

@NgModule({
  declarations: [
    ReferenceComponent,
    ...routedComponents,
    StreamComponent,
    SchoolComponent,
    SecurityQuestionComponent,
    ChaptersComponent,
    SystemUserComponent,
    ProgressComponent,
    FsIconComponent,
  ],
  imports: [
    CommonModule,
    NbMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbEvaIconsModule,
    ReactiveFormsModule, 
    ReferenceRoutingModule,
    Angular2SmartTableModule,
    FormsModule,
    NbSelectModule,
    NbButtonModule,
    NbWindowModule.forChild(),
    NbOptionModule,
    ThemeModule,
    NbCheckboxModule,
    MatSlideToggleModule
  ],
  providers: [
  ]
})
export class ReferenceModule { }
