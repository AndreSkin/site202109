import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-widgets-dropdown',
  templateUrl: './widgets-dropdown.component.html',
  styleUrls: ['./widgets-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class WidgetsDropdownComponent implements OnInit, AfterContentInit {

  public people_data: any = [];
  public offices_data: any = [];
  private _url_people: string = "https://site202109.tw.cs.unibo.it/mongo/people";
  private _url_uffici: string = "https://site202109.tw.cs.unibo.it/mongo/offices";
  public numero_elementi: Array<any> = [0,0,0,0];

  private Widget1: Array<any> = [[],[]];
  private Widget2: Array<any> = [[],[]];
  private Widget3: Array<any> = [[],[]];
  private Widget4: Array<any> = [[],[]];
  private Widgets: Array<any> = [this.Widget1, this.Widget2, this.Widget3, this.Widget4];


  constructor(
    private http: HttpClient,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<any> {
    this.people_data = await this.getInterfaceData(this._url_people);
    this.offices_data = await this.getInterfaceData(this._url_uffici)
    this.GetNoleggiClienti();
    this.GetNoleggiDipendenti();
    this.GetGuadagniUffici();
    this.GetGuadagniNoleggi();
    this.GetNumeri();
    this.initWidgets();
    this.setOptions();
    this.setData();
  }

  getInterfaceData(url: string){
    const promise = this.http.get(url).toPromise();
    return promise;
  }

  GetNumeri(){
    this.numero_elementi[0] = this.GetNumeroClienti();
    this.numero_elementi[1] = this.GetNumeroDipendenti();
    this.numero_elementi[2] = this.GetNumeroInventario();
    this.numero_elementi[3] = this.GetNumeroNoleggi();
  }

  GetNumeroClienti(){
    return this.people_data['Clienti'].length;
  }

  GetNumeroDipendenti(){
    return this.people_data['Dipendenti'].length;
  }

  GetNumeroInventario(){
    return this.offices_data.length;
  }

  GetNumeroNoleggi(){
    let i = 0;
    for (let user of this.people_data['Clienti']){
      for (let noleggio of user['storico_noleggi']){
        i++;
      }
    }
    return i;
  }

  NavigateToClienti(){
    this.router.navigate(['/dashboard/clienti/']);
  }
  NavigateToDipendenti(){
    this.router.navigate(['/dashboard/dipendenti/']);
  }
  NavigateToInventario(){
    this.router.navigate(['/dashboard/inventario/']);
  }
  NavigateToNoleggio(){
    this.router.navigate(['/dashboard/noleggio/']);
  }

  async GetNoleggiClienti(){
    let buffer: Array<any> = [[],[]];
    for (let user of this.people_data['Clienti']){
      buffer[0].push(user.nome);
      buffer[1].push(user['storico_noleggi'].length);
    }
    this.Widget1[0] = buffer[0];
    this.Widget1[1] = buffer[1];
  }

  async GetNoleggiDipendenti(){
    let buffer: Array<any> = [[],[]];
    for (let dipendente of this.people_data['Dipendenti']){
      let i = 0;
      for (let user of this.people_data['Clienti']){
        if (user['storico_noleggi'] != null){
          for (let noleggio of user['storico_noleggi']){
            if (noleggio.funzionario == dipendente.nome){
              i++;
            }
          }
        }
      }
      buffer[0].push(dipendente.nome);
      buffer[1].push(i);
    }
    this.Widget2[0] = buffer[0];
    this.Widget2[1] = buffer[1];
  }

  GetGuadagniUffici(){
    let buffer: Array<any> = [[],[]];
    for (let ufficio of this.offices_data){
      let somma_pagamenti = 0;
      for (let user of this.people_data['Clienti']) {
        if (user['storico_noleggi'] != null){
          for (let noleggio of user['storico_noleggi']) {
            if (ufficio.nome == noleggio.office_id){
              somma_pagamenti = somma_pagamenti + parseFloat(noleggio.pagamento);
            }
          }
        }
      }
      buffer[0].push(ufficio.nome);
      buffer[1].push(somma_pagamenti);
    }
    this.Widget3[0] = buffer[0];
    this.Widget3[1] = buffer[1];
  }

  GetGuadagniNoleggi(){
    let buffer: Array<any> = [[],[]];
    for (let user of this.people_data['Clienti']) {
      if (user['storico_noleggi'] != null){
        for (let noleggio of user['storico_noleggi']) {
            buffer[0].push(noleggio.office_id + ': ' + user.nome);
            buffer[1].push(noleggio.pagamento);
            this.Widget4[0] = buffer[0];
            this.Widget4[1] = buffer[1];
        }
      }
    }
  }


  public data: any[] = [];
  public options: any[] = [];
  private datasets: Array<any> = [[], [], [], []]

  initWidgets(){
    this.datasets = [
      [{
        label: ['Numero Noleggi'],
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: this.Widget1[1],
        barPercentage: 0.7
      }], [{
        label: ['Numero Noleggi'],
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: this.Widget2[1],
        barPercentage: 0.7
      }], [{
        label: 'Totale Guadagno Ufficio',
        backgroundColor: 'rgba(255,255,255,.2)',
        data: this.Widget3[1],
        barPercentage: 0.7
      }], [{
        label: 'Pagamento Noleggio',
        backgroundColor: 'rgba(255,255,255,.2)',
        borderColor: 'rgba(255,255,255,.55)',
        data: this.Widget4[1],
        barPercentage: 0.7
      }]
    ];
  }

  optionsDefault = {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: false,
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  };

  ngAfterContentInit(): void {
    this.changeDetectorRef.detectChanges();

  }

  setData() {
    for (let i = 0; i < 4; i++) {
      this.data[i] = {
        labels: this.Widgets[i][0],
        datasets: this.datasets[i]
      };
    }
  }

  setOptions() {
      const options = JSON.parse(JSON.stringify(this.optionsDefault));
      options.scales.y.min = 0;
      options.scales.y.max = undefined;
      options.elements = {};
      this.options.push(options);
  }
}

