import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { IConnection } from 'mysql';

@Injectable()
export class ChronicService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  all(conn: IConnection) {
    const sql = `
        select p.cid, concat(p.pname, p.fname, " ", p.lname) as ptname, 
        GROUP_CONCAT(c.name) as clinics,
        p.birthdate, TIMESTAMPDIFF(year, p.birthdate, current_date()) as age,
        cm.hn, cm.regdate, cm.next_app_date, cm.begin_year, cm.discharge, cm.last_hba1c_date
        from clinicmember as cm
        inner join person as p on p.patient_hn=cm.hn
        left join clinic as c on c.clinic=cm.clinic
        where p.house_regist_type_id in (select house_regist_type_id from house_regist_type where house_regist_type.export_code in ('1', '3'))
        and cm.discharge='N' and p.death !='Y' and cm.clinic in ('001', '002')
        group by cm.hn
        order by p.fname, p.lname
    `;

    return new Promise((resolve, reject) => {
      conn.query(sql, [], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  hdcLabHistory(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/chronic/lab/history`, {
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

  hdcChronicFuHistory(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/chronic/chronicfu/history`, {
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

  hdcAdmission(cid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/chronic/admission`, {
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

  hdcAdmissionHomeDrug(hospcode: string, pid: string, an: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/chronic/admission/home-drug`, {
        hospcode: hospcode,
        pid: pid,
        an: an
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
