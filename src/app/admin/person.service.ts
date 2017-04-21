import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class PersonService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  hdcGetDuplicated(hospcode: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/person/duplicated`, {
        hospcode: hospcode
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  hdcGetDuplicatedList(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/person/duplicated/list`, {
        cid: cid
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  hdcGetDeathNotRegister(hospcode: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/person/death/not-register`, {
        hospcode: hospcode
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  hdcGetDeathNotRegisterInfo(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/person/death/not-register/info`, {
        cid: cid
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  hdcSearchWithCid(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/person/search-cid`, {
        cid: cid
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  hdcGetDrugAllergy(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/person/drug-allergy`, {
        cid: cid
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
