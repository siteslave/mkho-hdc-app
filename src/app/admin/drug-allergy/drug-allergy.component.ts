import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PersonService } from '../person.service';
import { AlertService } from "../../alert.service";

@Component({
  selector: 'app-drug-allergy',
  templateUrl: './drug-allergy.component.html',
  styleUrls: ['./drug-allergy.component.css']
})
export class DrugAllergyComponent implements OnInit {

  loading = false;
  loadingAllergy = false;
  persons: any[] = [];
  allergies: any[] = [];
  openModalAllergy = false;

  cid: string;

  constructor(
    private personService: PersonService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  enterSearch(event) {
    if (event.keyCode === 13) {
      this.search();
    }
  }

  search() {
    if (this.cid && this.cid.length === 13) {
      this.loading = true;
      this.personService.hdcSearchWithCid(this.cid)
        .then((result: any) => {
          if (result.ok) {
            this.persons = result.rows;
          } else {
            this.alertService.error(JSON.stringify(result.message));
          }
          this.loading = false;
          this.ref.detectChanges();
        })
        .catch(error => {
          this.loading = false;
          this.alertService.serverError();
        })
    } else {
      this.alertService.error('กรุณาระบุเลขบัตรประชาชนให้ถูกต้อง');
    }
  }

  getAllergyInfo(person) {
    this.cid = person.cid;
    this.openModalAllergy = true;
    this.loadingAllergy = true;
    this.allergies = [];

    const that = this;
    setTimeout(() => {
      that.personService.hdcGetDrugAllergy(person.cid)
        .then((result: any) => {
          if (result.ok) {
            that.allergies = result.rows;
          } else {
            that.alertService.error(JSON.stringify(result.message));
          }
          that.loadingAllergy = false;
          that.ref.detectChanges();
        })
        .catch(() => {
          that.loadingAllergy = false;
          that.alertService.serverError();
        })
    }, 1000);

  }

}
