import { Component, Input, Injectable, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';


@Component({
  selector: 'Dashboard-Dipendenti',
  templateUrl: './dashboard-dipendenti.component.html',
  styleUrls: ['./dashboard-dipendenti.component.scss']
})

@Injectable()
export class DashboardDipendentiComponent implements OnInit{

  @Input() storico_dipendente: string = '';

  public people_data: any = [];
  private _url_people: string = "https://site202109.tw.cs.unibo.it/mongo/people";
  private chart_colors: any = [];
  private chartReddito: any = [];
  private chartDanni: any = [];
  private ChartElements: any = [[], [], []];


  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  async ngOnInit(): Promise<any> {
    await this.checkLogIn();
    await this.getInterfaceData(this._url_people).then((data)=>{
      this.people_data = data
    }).catch((error)=>{
      console.log("Promise rejected" + JSON.stringify(error));
    });
    this.ChartsDataConstructor(this.people_data);
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

  Somme(json_path: any, nome: string){
    let revenue: any[]= [0, 0];
    for (let user of json_path){
      if (user['storico_noleggi'] != null){
        for (let noleggio of user['storico_noleggi']){
          if (noleggio.funzionario == nome){
            revenue[0] = parseFloat(revenue[0]) + parseFloat(noleggio.pagamento);
            revenue[1] = parseFloat(revenue[1]) + parseFloat(noleggio.danno);
          }
        }
      }
    }
    return revenue;
  }

  NavigateToStorico(tmp: any): void{
    this.storico_dipendente = tmp;
    tmp = tmp.replaceAll(' ', '_')
    this.router.navigate(['/dashboard/dipendenti/storico/'+tmp]);
  }

  PercentualeBarre(totale_pagamenti: any, danni: any, tipo: boolean){
    danni = parseFloat(danni);
    totale_pagamenti = parseFloat(totale_pagamenti);
    let tot = danni + totale_pagamenti;
    let percentage = 0;
    if (!tipo){
      percentage = (danni/tot) * 100;
    }
    else percentage = (totale_pagamenti/tot) * 100;
    return percentage;
  }

  GetNumeroNoleggi(json_path: any, nome: string){
    let i = 0;
    for (let user of json_path){
      if (user['storico_noleggi'] != null){
        for (let noleggio of user['storico_noleggi']){
          if (noleggio.funzionario == nome){
            i++;
          }
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

  ChartsDataConstructor(json_path: any): void{
    this.RandomChartColorsGenerator(json_path['Dipendenti'].length);

    for (let dipendente of json_path['Dipendenti']){
      this.ChartElements[0].push(dipendente.nome);
      this.ChartElements[1].push(this.Somme(json_path['Clienti'], dipendente.nome)[0]);
      this.ChartElements[2].push(this.Somme(json_path['Clienti'], dipendente.nome)[1]);
      this.chartReddito = this.ChartFiller(this.ChartElements, 'reddito');
      this.chartDanni = this.ChartFiller(this.ChartElements, 'danni');
    }
  }

  ChartFiller(Data: any, tipo: string){
    let Chart = {
      labels: Data[0],
      datasets: [
        {
          borderWidth: 4,
          borderColor: this.chart_colors[0],
          backgroundColor: this.chart_colors[1],
          data: (tipo == 'reddito') ? Data[1] : Data[2]
        }
      ]
    };
    return Chart;
  }

  ChartGetter(tipo: string){
    if (tipo == 'reddito')
      return this.chartReddito;
    else if (tipo == 'danni')
      return this.chartDanni;
  }

}

