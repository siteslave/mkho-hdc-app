import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { LayoutComponent } from './layout/layout.component';

import { MainPageComponent } from './main-page/main-page.component';
import { AncPageComponent } from './anc-page/anc-page.component';
import { WbcPageComponent } from './wbc-page/wbc-page.component';
import { VaccinePageComponent } from './vaccine-page/vaccine-page.component';
import { ChronicPageComponent } from './chronic-page/chronic-page.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'anc', pathMatch: 'full' },
      { path: 'anc', component: AncPageComponent },
      { path: 'wbc', component: WbcPageComponent },
      { path: 'vaccine', component: VaccinePageComponent },
      { path: 'chronic', component: ChronicPageComponent },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
