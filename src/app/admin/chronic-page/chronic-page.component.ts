import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ChronicService } from '../chronic.service';
import { AlertService } from '../../alert.service';

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
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.all();
  }

  all() {
    this.configure.getConnection()
      .then((conn: IConnection) => {
        this.connection = conn;
        return this.chronicService.all(this.connection);
      })
      .then((result: any) => {
        this.chronics = result;
        this.connection.destroy();
        this.ref.detectChanges();
      })
      .catch(err => {
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
}
