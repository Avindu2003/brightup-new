import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { StudentComponent } from './student.component';
import { DeviceResetComponent } from './device-reset/device-reset.component';
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';
import { RegistrationSummaryComponent } from './registration-summary/registration-summary.component';
const routes: Routes = [{
  path: '',
  component: StudentComponent,
  children: [
    {
      path: 'device-reset',
      component: DeviceResetComponent,
    },
    {
      path: 'registration-summary',
      component: RegistrationSummaryComponent,
    },
    { 
      path: '', 
      redirectTo: 'device-reset', 
      pathMatch: 'full' 
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
export class StudentRoutingModule {
}
export const routedComponents = [
  DeviceResetComponent
];