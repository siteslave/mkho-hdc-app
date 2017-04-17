import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToThaiDatePipe } from './to-thai-date.pipe';
import { ToSexNamePipe } from './to-sex-name.pipe';
import { ToShortTimePipe } from './to-short-time.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ToThaiDatePipe, ToSexNamePipe, ToShortTimePipe],
  exports: [ToThaiDatePipe, ToSexNamePipe, ToShortTimePipe]
})
export class HelperModule { }
