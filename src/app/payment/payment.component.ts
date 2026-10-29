import { Component } from '@angular/core';

import { MENU_ITEMS } from '../app-menu';

@Component({
  selector: 'payment',
  styleUrls: ['payment.component.scss'],
  template: `<ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>`,
})
export class PaymentComponent {
  menu = MENU_ITEMS;

}
