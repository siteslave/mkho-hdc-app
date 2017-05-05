import { Component, OnInit } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { RightService } from '../right.service';
import * as moment from 'moment';

@Component({
  selector: 'app-right-check',
  templateUrl: './right-check.component.html',
  styleUrls: ['./right-check.component.css']
})
export class RightCheckComponent implements OnInit {

  public myDatePickerOptions: IMyOptions = {
    // other options...
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    showDecreaseDateBtn: true,
    showIncreaseDateBtn: true
  };

  // Initialized to specific date (09.10.2018).
  public startDate: Object = { date: { year: moment().get('year'), month: moment().get('month') + 1, day: moment().get('date') } };
  public endDate: Object = { date: { year: moment().get('year'), month: moment().get('month') + 1, day: moment().get('date') } };

  constructor(
    private rightService: RightService
  ) { }

  ngOnInit() {
    this.rightService.checkRight('1234423232232', '121212121212', 'lsdflkdsjflksdjf')
      .then(() => {

      })
      .catch(() => {

      });
  }

}
