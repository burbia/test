import { getRandomInt } from 'src/app/test-utils/util';
import { NotificationService } from 'src/app/services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { DemoHelper } from './demo-helper';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { DemoStatusEnum } from '../models/license.model';

describe('DemoHelper', () => {
  let translateServiceMock: Partial<TranslateService> = {
    get(key: any): any {
      return of(key);
    }
  };

  let notificationServiceMock: Partial<NotificationService> = {
    demoWarningMessage: function() {},
    demoWarningEndMessage: function() {}
  };

  function setUp(translateService = translateServiceMock, notificationService = notificationServiceMock) {
    const spyTranslateServiceMock = jest.spyOn(translateServiceMock, 'get').mockClear();
    const spyNotificationServiceDemoWarningMessageMock = jest
      .spyOn(notificationServiceMock, 'demoWarningMessage')
      .mockClear();
    const spyNotificationServiceDemoWarningEndMessageMock = jest
      .spyOn(notificationServiceMock, 'demoWarningEndMessage')
      .mockClear();

    TestBed.configureTestingModule({
      providers: [
        DemoHelper,
        { provide: TranslateService, useValue: translateService },
        { provide: NotificationService, useValue: notificationService }
      ]
    });

    const demoHelper: DemoHelper = TestBed.get(DemoHelper);

    return {
      demoHelper,
      spyNotificationServiceDemoWarningMessageMock,
      spyNotificationServiceDemoWarningEndMessageMock,
      spyTranslateServiceMock
    };
  }

  test('call method showDemoAlert with NO_DEMO and 0 days left', async () => {
    const {
      demoHelper,
      spyNotificationServiceDemoWarningMessageMock,
      spyNotificationServiceDemoWarningEndMessageMock,
      spyTranslateServiceMock
    } = setUp();

    demoHelper.showDemoAlert(DemoStatusEnum.NO_DEMO, 0);

    // spys calls
    expect(spyNotificationServiceDemoWarningMessageMock).toHaveBeenCalledTimes(0);
    expect(spyNotificationServiceDemoWarningEndMessageMock).toHaveBeenCalledTimes(0);
    expect(spyTranslateServiceMock).toHaveBeenCalledTimes(2);
  });

  test('call method showDemoAlert with DEMO_ADVISE and 60 days left', async () => {
    const {
      demoHelper,
      spyNotificationServiceDemoWarningMessageMock,
      spyNotificationServiceDemoWarningEndMessageMock,
      spyTranslateServiceMock
    } = setUp();

    demoHelper.showDemoAlert(DemoStatusEnum.DEMO_ADVISE, 60);

    // spys calls
    expect(spyNotificationServiceDemoWarningMessageMock).toHaveBeenCalledTimes(0);
    expect(spyNotificationServiceDemoWarningEndMessageMock).toHaveBeenCalledTimes(0);
    expect(spyTranslateServiceMock).toHaveBeenCalledTimes(2);
  });

  test('call method showDemoAlert with DEMO_WARNING and 31 days left', async () => {
    const {
      demoHelper,
      spyNotificationServiceDemoWarningMessageMock,
      spyNotificationServiceDemoWarningEndMessageMock,
      spyTranslateServiceMock
    } = setUp();

    demoHelper.showDemoAlert(DemoStatusEnum.DEMO_WARNING, 31);

    // spys calls
    expect(spyNotificationServiceDemoWarningMessageMock).toHaveBeenCalledTimes(1);
    expect(spyNotificationServiceDemoWarningEndMessageMock).toHaveBeenCalledTimes(0);
    expect(spyTranslateServiceMock).toHaveBeenCalledTimes(2);
  });

  test('call method showDemoAlert with DEMO_END and 1 days left', async () => {
    const {
      demoHelper,
      spyNotificationServiceDemoWarningMessageMock,
      spyNotificationServiceDemoWarningEndMessageMock,
      spyTranslateServiceMock
    } = setUp();

    demoHelper.showDemoAlert(DemoStatusEnum.DEMO_END, 1);

    // spys calls
    expect(spyNotificationServiceDemoWarningMessageMock).toHaveBeenCalledTimes(0);
    expect(spyNotificationServiceDemoWarningEndMessageMock).toHaveBeenCalledTimes(1);
    expect(spyTranslateServiceMock).toHaveBeenCalledTimes(2);
  });

  test('test method calculateDemoLeftDays', async () => {
    var date = new Date();
    const days = getRandomInt(90);
    date.setDate(date.getDate() + days);

    expect(DemoHelper.calculateDemoLeftDays(date)).toEqual(days);
  });

  test('test method calculateDemoStatus', async () => {
    const days = getRandomInt(90);
    expect(DemoHelper.calculateDemoStatus(days)).toEqual(getDemoStatusExpected(days));
  });

  function getDemoStatusExpected(daysLeft: number): DemoStatusEnum {
    let demoStatus: DemoStatusEnum = DemoStatusEnum.DEMO_END;
    if (daysLeft >= 31) {
      demoStatus = DemoStatusEnum.DEMO_ADVISE;
    } else if (daysLeft >= 16) {
      demoStatus = DemoStatusEnum.DEMO_WARNING;
    }
    return demoStatus;
  }
});
