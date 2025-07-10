import {Injectable} from '@angular/core';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class DateService {

  static readonly YYYY_MM_DD_FORMAT: string = "YYYY-MM-DD";
  static readonly YYYY_MM_DD_HH_MM_FORMAT: string = "YYYY-MM-DD HH:mm";

  constructor() { }

  public today(format: string) {
    return moment().format(format);
  }

  public format(date: string , format: string) {
    return moment(date).format(format);
  }

  public formatLocalDateTime = (date: Date): string => {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };
}
