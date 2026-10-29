import { Component } from '@angular/core';

import { MENU_ITEMS } from '../app-menu';

@Component({
  selector: 'student',
  styleUrls: ['student.component.scss'],
  template: `<ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>` ,
})
export class StudentComponent {

  menu = MENU_ITEMS;
}
// < <ngx-one-column-layout>
//       <nb-menu [items]="menu"></nb-menu>
//       <router-outlet></router-outlet>
//     </ngx-one-column-layout>
// <router-outlet></router-outlet>