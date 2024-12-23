import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NullityUtilService {

  constructor() { }

  public isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
    return value !== null && value !== undefined;
  }
}
