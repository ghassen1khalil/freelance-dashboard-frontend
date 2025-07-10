export interface CalendarEvent {
  eventName: string;
  startDateTime: string;
  endDateTime: string;
  location?: string;
  description?: string;
  reminderMinutesBefore?: number;
}

