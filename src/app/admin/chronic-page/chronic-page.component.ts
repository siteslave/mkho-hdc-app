import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ChronicService } from '../chronic.service';
import { AlertService } from '../../alert.service';
const { ipcRenderer } = require('electron');
import * as _ from 'lodash';

import { Options as HighchartsOptions, AxisOptions } from 'highcharts';

// const request = require('request');
const fse = require('fs-extra');

import * as moment from 'moment';
import { IConnection } from 'mysql';
import { Configure } from '../../configure';

@Component({
  selector: 'app-chronic-page',
  templateUrl: './chronic-page.component.html',
  styleUrls: ['./chronic-page.component.css']
})
export class ChronicPageComponent implements OnInit {

  optionsBp: HighchartsOptions;
  optionsWeight: HighchartsOptions;

  configure: Configure = new Configure();
  connection: IConnection;
  chronics: any[] = [];
  dismissChronics: any[] = [];

  token: string;
  hospcode: string;
  admissions: any[] = [];
  drugs: any[] = [];

  labHistories: any[] = [];
  chronicFuHistories: any[] = [];
  loading = false;
  loadingDrug = false;
  loadingHistory = false;
  openModalLab = false;
  openModalAdmission = false;
  openModalChronicFu = false;
  openModalDrug = false;

  constructor(
    private chronicService: ChronicService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private url: string
  ) {
    this.hospcode = sessionStorage.getItem('hospcode');
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    this.all();
  }

  all() {
    this.loading = true;
    this.configure.getConnection()
      .then((conn: IConnection) => {
        this.connection = conn;
        return this.chronicService.all(this.connection);
      })
      .then((result: any) => {
        this.chronics = result;
        this.connection.destroy();
        this.loading = false;
        this.ref.detectChanges();
      })
      .catch(err => {
        this.loading = false;
        this.connection.destroy();
        this.alertService.error(JSON.stringify(err));
      });
  }

  showLab(chronic: any) {
    this.labHistories = [];
    this.openModalLab = true;
    this.loadingHistory = true;
    const that = this;
    setTimeout(() => {
      that.chronicService.hdcLabHistory(chronic.cid)
        .then((result: any) => {
          if (result.ok) {
            that.labHistories = result.rows;
          } else {
            that.alertService.error(JSON.stringify(result.message));
          }
          that.loadingHistory = false;
          that.ref.detectChanges();
        })
        .catch(() => {
          that.loadingHistory = false;
          that.alertService.serverError();
        })
    }, 1000);
  }

  showChronicFu(chronic: any) {
    this.chronicFuHistories = [];
    this.openModalChronicFu = true;
    this.loadingHistory = true;
    const that = this;
    setTimeout(() => {
      that.chronicService.hdcChronicFuHistory(chronic.cid)
        .then((result: any) => {
          if (result.ok) {
            that.chronicFuHistories = result.rows;
            const _dataSBP = [];
            const _dataDBP = [];
            const _categories = [];
            const _weight = [];
            let _data: any = _.orderBy(result.rows, ['DATE_SERV'], ['ASC']);
            // console.log(_data);
            _data = _.takeRight(_data, 10);

            _data.forEach(v => {
              if (+v.SBP > 0 && +v.DBP > 0 && +v.WEIGHT > 0) {
                const _date = `${moment(v.DATE_SERV).format('D/M')}/${moment(v.DATE_SERV).get('year') + 543}`;
                _categories.push(_date);
                _dataSBP.push(+v.SBP);
                _dataDBP.push(+v.DBP);
                _weight.push(+v.WEIGHT);
              }
            });
            // set charts
            this.setChartsBP(_dataSBP, _dataDBP, _categories);
            this.setChartsWeight(_weight, _categories);
          } else {
            that.alertService.error(JSON.stringify(result.message));
          }
          that.loadingHistory = false;
          that.ref.detectChanges();
        })
        .catch(() => {
          that.loadingHistory = false;
          that.alertService.serverError();
        });
    }, 1000);
  }

  setChartsBP(sbp, dbp, categories) {

    this.optionsBp = {
      chart: {
        height: 300,
        type: 'line'
      },
      title: { text: 'ความดันโลหิต' },
      yAxis: {
        title: {
          text: 'mmHg'
        },
        plotLines: [
          {
            value: 120,
            color: 'red',
            dashStyle: 'shortdash',
            width: 2,
            label: {
              text: 'ค่ามาตรฐาน SBP'
            }
          },
          {
            value: 80,
            color: 'green',
            dashStyle: 'shortdash',
            width: 2,
            label: {
              text: 'ค่ามาตรฐาน DBP'
            }
          }
        ],
      },
      xAxis: {
        categories: categories
      },
      series: [
        {
          name: 'SBP',
          data: sbp,
        },
        {
          name: 'DBP',
          data: dbp,
        }
      ]
    };

  };

  setChartsWeight(weights, categories) {
    this.optionsWeight = {
      chart: {
        height: 300,
        type: 'line'
      },
      title: { text: 'น้ำหนัก (Weight)' },
      yAxis: {
        title: {
          text: 'kg'
        }
      },
      xAxis: {
        categories: categories
      },
      series: [
        {
          name: 'น้ำหนัก',
          data: weights,
        }
      ]
    };

  };

  showAdmission(chronic: any) {
    this.admissions = [];
    this.openModalAdmission = true;
    this.loadingHistory = true;
    const that = this;
    setTimeout(() => {
      that.chronicService.hdcAdmission(chronic.cid)
        .then((result: any) => {
          if (result.ok) {
            that.admissions = result.rows;
          } else {
            that.alertService.error(JSON.stringify(result.message));
          }
          that.loadingHistory = false;
          that.ref.detectChanges();
        })
        .catch(() => {
          that.loadingHistory = false;
          that.alertService.serverError();
        });
    }, 1000);
  }

  showAdmissionHomeDrug(chronic: any) {
    this.drugs = [];
    this.openModalDrug = true;
    this.loadingDrug = true;
    const that = this;
    setTimeout(() => {
      that.chronicService.hdcAdmissionHomeDrug(chronic.HOSPCODE, chronic.PID, chronic.AN)
        .then((result: any) => {
          if (result.ok) {
            that.drugs = result.rows;
          } else {
            that.alertService.error(JSON.stringify(result.message));
          }
          that.loadingDrug = false;
          that.ref.detectChanges();
        })
        .catch(() => {
          that.loadingDrug = false;
          that.alertService.serverError();
        });
    }, 1000);
  }
}
