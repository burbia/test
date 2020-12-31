import { MILLISECONDS_IN_MINUTE, MILLISECONDS_IN_DAY } from './../components/shared/app-constants';
import { NotificationService } from 'src/app/services/notification.service';
import { DemoStatusEnum } from '../models/license.model';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class DemoHelper {
  constructor(private translateService: TranslateService, private notificationService: NotificationService) {}

  public static calculateDemoLeftDays(date: Date): number {
    const dateNow = new Date().getTime();
    const dateExpired = new Date(date).getTime();
    return dateExpired >= dateNow ? Math.round((dateExpired - dateNow) / MILLISECONDS_IN_DAY) : 0;
  }

  public static calculateDemoStatus(daysLeft: number): DemoStatusEnum {
    let demoStatus: DemoStatusEnum = DemoStatusEnum.DEMO_END;
    if (daysLeft >= 31) {
      demoStatus = DemoStatusEnum.DEMO_ADVISE;
    } else if (daysLeft >= 16) {
      demoStatus = DemoStatusEnum.DEMO_WARNING;
    }
    return demoStatus;
  }

  public showDemoAlert(demoStatus: DemoStatusEnum, daysLeft: number) {
    let literalMessageDays: string;
    let literalMessageText: string;

    this.translateService.get(daysLeft === 1 ? 'day' : 'days').subscribe((literalValue: string) => {
      literalMessageDays = literalValue;
    });
    this.translateService.get('trial-period').subscribe((literalValue: string) => {
      literalMessageText = literalValue;
    });
    switch (demoStatus) {
      case DemoStatusEnum.DEMO_WARNING:
        this.notificationService.demoWarningMessage(
          literalMessageText + ' <b>' + daysLeft + ' ' + literalMessageDays + '</b>'
        );
        break;
      case DemoStatusEnum.DEMO_END:
        this.notificationService.demoWarningEndMessage(
          literalMessageText + ' <b>' + daysLeft + ' ' + literalMessageDays + ' </b>'
        );
        break;
      default:
        break;
    }
  }
}
