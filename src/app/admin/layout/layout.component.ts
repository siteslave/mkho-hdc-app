import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { IConnection } from 'mysql';

import { Configure } from '../../configure';
import { MainService } from '../main.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  fullname: string;
  hospitalname: string;
  connection: IConnection;
  configure: Configure = new Configure();

  constructor(private router: Router, private mainService: MainService) {
    this.fullname = sessionStorage.getItem('fullname');
    this.configure.getConnection()
      .then((conn: IConnection) => {
        this.connection = conn;
        return this.mainService.getHospitalInfo(this.connection);
      })
      .then((result: any) => {
        sessionStorage.setItem('hospcode', result[0].hospitalcode);
        sessionStorage.setItem('hospname', result[0].hospitalname);
        this.hospitalname = `${result[0].hospitalcode} - ${result[0].hospitalname}`;
      })
      .catch((error) => {
        this.connection.destroy();
        console.log(error);
      });
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');

    this.router.navigate(['login']);
  }

  ngOnInit() {
  }

}
