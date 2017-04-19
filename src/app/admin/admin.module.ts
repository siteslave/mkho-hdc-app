import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { AdminRoutingModule } from './admin-routing.module';
import { MainPageComponent } from './main-page/main-page.component';
import { HelperModule } from '../helper/helper.module';
import { AuthModule } from '../auth/auth.module';

import { MainService } from './main.service';
import { AlertService } from '../alert.service';
import { AncService } from './anc.service';
import { WbcService } from './wbc.service';
import { VaccineService } from './vaccine.service';
import { ChronicService } from './chronic.service';
import { PersonService } from './person.service';

import { LayoutComponent } from './layout/layout.component';
import { AncPageComponent } from './anc-page/anc-page.component';
import { WbcPageComponent } from './wbc-page/wbc-page.component';
import { VaccinePageComponent } from './vaccine-page/vaccine-page.component';
import { ChronicPageComponent } from './chronic-page/chronic-page.component';
import { ChronicMissingComponent } from './chronic-missing/chronic-missing.component';


import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';
import { PersonDuplicatedComponent } from './person-duplicated/person-duplicated.component';
export function highchartsFactory() {
  return require('highcharts');
}

const Highcharts = require('highcharts');
 
Highcharts.setOptions({
  credits: false
});


@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    HelperModule,
    FormsModule,
    ClarityModule,
    AuthModule,
    ChartModule
  ],
  declarations: [
    MainPageComponent,
    LayoutComponent,
    AncPageComponent,
    WbcPageComponent,
    VaccinePageComponent,
    ChronicPageComponent,
    ChronicMissingComponent,
    PersonDuplicatedComponent],
  providers: [
    MainService,
    AlertService,
    AncService,
    WbcService,
    VaccineService,
    ChronicService,
    PersonService,
    { provide: HighchartsStatic, useFactory: highchartsFactory }
  ]
})
export class AdminModule { }
