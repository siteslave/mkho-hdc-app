import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { ChronicService } from '../chronic.service';
import { AlertService } from '../../alert.service';
import { PersonService } from '../person.service';
import * as moment from 'moment';

const { ipcRenderer } = require('electron');

@Component({
  selector: 'app-death',
  templateUrl: './death.component.html',
  styleUrls: ['./death.component.css']
})
export class DeathComponent implements OnInit {
  persons: any[] = [];
  token: string;
  hospcode: string;
  cid: string;
  ptname: string;

  deathDate: string;
  cdeath: string;
  placeDeath: string;
  hospDeath: string;
  inputHospname: string;
  dUpdate: string;
  typearea: string;

  loading = false;
  loadingInfo = true;
  loadingExport = false;
  openDeathInfo = false;

  constructor(
    private alertService: AlertService,
    private personService: PersonService,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private url: string
  ) {
    this.token = sessionStorage.getItem('token');
    this.hospcode = sessionStorage.getItem('hospcode');
  }

  ngOnInit() {
    this.all();
  }

  all() {
    this.loading = true;
    this.personService.hdcGetDeathNotRegister(this.hospcode)
      .then((result: any) => {
        if (result.ok) {
          this.persons = result.rows;
          this.loading = false;
          this.ref.detectChanges();
        } else {
          this.alertService.error(JSON.stringify(result.message));
        }
      })
      .catch(err => {
        this.loading = false;
        this.alertService.error(JSON.stringify(err));
      });
  }

  getDeathInfo(person) {
    this.cid = person.cid;
    this.ptname = person.ptname;

    this.openDeathInfo = true;
    this.loadingInfo = true;

    const that = this;
    setTimeout(() => {
      that.personService.hdcGetDeathNotRegisterInfo(person.cid)
        .then((result: any) => {
          if (result.ok) {
            if (result.rows.length) {
              that.deathDate = result.rows[0].DDEATH;
              that.cdeath = `${result.rows[0].CDEATH} - ${result.rows[0].cdeath_name}`;
              that.placeDeath = result.rows[0].pdeathdesc;
              that.hospDeath = `${result.rows[0].HOSPDEATH} - ${result.rows[0].death_hospname}`;
              that.inputHospname = `${result.rows[0].HOSPCODE} - ${result.rows[0].input_hospname}`;
              that.dUpdate = result.rows[0].D_UPDATE;
              that.typearea = `${result.rows[0].TYPEAREA} - ${result.rows[0].typeareaname}`;
            } else {
              that.openDeathInfo = false;
              that.alertService.error('ไม่พบข้อมูลการเสียชีวิต');
            }
          } else {
            that.alertService.error(JSON.stringify(result.message));
          }
          that.loadingInfo = false;
          that.ref.detectChanges();
        })
        .catch(() => {
          that.loadingInfo = false;
          that.alertService.serverError();
        })
    }, 1000);

  }

  exportExcel() {
    const downloadUrl = `${this.url}/person/death/excel-export?token=${this.token}&hospcode=${this.hospcode}`;
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
