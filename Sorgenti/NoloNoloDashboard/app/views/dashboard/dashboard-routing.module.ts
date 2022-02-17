import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DashboardDipendentiComponent } from './Dipendenti/dashboard-dipendenti.component';
import { StoricoDipendentiComponent } from './Dipendenti/storico/storico-dipendenti.component'
import { DashboardClientiComponent } from './Clienti/dashboard-clienti.component';
import { StoricoClientiComponent } from './Clienti/storico/storico-clienti.component';
import { DashboardInventarioComponent } from './Inventario/dashboard-inventario.component';
import { DashboardNoleggioComponent } from './Noleggio/dashboard-noleggio.component';
import { StoricoUfficiComponent } from './Inventario/storico/storico-uffici.component'

const routes: Routes = [
  {
    path: '',
    data: {
      title: $localize`Dashboard`
    },
    children: [
      {
        path: '',
        redirectTo: 'dashboard'
      },
      {
        path: '',
        component: DashboardComponent,
        data: {
          title: ''
       }
      },
      {
        path: 'dipendenti',
        component: DashboardDipendentiComponent,
        data: {
          title: 'Dipendenti'
        }
      },
      {
        path: 'dipendenti/storico/:nome_dipendente',
        component: StoricoDipendentiComponent,
        data: {
          title: 'Dipendenti / Storico'
        }
      },
      {
        path: 'clienti',
        component: DashboardClientiComponent,
        data: {
          title: 'Clienti'
        }
      },
      {
        path: 'clienti/storico/:nome_utente',
        component: StoricoClientiComponent,
        data: {
          title: 'Clienti / Storico'
        }
      },
      {
        path: 'inventario',
        component: DashboardInventarioComponent,
        data: {
          title: 'Inventario'
        }
      },
      {
        path: 'inventario/storico/:nome_ufficio',
        component: StoricoUfficiComponent,
        data: {
          title: 'Inventario / Storico'
        }
      },
      {
        path: 'noleggio',
        component: DashboardNoleggioComponent,
        data: {
          title: 'Noleggio'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
