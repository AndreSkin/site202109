import { INavData } from '@coreui/angular';

export const navItems: INavData[] = [
  {
    name: 'Front Office',
    url: '/frontoffice',
    iconComponent: { name: 'cil-basket' },
  },
  {
    name: 'Back Office',
    url: '/backoffice',
    iconComponent: { name: 'cil-notes' },
  },
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    children: [
      {
        name: 'Clienti',
        url: '/dashboard/clienti'
      },
      {
        name: 'Dipendenti',
        url: '/dashboard/dipendenti'
      },
      {
        name: 'Inventario',
        url: '/dashboard/inventario'
      },
      {
        name: 'Noleggio',
        url: '/dashboard/noleggio'
      }
    ]
  }
]
