import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { AlertService } from '../../alert.service';
import { PersonService } from '..//person.service';
import { Configure } from '../../configure';

const { ipcRenderer } = require('electron');
const fse = require('fs-extra');

@Component({
  selector: 'app-person-duplicated',
  templateUrl: './person-duplicated.component.html',
  styleUrls: ['./person-duplicated.component.css']
})
export class PersonDuplicatedComponent implements OnInit {
  persons: any[] = [];
  personDuplicateds: any[] = [];
  loading = false;
  loadingExport = false;
  loadingDuplicated = false;

  hospcode: string;
  token: string;
  openDuplicated = false;

  constructor(
    private alertService: AlertService,
    private personService: PersonService,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private url: string
  ) {
    this.hospcode = sessionStorage.getItem('hospcode');
    this.token = sessionStorage.getItem('token');
    this.hospcode = sessionStorage.getItem('hospcode');
  }

  ngOnInit() {
    this.all();
  }

  all() {
    this.loading = true;
    this.personService.hdcGetDuplicated(this.hospcode)
      .then((result: any) => {
        if (result.ok) {
          this.persons = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.message));
        }
        this.ref.detectChanges();
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.alertService.serverError();
      });
  }

  getDuplicated(cid) {
    this.loadingDuplicated = true;
    const that = this;
    this.personDuplicateds = [];
    this.openDuplicated = true;

    setTimeout(() => {
      that.personService.hdcGetDuplicatedList(cid)
      .then((result: any) => {
        if (result.ok) {
          that.personDuplicateds = result.rows;
        } else {
          that.alertService.error(JSON.stringify(result.message));
        }
        that.ref.detectChanges();
        that.loadingDuplicated = false;
      })
      .catch(() => {
        that.loadingDuplicated = false;
        that.alertService.serverError();
      });
    }, 1000);
  }

  exportExcel() {
    const downloadUrl = `${this.url}/person/duplicated/excel?token=${this.token}&hospcode=${this.hospcode}`;
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
