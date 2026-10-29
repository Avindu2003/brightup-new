import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
// import { StatisticsComponent } from './statistics.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { PackageHistotyComponent } from './package-histoty/package-histoty.component';
import { EducationalDetailsComponent } from './educational-details/educational-details.component';
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';
import { StatisticsComponent } from './statistics.component';
// import { DeviceResetComponent } from '../student/device-reset/device-reset.component';
const routes: Routes = [{
  path: '',
  component: StatisticsComponent,
  children: [
    {
      path: 'personal-details',
      component: PersonalDetailsComponent,
    },
    {
      path: 'package-histoty',
      component: PackageHistotyComponent,
    },
    {
      path: 'educational-details',
      component: EducationalDetailsComponent,
    },
    {
      path: '',
      redirectTo: 'personal-details',
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
export class StatisticsRoutingModule {
}
export const routedComponents = [
  PersonalDetailsComponent,
  PackageHistotyComponent,
  EducationalDetailsComponent,
];