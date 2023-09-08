import { Injectable } from '@angular/core';
import {Event, EventType} from '../store/models/models';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor() { }


  public createEventFromLocalizedMessage(payload: any, titleKey: string, bodyKey: string, type: EventType): Event {
    return {
      title: payload[titleKey],
      body: payload[bodyKey],
      type: type
    }

  }
}
