import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { IConnection } from 'mysql';

@Injectable()
export class AncService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  all(conn: IConnection, discharge: string = 'N') {
    const sql = `
    select pt.cid, pa.person_anc_id, concat(pt.pname, pt.fname, " ", pt.lname) as ptname, 
    TIMESTAMPDIFF(YEAR, pt.birthdate, current_date()) as age, 
    pt.patient_hn, pt.birthdate, pa.person_anc_id, pa.person_id, pa.edc, pa.lmp, 
    pa.labor_date, pa.preg_no, pa.ga, pa.force_complete_date,
    pa.discharge, pa.discharge_date, pa.last_update, pa.pre_labor_service_percent, 
    pa.post_labor_service_percent, pt.house_regist_type_id
    from person_anc as pa
    inner join person as pt on pt.person_id=pa.person_id
    where pa.discharge=?
    and pt.house_regist_type_id in (
      select house_regist_type_id 
      from house_regist_type where house_regist_type.export_code in ('1', '3')
    ) group by pa.person_id, pa.preg_no order by pt.fname, pt.lname
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

  getLocalAncHistory(conn: IConnection, personAncId: number) {
    const sql = `
      select lmp, labor_date, pre_labor_service1_date as pdate1, TIMESTAMPDIFF(week,lmp,pre_labor_service1_date) as ga1, 
      pre_labor_service2_date as pdate2, TIMESTAMPDIFF(week,lmp, pre_labor_service2_date) as ga2, 
      pre_labor_service3_date as pdate3, TIMESTAMPDIFF(week,lmp, pre_labor_service3_date) as ga3, 
      pre_labor_service4_date as pdate4, TIMESTAMPDIFF(week,lmp, pre_labor_service4_date) as ga4, 
      pre_labor_service5_date as pdate5, TIMESTAMPDIFF(week,lmp, pre_labor_service5_date) as ga5
      from person_anc
      where person_anc_id=?
    `;

    return new Promise((resolve, reject) => {
      conn.query(sql, [personAncId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  getLocalPostHistory(conn: IConnection, personAncId: number) {
    const sql = `
      select lmp, labor_date, 
      post_labor_service1_date as ldate1, TIMESTAMPDIFF(day, labor_date, post_labor_service1_date) as care1,
      post_labor_service2_date as ldate2, TIMESTAMPDIFF(day, labor_date, post_labor_service2_date) as care2,
      post_labor_service3_date as ldate3, TIMESTAMPDIFF(day, labor_date, post_labor_service3_date) as care3
      from person_anc
      where person_anc_id=?
    `;

    return new Promise((resolve, reject) => {
      conn.query(sql, [personAncId], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  hdcAncHistory(cid: string, gravida: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/anc/history`, {
        cid: cid,
        gravida: gravida
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  hdcPostHistory(cid: string, gravida: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/anc/post/history`, {
        cid: cid,
        gravida: gravida
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
