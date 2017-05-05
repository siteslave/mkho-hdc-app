import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { IConnection } from 'mysql';
// const easysoap = require('easysoap');

@Injectable()
export class RightService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  all(conn: IConnection, start: any, end: any) {
    const sql = `
      select o.vstdate, o.vsttime, o.hn, p.pname, p.fname, p.lname,
      o.pttype, pt.name as pttype_name, o.pttypeno, vp.begin_date, vp.expire_date
      from ovst as o
      left join patient as p on p.hn=o.hn
      left join pttype as pt on pt.pttype=o.pttype
      left join visit_pttype as vp on vp.vn=o.vn
      where o.vstdate between ? and ?
    `;

    return new Promise((resolve, reject) => {
      conn.query(sql, [start, end], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  checkRight(userCid: string, cid: string, smcToken: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/nhso/check-right`, {
        cid: cid,
        userCid: userCid,
        smcToken: smcToken
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  hdcVaccineHistory(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/wbc/vaccine/history`, {
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
