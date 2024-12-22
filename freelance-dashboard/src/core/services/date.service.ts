import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  static readonly YYYY_MM_DD_FORMAT: string = "YYYY-MM-DD";

  constructor() { }

  public today(format: string) {
    return moment().format(format);
  }

  public format(date: string , format: string) {
    return moment(date).format(format);
  }
}
