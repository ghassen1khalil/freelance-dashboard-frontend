export enum EventType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
export interface Event {
  type: EventType,
  title: string,
  body: string,
}
