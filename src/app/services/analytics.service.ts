import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  emitwidgetManagementEvent(action: string, event: string) {
    (<any>window).ga('send', {
      hitType: 'event',
      eventCategory: 'applicationFlow',
      eventAction: action + event,
      eventLabel: 'widgetManagement'
    });
  }
}
