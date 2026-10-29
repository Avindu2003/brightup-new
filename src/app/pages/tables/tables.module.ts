import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Angular2SmartTableModule } from 'angular2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { TablesRoutingModule } from './tables-routing.module';

import { TablesComponent } from './tables.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { TreeGridComponent, FsIconComponent } from './tree-grid/tree-grid.component';

@NgModule({
  imports: [
    CommonModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    TablesRoutingModule,
    Angular2SmartTableModule, 
  ],
  declarations: [
    TablesComponent,
    SmartTableComponent,
    TreeGridComponent,
    FsIconComponent,
  ],
})
export class TablesModule { }