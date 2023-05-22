export enum EventType {
  INFO = 'info',
  WARNING = 'warn',
  SUCCESS = 'success',
  ERROR = 'error',
}
export interface Event {
  type: EventType,
  title: string,
  body: string,
}
