import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth-guard.service';
import { LayoutComponent } from './layout/layout.component';

import { MainPageComponent } from './main-page/main-page.component';
import { AncPageComponent } from './anc-page/anc-page.component';
import { WbcPageComponent } from './wbc-page/wbc-page.component';
import { VaccinePageComponent } from './vaccine-page/vaccine-page.component';
import { ChronicPageComponent } from './chronic-page/chronic-page.component';
import { ChronicMissingComponent } from './chronic-missing/chronic-missing.component';
import { PersonDuplicatedComponent } from './person-duplicated/person-duplicated.component';
import { DrugAllergyComponent } from './drug-allergy/drug-allergy.component';
import { DeathComponent } from './death/death.component';
import { AncTargetComponent } from './anc-target/anc-target.component';


import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: 'admin',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'anc', pathMatch: 'full' },
      { path: 'anc', component: AncPageComponent },
      { path: 'anc-target', component: AncTargetComponent },
      { path: 'wbc', component: WbcPageComponent },
      { path: 'vaccine', component: VaccinePageComponent },
      { path: 'chronic', component: ChronicPageComponent },
      { path: 'chronic-missing', component: ChronicMissingComponent },
      { path: 'person-duplicated', component: PersonDuplicatedComponent },
      { path: 'drugallergy', component: DrugAllergyComponent },
      { path: 'death', component: DeathComponent },
      { path: '**', component: PageNotFoundComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
