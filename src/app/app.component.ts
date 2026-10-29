/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { SeoService } from './@core/utils/seo.service';
import { MENU_ITEMS } from './app-menu';
@Component({
  selector: 'ngx-app',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private seoService: SeoService) {
  }
  menu = MENU_ITEMS;
  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.seoService.trackCanonicalChanges();
  }
}
