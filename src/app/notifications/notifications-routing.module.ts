import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotificationsComponent } from './notifications.component';
import { PushNotificationsComponent } from './push-notifications/push-notifications.component';
import { SmsNotificationsComponent } from './sms-notifications/sms-notifications.component';


const routes: Routes = [{
  path: '',
  component: NotificationsComponent,
  children: [
    {
      path: 'push-notifications',
      component: PushNotificationsComponent,
    },
    {
      path: 'sms-notifications',
      component: SmsNotificationsComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotificationsRoutingModule {
}
export const routedComponents = [
  SmsNotificationsComponent,
  PushNotificationsComponent
];