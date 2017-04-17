import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { LoginService } from '../login.service';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string;
  password: string;
  jwtHelper: JwtHelper = new JwtHelper();
  isLogging = false;

  dbHost: string;
  dbPort: number;
  dbName: string;
  dbUser: string;
  dbPassword: string;
  apiUrl: string;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alert: AlertService
  ) {

    this.dbHost = localStorage.getItem('dbHost') || 'localhost';
    this.dbPort = +localStorage.getItem('dbPort') || 3306;
    this.dbName = localStorage.getItem('dbName') || 'hosxp_pcu';
    this.dbUser = localStorage.getItem('dbUser') || 'sa';
    this.dbPassword = localStorage.getItem('dbPassword') || 'sa';
    this.apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:3001';

  }

  ngOnInit() {
  }

  enterLogin(event) {
    // enter login
    if (event.keyCode === 13) {
      this.doLogin();
    }
  }

  doLogin() {
    this.isLogging = true;
    this.loginService.doLogin(this.username, this.password)
      .then((results: any) => {
        if (results.ok) {
          const decodedToken = this.jwtHelper.decodeToken(results.token);
          const fullname = `${decodedToken.firstname} ${decodedToken.lastname}`;

          sessionStorage.setItem('token', results.token);
          sessionStorage.setItem('fullname', fullname);
          // redirect to admin module
          this.router.navigate(['admin']);
        } else {
          this.alert.error(JSON.stringify(results.message));
        }
        // hide spinner
        this.isLogging = false;
      })
      .catch((error) => {
        this.isLogging = false;
        this.alert.error(JSON.stringify(error));
      });
  }

  saveConfig() {
    const port = this.dbPort || 3306;

    localStorage.setItem('dbHost', this.dbHost);
    localStorage.setItem('dbPort', port.toString());
    localStorage.setItem('dbName', this.dbName);
    localStorage.setItem('dbUser', this.dbUser);
    localStorage.setItem('dbPassword', this.dbPassword);
    localStorage.setItem('apiUrl', this.apiUrl);

    this.alert.success('บันทึกการเชื่อมต่อเสร็จเรียบร้อยแล้ว');
  }
}
