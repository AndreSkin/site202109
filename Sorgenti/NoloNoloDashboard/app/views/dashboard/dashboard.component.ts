import { Component, OnInit } from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { getStyle, hexToRgba } from '@coreui/utils/src';




@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public people_data: any = [];
  private _url_people: string = "https://site202109.tw.cs.unibo.it/mongo/people";
  public chart: Array<any> = [[], [], []]
  private Visualization: string = 'Month';
  private selected_year: any = new Date().getFullYear();
  private selected_month: any = new Date().getMonth();
  public displayed_month: Array<any> = [[], []];
  private setMonth_Year_Value: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    ) { }
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  async ngOnInit(): Promise<any> {
    await this.checkLogIn();
    await this.getInterfaceData(this._url_people).then((data)=>{
      this.people_data = data
    }).catch((error)=>{
      console.log("Promise rejected" + JSON.stringify(error));
    });
    await this.GetMonth()
    this.initMainChart(this.Visualization, this.displayed_month[0], this.selected_year);
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

  GetYear(){
    return this.selected_year;
  }

  async GetMonth(){
    let current_month:Array<any> = [[], []];
    current_month[0] = this.selected_month;
    if (current_month[0] == '0') current_month[1] = 'Gennaio';
    if (current_month[0] == '1') current_month[1] = 'Febbraio';
    if (current_month[0] == '2') current_month[1] = 'Marzo';
    if (current_month[0] == '3') current_month[1] = 'Aprile';
    if (current_month[0] == '4') current_month[1] = 'Maggio';
    if (current_month[0] == '5') current_month[1] = 'Giugno';
    if (current_month[0] == '6') current_month[1] = 'Luglio';
    if (current_month[0] == '7') current_month[1] = 'Agosto';
    if (current_month[0] == '8') current_month[1] = 'Settembre';
    if (current_month[0] == '9') current_month[1] = 'Ottobre';
    if (current_month[0] == '10') current_month[1] = 'Novembre';
    if (current_month[0] == '11') current_month[1] = 'Dicembre';
    this.displayed_month = current_month;
  }


  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    if (value == 'Year'){
      this.displayed_month[1] = '';
      this.setMonth_Year_Value = true;
    }
    else if (value == 'Month'){
      this.GetMonth();
      this.setMonth_Year_Value = false;
    }
    this.initMainChart(value, this.displayed_month[0], this.selected_year);
    this.initMainChart(this.Visualization, this.displayed_month[0], this.selected_year);
  }

  setMonth_Year(type: boolean){
    if (this.setMonth_Year_Value == false){
      if (type == true && this.selected_month < 11) this.selected_month++;
      else if (type == false && this.selected_month > 0) this.selected_month--;
      this.GetMonth();
      this.initMainChart(this.Visualization, this.selected_month, this.selected_year);
    }
    else if (this.setMonth_Year_Value == true){
      if (type == true) this.selected_year++;
      else if (type == false) this.selected_year--;;
      this.initMainChart(this.Visualization, this.selected_month, this.selected_year);
    }
  }

  MonthLabels(month: any, year: any){
    let labels: Array<any> = [[], [], []];
    let daysInMonth = new Date(year, month+1, 0).getDate();

    month++;
    let parsed_month: string = '';
    if (month < 10) parsed_month = '0' + month;
    else parsed_month = month;

    labels[0].push(year.toString());
    labels[1].push(parsed_month.toString());

    for (let day = 1; day <= daysInMonth; day++){
      if(day < 10) labels[2].push('0' + day.toString());
      else labels[2].push(day.toString());
    }
    return labels;
  }



  initMainChart(period: string, in_month: any, in_year: any) {
    this.Visualization = period;
    let date = this.MonthLabels(in_month, in_year);

    let array_lables: Array<string> = [];
    for (let day=0; day < date[2].length; day++){
      array_lables.push(date[0] + '-' + date[1] + '-' + date[2][day]);
    }

    period === 'Month' ? date[2].length : 12;
    let Data;

    if (period == 'Month'){
      let tmp_Data: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let user of this.people_data['Clienti']){
        for (let noleggio of user['storico_noleggi']){
          for (let day=0; day < date[2].length; day++){
            if (noleggio.inizio == array_lables[day]){
              tmp_Data[date[2][day]-1]++;
            }
          }
        }
      }
      Data = tmp_Data;
    }
    else{
      let tmp_month: Array<any> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (let user of this.people_data['Clienti']){
        for (let noleggio of user['storico_noleggi']){
          for (let month = 1; month < 13; month++){
            for (let day=0; day < date[2].length; day++) {
              let comparator;
              let parsed_month;
              if (month < 10) parsed_month = '0' + month;
              else parsed_month = month.toString();
              comparator = date[0] + '-' + parsed_month + '-' + date[2][day];
              if(comparator == noleggio.inizio){
                tmp_month[month-1]++;
              }
            }
          }
        }
      }
      Data = tmp_month;
    }





    let labels: string[] = [];
    if (period === 'Month') {
      labels = array_lables;
    } else {
      labels = [
        'Gennaio',
        'Febbraio',
        'Marzo',
        'Aprile',
        'Maggio',
        'Giugno',
        'Luglio',
        'Agosto',
        'Settembre',
        'Ottobre',
        'Novembre',
        'Dicembre'
      ];

    }


    const datasets = [
      {
        data: Data,
        label: 'Current',
        backgroundColor: hexToRgba(getStyle('--cui-info'), 10) ?? '#20a8d8',
        borderColor: getStyle('--cui-info') ?? '#20a8d8',
        pointHoverBackgroundColor: getStyle('--cui-info') ?? '#20a8d8',
        borderWidth: 2,
        fill: true
      }
    ];

    const plugins = {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          labelColor: function(context: any) {
            return {
              backgroundColor: context.dataset.borderColor
            };
          }
        }
      }
    };

    const options = {
      maintainAspectRatio: false,
      plugins,
      scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      },
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.chart[0] = 'line';
    this.chart[1] = options;
    this.chart[2] = {
      datasets,
      labels
    };
  }
}
