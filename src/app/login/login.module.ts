import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from 'clarity-angular';

import { LoginRoutingModule } from './login-routing.module';
import { HelperModule } from '../helper/helper.module';
import { LoginPageComponent } from './login-page/login-page.component';

import { LoginService } from './login.service';
import { SettingPageComponent } from './setting-page/setting-page.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    LoginRoutingModule,
    HelperModule,
    ClarityModule
  ],
  declarations: [LoginPageComponent, SettingPageComponent],
  providers: [LoginService]
})
export class LoginModule { }
