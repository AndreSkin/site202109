import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ButtonModule,
  CardModule,
  DropdownModule,
  GridModule,
  ProgressModule,
  SharedModule,
  WidgetModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';


import { WidgetsDropdownComponent } from './widgets-dropdown/widgets-dropdown.component';

@NgModule({
  declarations: [
    WidgetsDropdownComponent,
  ],
  imports: [
    CommonModule,
    GridModule,
    WidgetModule,
    IconModule,
    DropdownModule,
    SharedModule,
    ButtonModule,
    CardModule,
    ProgressModule,
    ChartjsModule
  ],
  exports: [
    WidgetsDropdownComponent
  ]
})
export class WidgetsModule {
}
