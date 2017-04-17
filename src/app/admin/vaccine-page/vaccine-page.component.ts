import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IConnection } from 'mysql';

import { VaccineService } from '../vaccine.service';
import { WbcService } from '../wbc.service';
import { AlertService } from '../../alert.service';
import { Configure } from '../../configure';

@Component({
  selector: 'app-vaccine-page',
  templateUrl: './vaccine-page.component.html',
  styleUrls: ['./vaccine-page.component.css']
})
export class VaccinePageComponent implements OnInit {

  wbcs: any[] = [];
  vaccineHistories: any[] = [];
  minAge = 1;
  maxAge = 6;
  configure: Configure = new Configure();
  connection: IConnection;
  loading = false;
  loadingHistory = false;
  openModalVaccine = false;

  constructor(
    private vaccineService: VaccineService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService,
    private wbcService: WbcService
  ) { }

  ngOnInit() {
    this.getTarget();
  }

  getTarget() {
    this.wbcs = [];
    this.loading = true;
    this.configure.getConnection()
      .then((conn: IConnection) => {
        this.connection = conn;
        return this.vaccineService.all(this.connection, this.minAge, this.maxAge);
      })
      .then((result: any) => {
        this.wbcs = result;
        this.ref.detectChanges();
        this.connection.destroy();
        this.loading = false;
      })
      .catch(error => {
        this.loading = false;
        this.connection.destroy();
        this.alertService.error(JSON.stringify(error));
      });
  }

  showVaccine(wbc) {
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
}
