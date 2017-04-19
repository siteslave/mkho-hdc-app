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

}
