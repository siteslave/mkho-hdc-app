import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { IConnection } from 'mysql';

@Injectable()
export class VaccineService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  all(conn: IConnection, minAge: number, maxAge: number) {
    const sql = `
      select pt.person_id, pt.cid, pt.patient_hn, pt.birthdate,
      concat(pt.pname, pt.fname, " ", pt.lname) as ptname,
      pt.sex, TIMESTAMPDIFF(year, pt.birthdate, current_date()) as age
      from person as pt
      where pt.house_regist_type_id in
      (select house_regist_type_id from house_regist_type where house_regist_type.export_code in ('1', '3'))
      and pt.death != 'Y'
      and TIMESTAMPDIFF(year, pt.birthdate, current_date()) between ? and ?
      order by pt.fname, pt.lname
    `;

    return new Promise((resolve, reject) => {
      conn.query(sql, [minAge, maxAge], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  hdcServiceHistory(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/wbc/history`, {
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
