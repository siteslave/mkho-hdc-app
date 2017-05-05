import { BrowserModule,  } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClarityModule } from 'clarity-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

import { LoginModule } from './login/login.module';
import { AdminModule } from './admin/admin.module';
import { AuthGuard } from './auth-guard.service';
import { AlertService } from './alert.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const apiUrl = localStorage.getItem('apiUrl') || 'http://localhost:3001';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ClarityModule.forRoot(),
    BrowserAnimationsModule,
    AppRoutingModule,
    LoginModule,
    AdminModule
  ],
  providers: [
    AuthGuard,
    AlertService,
    { provide: 'SERVICE_URL', useValue: 'http://ucws.nhso.go.th:80/ucwstokenp1/UCWSTokenP1' },
    { provide: 'WSDL_URL', useValue: 'http://ucws.nhso.go.th:80/ucwstokenp1/UCWSTokenP1?wsdl'},
    { provide: 'API_URL', useValue: apiUrl },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
