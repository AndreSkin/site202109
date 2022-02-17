import { Component, Input, Injectable, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';

@Component({
  selector: 'Dashboard-Inventario',
  templateUrl: './dashboard-inventario.component.html',
  styleUrls: ['./dashboard-inventario.component.scss']
})

@Injectable()
export class DashboardInventarioComponent implements OnInit{

  @Input() storico_ufficio: string = '';

  public offices_data: any = [];
  public storico_data: any = [];
  private _url_uffici: string = "https://site202109.tw.cs.unibo.it/mongo/offices";
  private _url_storico: string = "https://site202109.tw.cs.unibo.it/mongo/storico";
  private chart_colors: any = [];
  private chartGuadagni: any = [];
  private chartNoleggi: any = [];


  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  async ngOnInit(): Promise<any> {
    await this.checkLogIn()
    await this.getInterfaceData(this._url_storico).then((data)=>{
      this.storico_data = data
    }).catch((error)=>{
      console.log("Promise rejected" + JSON.stringify(error));
    });

    await this.getInterfaceData(this._url_uffici).then((data)=>{
      this.offices_data = data
    }).catch((error)=>{
      console.log("Promise rejected" + JSON.stringify(error));
    });

    this.ChartTier(this.offices_data, this.storico_data);
    this.ChartNoleggi(this.offices_data, this.storico_data);

  }

  async checkLogIn(){
    let auth: any = localStorage.getItem('permesso');
    if (parseInt(auth) < 3 || localStorage.length < 1)
    {
      window.location.href = "https://site202109.tw.cs.unibo.it/"
    }
  }

  getInterfaceData(url: string){
    const promise = this.http.get(url).toPromise();
    return promise;
  }


  NavigateToStorico(tmp: any){
    this.storico_ufficio = tmp;
    tmp = tmp.replaceAll(' ', '_')
    this.router.navigate(['/dashboard/inventario/storico/'+tmp]);
  }

  PercentualeBarre(json_path: any, nome: string, tipo: boolean){
    let somma_danni = 0;
    let somma_pagamenti = 0;
    let percentage = 0;


    for (let user of json_path) {
      if (user['storico_noleggi'] != null){
        for (let noleggio of user['storico_noleggi']) {
          if (nome == noleggio.office_id){
            somma_danni = somma_danni + parseFloat(noleggio.danno);
            somma_pagamenti = somma_pagamenti + parseFloat(noleggio.pagamento);
          }
        }
      }
    }

    let tot = somma_danni + somma_pagamenti;

    if (!tipo){
      percentage = (somma_danni/tot) * 100;
    }
    else percentage = (somma_pagamenti/tot) * 100;

    return percentage;
  }

  Somme(json_path: any, nome: string, tipo: boolean){
    let somma_danni = 0;
    let somma_pagamenti = 0;


    for (let user of json_path) {
      if (user['storico_noleggi'] != null){
        for (let noleggio of user['storico_noleggi']) {
          if (nome == noleggio.office_id){
            somma_danni = somma_danni + parseFloat(noleggio.danno);
            somma_pagamenti = somma_pagamenti + parseFloat(noleggio.pagamento);
          }
        }
      }
    }
    if (!tipo)
      return somma_danni;
    else return somma_pagamenti;
  }

  GetNumeroNoleggi(id_url: string, json_path: any){
    let i = 0;
    for (let user of json_path) {
      if (user['storico_noleggi'] != null){
        for (let noleggio of user['storico_noleggi']) {
          if (id_url == noleggio.office_id) i++;
        }
      }
    }
    return i;
  }

  RandomChartColorsGenerator(ListOfItems: any){
    let BackGroundChartColors = [];
    let BorederColors = [];
    let Colors = [];
    for (let i = 0; i < ListOfItems; i++) {
      let SliceColor = [];
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);

      SliceColor.push(r);
      SliceColor.push(g);
      SliceColor.push(b);

      BackGroundChartColors.push('rgba(' + SliceColor + ', 0.6)')
      BorederColors.push('rgba(' + SliceColor + ', 1)')
    }
    Colors.push(BackGroundChartColors)
    Colors.push(BorederColors)
    this.chart_colors = Colors;
  }

  ChartGuadagniFiller(Data: any){
    let Chart = {
      labels: ['Tier 1', 'Tier 2', 'Tier 3',],
      datasets: [
        {
          borderWidth: 4,
          borderColor: ["rgba(241, 196, 15, 0.6)", "rgba(52, 152, 219, 0.6)", "rgba(46, 204, 113, 0.6)"],
          backgroundColor: ["rgba(241, 196, 15, 1)", "rgba(52, 152, 219, 1)", "rgba(46, 204, 113, 1)"],
          data: [Data[0], Data[1],  Data[2]]
        }
      ]
    };
    return Chart;
  }

  ChartNoleggiFiller(Data: any){
    let Chart = {
      labels: Data[0],
      datasets: [
        {
          label: '',
          borderWidth: 4,
          borderColor: this.chart_colors[0],
          backgroundColor: this.chart_colors[1],
          data: Data[1]
        },
      ]
    };
    return Chart;
  }


  ChartTier(offices_path: any, storico_path: any){
    let tier: any = [[], [], []];
    let guadagni_tier: any = [0, 0, 0];

    for (let ufficio of offices_path){
      tier[ufficio.tier - 1].push(ufficio.nome);
    }

    for (let i = 0; i < tier.length; i++){
      for (let element of tier[i]){
        for (let user of storico_path){
          if (user['storico_noleggi'] != null){
            for (let noleggio of user['storico_noleggi']){
              if (element == noleggio.office_id) guadagni_tier[i] = guadagni_tier[i] + parseFloat(noleggio.pagamento);
            }
          }
        }
      }
    }

    this.RandomChartColorsGenerator(tier.length);
    this.chartGuadagni = this.ChartGuadagniFiller(guadagni_tier);
  }

  ChartNoleggi(uffici_path: any, storico_path: any){
    let buffer: any = [[], []];
    for (let ufficio of uffici_path){
      buffer[0].push(ufficio.nome);
      buffer[1].push(this.GetNumeroNoleggi(ufficio.nome ,storico_path));
    }
    this.RandomChartColorsGenerator(uffici_path.length);
    this.chartNoleggi = this.ChartNoleggiFiller(buffer);
  }

  ChartGuadagniGetter(){
    return this.chartGuadagni;
  }

  ChartNoleggiGetter(){
    return this.chartNoleggi;
  }

  GetStatus(storico_path: any, nome_ufficio: string){
    let current_year: any = new Date().getFullYear();
    let current_month: any = new Date().getMonth() + 1;
    let current_day: any = new Date().getDate();

    current_year = current_year.toString();
    if (current_month < 10) current_month = '0' + current_month;
    if (current_day < 10) current_day = '0' + current_day;
    current_month = current_month.toString();
    current_day = current_day.toString();

    let current_date = current_year + '-' + current_month + '-' + current_day;

    for (let user of storico_path){
      if (user['storico_noleggi'] != null){
        for (let noleggio of user['storico_noleggi']){
          for (let ufficio of this.offices_data){
            if (ufficio.nome == nome_ufficio){
              for (let date of ufficio['occupato']){
                if ((moment(current_date).isAfter(date.from) && moment(current_date).isBefore(date.to)) || moment(current_date).isSame(date.from) || moment(current_date).isSame(date.to)){
                  return 'danger';
                }
              }
            }
          }
        }
      }
    }
    return 'success';
  }
}

