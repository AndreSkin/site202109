import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardComponent } from './dashboard.component';
import { DashboardDipendentiComponent } from './Dipendenti/dashboard-dipendenti.component';
import { DashboardClientiComponent } from './Clienti/dashboard-clienti.component';
import { StoricoClientiComponent } from './Clienti/storico/storico-clienti.component';
import { DashboardInventarioComponent } from './Inventario/dashboard-inventario.component';
import { DashboardNoleggioComponent } from './Noleggio/dashboard-noleggio.component';

import {
  AvatarModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  FormModule,
  GridModule,
  NavModule,
  ProgressModule,
  TableModule,
  TabsModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { ChartjsModule } from '@coreui/angular-chartjs';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { WidgetsModule } from '../widgets/widgets.module';
import { StoricoUfficiComponent } from './Inventario/storico/storico-uffici.component';
import { StoricoDipendentiComponent } from './Dipendenti/storico/storico-dipendenti.component';

@NgModule({
  imports: [
    DashboardRoutingModule,
    CardModule,
    NavModule,
    IconModule,
    TabsModule,
    CommonModule,
    GridModule,
    ProgressModule,
    ReactiveFormsModule,
    ButtonModule,
    FormModule,
    ButtonModule,
    ButtonGroupModule,
    ChartjsModule,
    AvatarModule,
    TableModule,
    WidgetsModule,
  ],
  declarations: [
    DashboardComponent,
    DashboardDipendentiComponent,
    DashboardClientiComponent,
    DashboardInventarioComponent,
    DashboardNoleggioComponent,
    StoricoClientiComponent,
    StoricoUfficiComponent,
    StoricoDipendentiComponent
  ]
})
export class DashboardModule {}
