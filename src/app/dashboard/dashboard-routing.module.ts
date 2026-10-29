import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { ContentSummaryComponent } from './content-summary/content-summary.component';
import { SubscriptionDashbordComponent } from './subscription-dashbord/subscription-dashbord.component';

const routes: Routes = [{
  path: '',
  component: DashboardComponent,
  children: [
    {
      path: 'content-summary',
      component: ContentSummaryComponent,
    },

      {
      path: 'subscription-dashbord',
      component: SubscriptionDashbordComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {
}
export const routedComponents = [
  ContentSummaryComponent
];