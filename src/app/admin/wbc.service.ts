import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { IConnection } from 'mysql';

@Injectable()
export class WbcService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  all(conn: IConnection, discharge: string = 'N') {
    const sql = `
      select pt.patient_hn, pt.cid, concat(pt.pname, pt.fname, " ", pt.lname) as ptname, pt.sex, TIMESTAMPDIFF(year, pt.birthdate, current_date()) as age,
      pw.person_id, pw.person_wbc_id, pw.baby_service1_date, pw.baby_service2_date, pw.baby_service3_date,
      pw.baby_service4_date,pw.force_complete_date, pw.vaccine_bcg_date, pw.vaccine_dtp1_date, 
      pw.vaccine_dtp2_date, pw.vaccine_dtp3_date,
      pw.vaccine_dtphb1_date, pw.vaccine_dtphb2_date, pw.vaccine_dtphb3_date, pw.vaccine_hbv1_date,
      pw.vaccine_hbv2_date, pw.vaccine_hbv3_date, pw.vaccine_mmr_date, pw.vaccine_opv1_date,
      pw.vaccine_opv2_date, pw.vaccine_opv3_date, pw.vaccine_percent
      from person_wbc pw
      inner join person as pt on pt.person_id=pw.person_id
      where pw.discharge=?
      and pt.house_regist_type_id in (select house_regist_type_id from house_regist_type where house_regist_type.export_code in ('1', '3'))
      order by pt.fname, pt.lname
    `;

    return new Promise((resolve, reject) => {
      conn.query(sql, [discharge], (err, result) => {
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
