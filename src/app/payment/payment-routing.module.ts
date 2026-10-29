import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundComponent } from '../pages/miscellaneous/not-found/not-found.component';
import { SubscriptionPackageComponent } from './subscription-package/subscription-package.component';
import { PaymentComponent } from './payment.component';
import { PackageActivationComponent } from './package-activation/package-activation.component';
import { PromosComponent } from './promos/promos.component';

const routes: Routes = [{
  path: '',
  component: PaymentComponent,
  children: [
    {
      path: 'subscription-package',
      component: SubscriptionPackageComponent,
    },
    {
      path: 'promos',
      component: PromosComponent,
    },
    {
      path: 'promos',
      component: PromosComponent,
    },
    {
      path: 'package-activation',
      component: PackageActivationComponent,
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
export class PaymentRoutingModule {
}
export const routedComponents = [
  SubscriptionPackageComponent,
  PackageActivationComponent
];
