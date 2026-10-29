import { Component } from '@angular/core';

import { MENU_ITEMS } from '../app-menu';

@Component({
  selector: 'notifications',
  styleUrls: ['notifications.component.scss'],
  template: `<ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>`,
})
export class NotificationsComponent {

  menu = MENU_ITEMS;
}
