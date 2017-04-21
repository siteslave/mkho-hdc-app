import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ChronicService } from '../chronic.service';
import { AlertService } from '../../alert.service';
const { ipcRenderer } = require('electron');

import { IConnection } from 'mysql';
import { Configure } from '../../configure';

@Component({
  selector: 'app-chronic-missing',
  templateUrl: './chronic-missing.component.html',
  styleUrls: ['./chronic-missing.component.css']
})
export class ChronicMissingComponent implements OnInit {

  configure: Configure = new Configure();
  connection: IConnection;
  chronics: any[] = [];
  drugs: any[] = [];
  dismissChronics: any[] = [];
  diagIncorrects: any[] = [];
  openModalIncorrectDiag = false;
  openModalDrugs = false;

  token: string;
  hospcode: string;
  loading = false;
  loadingDiag = false;
  loadingDrug = false;

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
    this.getNotRegisterChronic();
  }

  getNotRegisterChronic() {
    this.loading = true;
    this.dismissChronics = [];
    this.chronicService.hdcNotRegister(this.hospcode)
      .then((result: any) => {
        if (result.ok) {
          this.dismissChronics = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.message));
        }
        this.loading = false;
        this.ref.detectChanges();
      })
      .catch(() => {
        this.loading = false;
        this.alertService.serverError();
      });
  }

  exportNotRegister() {
    const downloadUrl = `${this.url}/chronic/not-register/excel?token=${this.token}&hospcode=${this.hospcode}`;
    const option = { url: downloadUrl };

    this.loading = true;
    ipcRenderer.on('downloaded', (event, arg) => {
      this.loading = false;
      if (arg.ok) {
        this.alertService.success();
      } else {
        this.alertService.error(arg.message);
      }
    });
    ipcRenderer.send('download-file', option);
  }

  getIncorrectDiag(c) {
    const hospcode = c.input_hosp;
    const pid = c.input_pid;
    const dateServ = c.date_dx;
    const sourceTb = c.source_tb;
    this.diagIncorrects = [];

    this.openModalIncorrectDiag = true;
    const that = this;

    this.loadingDiag = true;

    setTimeout(() => {
      that.chronicService.hdcGetIncorrectDiag(hospcode, pid, dateServ, sourceTb)
        .then((result: any) => {
          if (result.ok) {
            that.diagIncorrects = result.rows;
            const an = result.rows[0].AN;
            const seq = result.rows[0].SEQ;
            const _hospcode = result.rows[0].HOSPCODE;

            that.chronicService.hdcGetDrugs(_hospcode, an, seq)
              .then((_result: any) => {
                if (_result.ok) {
                  that.drugs = _result.rows;
                } else {
                  that.alertService.error(JSON.stringify(_result.message));
                }
                that.loadingDiag = false;
                that.ref.detectChanges();
              })
              .catch(err => {
                that.loadingDiag = false;
                this.alertService.serverError();
            })
          } else {
            that.loadingDiag = false;
            that.alertService.error(JSON.stringify(result.message));
          }
        })
        .catch(err => {
          that.loadingDiag = false;
          that.alertService.serverError();
        });
    }, 1000);
  }

  getDrug(c) {
    const hospcode = c.HOSPCODE;
    const an = c.AN;
    const seq = c.SEQ;

    this.drugs = [];

    this.openModalDrugs = true;
    const that = this;

    this.loadingDrug = true;

    setTimeout(() => {
      that.chronicService.hdcGetDrugs(hospcode, an, seq)
        .then((result: any) => {
          if (result.ok) {
            that.drugs = result.rows;
          } else {
            that.alertService.error(JSON.stringify(result.message));
          }
          that.loadingDrug = false;
          that.ref.detectChanges();
        })
        .catch(err => {
          that.loadingDrug = false;
          that.alertService.serverError();
        });
    }, 1000);
  }

  onTabSelected(event) {}
}
