import { Component, Input, Injectable, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';


@Component({
  selector: 'Dashboard-Storico-Dipendenti',
  templateUrl: './storico-dipendenti.component.html',
  styleUrls: ['./storico-dipendenti.component.scss']
})

@Injectable()
export class StoricoDipendentiComponent implements OnInit{

  @Input() storico_ufficio: string = '';

  nome_dipendente: string = '';

  public storico_data: any = [];
  public offices_data: any = [];
  private _url_storico: string = "https://site202109.tw.cs.unibo.it/mongo/storico";
  private _url_uffici: string = "https://site202109.tw.cs.unibo.it/mongo/offices";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { };

  async ngOnInit(): Promise<any> {
    await this.checkLogIn();
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
    this.GetNomeUtente();
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

  GetNomeUtente(){
    let tmp: any = this.router.url.split('/');
    tmp[4] = tmp[4].replaceAll('_', ' ')
    this.nome_dipendente = tmp[4];
  }
  VerificaStorico(id_url: string, id_object: string){
    if(id_url == id_object) return true;
    return false;
  }

  PercentualeBarre(danno: any, pagamento: any, tipo: boolean){
    danno = parseFloat(danno);
    pagamento = parseFloat(pagamento);
    let tot = danno + pagamento;
    let percentage = 0;
    if (!tipo){
      percentage = (danno/tot) * 100;
    }
    else percentage = (pagamento/tot) * 100;
    return percentage;
  }

  GetIndirizzoNoleggio(id_url: string, json_path: any){
    for (let element of json_path){
      if(id_url == element.nome) return element.indirizzo;
    }
  }

  GetImmagine(people_path: any, nome_ufficio: string){
    for (let noleggio of people_path){
      for (let ufficio of this.offices_data){
        if (ufficio.nome == nome_ufficio){
          return ufficio.img;
        }
      }
    }
  }

  GetStatus(people_path: any, nome_ufficio: string){
    let current_year: any = new Date().getFullYear();
    let current_month: any = new Date().getMonth() + 1;
    let current_day: any = new Date().getDate();

    current_year = current_year.toString();
    if (current_month < 10) current_month = '0' + current_month;
    if (current_day < 10) current_day = '0' + current_day;
    current_month = current_month.toString();
    current_day = current_day.toString();

    let current_date = current_year + '-' + current_month + '-' + current_day;

    for (let noleggio of people_path){
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
    return 'success';
  }
}

