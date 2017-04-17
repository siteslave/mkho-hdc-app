import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IConnection } from 'mysql';

import { WbcService } from '../wbc.service';
import { AlertService } from '../../alert.service';
import { Configure } from '../../configure';

@Component({
  selector: 'app-wbc-page',
  templateUrl: './wbc-page.component.html',
  styleUrls: ['./wbc-page.component.css']
})
export class WbcPageComponent implements OnInit {

  loading = false;
  loadingHistory = false;
  wbcs: any[] = [];
  wbcHistories: any[] = [];
  vaccineHistories: any[] = [];

  openModalService = false;
  openModalVaccine = false;

  configure: Configure = new Configure();
  connection: IConnection;

  constructor(
    private ref: ChangeDetectorRef,
    private wbcService: WbcService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.all();
  }

  all() {
    this.loading = true;
    this.configure.getConnection()
      .then((conn: IConnection) => {
        this.connection = conn;
        return this.wbcService.all(this.connection);
      })
      .then((result: any) => {
        this.wbcs = result;
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

  showVaccine(wbc: any) {
    this.vaccineHistories = [];
    this.openModalVaccine = true;
    this.loadingHistory = true;
    const that = this;
    setTimeout(() => {
      that.wbcService.hdcVaccineHistory(wbc.cid)
        .then((result: any) => {
          if (result.ok) {
            that.vaccineHistories = result.rows;
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

showService(wbc: any) {
  this.wbcHistories = [];
  this.openModalService = true;
  this.loadingHistory = true;
  const that = this;
  setTimeout(() => {
    that.wbcService.hdcServiceHistory(wbc.cid)
      .then((result: any) => {
        if (result.ok) {
          that.wbcHistories = result.rows;
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
}
