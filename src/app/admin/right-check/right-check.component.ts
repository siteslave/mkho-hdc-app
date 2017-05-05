import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { RightService } from '../right.service';
import * as moment from 'moment';
import { IConnection } from 'mysql';
import { Configure } from '../../configure';
import { AlertService } from '../../alert.service';

const { ipcRenderer } = require('electron')

@Component({
  selector: 'app-right-check',
  templateUrl: './right-check.component.html',
  styleUrls: ['./right-check.component.css']
})
export class RightCheckComponent implements OnInit {

  myDatePickerOptions: IMyOptions = {
    // other options...
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true
  };

  // Initialized to specific date (09.10.2018).
  startDate: any;
  endDate: any;

  loading = false;
  configure: Configure = new Configure();
  connection: IConnection;
  patients: any[] = [];

  openSetting = false;
  tokenPath: string;

  selectedPatient: any[] = [];
  
  constructor(
    private rightService: RightService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  checkRight() {
    this.rightService.checkRight('1234423232232', '121212121212', 'lsdflkdsjflksdjf')
      .then(() => {

      })
      .catch(() => {

      });
  }

  getServices() {
    this.loading = true;
    this.patients = [];

    try {
      if (this.startDate && this.endDate) {
        const startDate = moment(this.startDate.jsdate).format('YYYY-MM-DD');
        const endDate = moment(this.endDate.jsdate).format('YYYY-MM-DD');

        this.configure.getConnection()
          .then((conn: IConnection) => {
            this.connection = conn;
            return this.rightService.all(this.connection, startDate, endDate);
          })
          .then((rows: any) => {
            this.patients = rows;
            this.ref.detectChanges();
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            this.connection.destroy();
            this.alertService.error(JSON.stringify(error));
          });
      } else {
        this.loading = false;
        this.alertService.error('กรุณาระบุวันที่');
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }

  }

  openSettingModal() {
    this.openSetting = true;
  }

  openFile() {
    const tokenFile = ipcRenderer.sendSync('open-token-path');
    if (tokenFile) {
      this.tokenPath = tokenFile[0];
    }
  }

}
