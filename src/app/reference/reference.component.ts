import { Component } from '@angular/core';

import { MENU_ITEMS } from '../app-menu';


@Component({
  selector: 'reference',
  styleUrls: ['reference.component.scss'],
  template: `<ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>`,
})
export class ReferenceComponent {
   menu = MENU_ITEMS;

}
