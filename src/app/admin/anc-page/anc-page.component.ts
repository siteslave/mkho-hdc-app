import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';

import { IConnection } from 'mysql';
import { AncService } from '../anc.service';
import { AlertService } from '../../alert.service';
import { Configure } from '../../configure';

const { ipcRenderer } = require('electron');

@Component({
  selector: 'app-anc-page',
  templateUrl: './anc-page.component.html',
  styleUrls: ['./anc-page.component.css']
})
export class AncPageComponent implements OnInit {
  configure: Configure = new Configure();
  connection: IConnection;

  ancs: any[] = [];
  ancLocals: any = {};
  ancHistories: any[] = [];
  postLocals: any = {};
  postHistories: any[] = [];

  token: string;
  hospcode: string;

  cid: string;
  gravida: string;

  loading = false;
  loadingExport = false;
  loadingHistory = false;
  openModalPost = false;
  openModalAnc = false;

  constructor(
    private ancService: AncService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private url: string
  ) {

  }

  ngOnInit() {
    this.token = sessionStorage.getItem('token');
    this.hospcode = sessionStorage.getItem('hospcode');
    this.all();
  }

  all() {
    this.loading = true;
    this.configure.getConnection()
      .then((conn: IConnection) => {
        this.connection = conn;
        return this.ancService.all(this.connection);
      })
      .then((result: any) => {
        this.ancs = result;
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

  showAncHistory(anc) {
    this.ancLocals = {};
    const personAncId = anc.person_anc_id;
    this.cid = anc.cid;
    this.gravida = anc.preg_no;

    this.configure.getConnection()
      .then((conn: IConnection) => {
        this.connection = conn;
        return this.ancService.getLocalAncHistory(this.connection, anc.person_anc_id);
      })
      .then((result: any) => {
        this.ancLocals = result[0];
        this.connection.destroy();
        this.openModalAnc = true;
      })
      .catch((err) => {
        this.connection.destroy();
        this.alertService.error(JSON.stringify(err));
      });
  }

  showPostHistory(anc) {
    this.postLocals = {};
    const personAncId = anc.person_anc_id;
    this.cid = anc.cid;
    this.gravida = anc.preg_no;

    this.configure.getConnection()
      .then((conn: IConnection) => {
        this.connection = conn;
        return this.ancService.getLocalPostHistory(this.connection, anc.person_anc_id);
      })
      .then((result: any) => {
        this.postLocals = result[0];
        this.connection.destroy();
        this.openModalPost = true;
      })
      .catch((err) => {
        this.connection.destroy();
        this.alertService.error(JSON.stringify(err));
      });
  }

  onTabAncSelected(event) {
    console.log(event.id);
    if (event.id === 'hdc') {
      this.ancHistories = [];
      this.loadingHistory = true;
      this.ancService.hdcAncHistory(this.cid, this.gravida)
        .then((result: any) => {
          if (result.ok) {
            this.ancHistories = result.rows;
          } else {
            this.alertService.error(JSON.stringify(result.message));
          }
          this.loadingHistory = false;
          this.ref.detectChanges();
        })
        .catch(err => {
          this.loadingHistory = false;
          this.alertService.serverError();
        });
    }
  };

  onTabPostSelected(event) {
    console.log(event.id);
    if (event.id === 'hdc') {
      this.ancHistories = [];
      this.loadingHistory = true;
      this.ancService.hdcPostHistory(this.cid, this.gravida)
        .then((result: any) => {
          if (result.ok) {
            this.postHistories = result.rows;
          } else {
            this.alertService.error(JSON.stringify(result.message));
          }
          this.loadingHistory = false;
          this.ref.detectChanges();
        })
        .catch(err => {
          this.loadingHistory = false;
          this.alertService.serverError();
        });
    }
  };

  exportTarget() {
    const downloadUrl = `${this.url}/anc/excel-export?token=${this.token}&hospcode=${this.hospcode}`;
    const option = { url: downloadUrl };

    this.loadingExport = true;
    ipcRenderer.on('downloaded', (event, arg) => {
      this.loadingExport = false;
      if (arg.ok) {
        this.alertService.success();
      } else {
        this.alertService.error(arg.message);
      }
    });
    ipcRenderer.send('download-file', option);
  }
}
