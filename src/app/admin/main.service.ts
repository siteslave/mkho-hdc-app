import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { IConnection } from 'mysql';

@Injectable()
export class MainService {

  constructor( @Inject('API_URL') private url: string, private authHttp: AuthHttp) { }

  all(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/users`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getHospitalInfo(connection: IConnection) {
    let sql = `SELECT hospitalname, hospitalcode FROM opdconfig`;
    return new Promise((resolve, reject) => {
      connection.query(sql, [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      })
    })
  }
}
