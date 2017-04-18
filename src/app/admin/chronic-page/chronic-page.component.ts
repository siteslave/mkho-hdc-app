import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ChronicService } from '../chronic.service';
import { AlertService } from '../../alert.service';
const { ipcRenderer } = require('electron');

// const request = require('request');
const fse = require('fs-extra');

import { IConnection } from 'mysql';
import { Configure } from '../../configure';

@Component({
  selector: 'app-chronic-page',
  templateUrl: './chronic-page.component.html',
  styleUrls: ['./chronic-page.component.css']
})
export class ChronicPageComponent implements OnInit {

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

  onTabSelected(event) {
    if (event.id === 'not-register') {
      this.getNotRegisterChronic();
    }
  }
}
