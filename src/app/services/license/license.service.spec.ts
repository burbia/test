import { getRandomInt } from 'src/app/test-utils/util';
import { LicenseView, DemoStatusEnum } from 'src/app/models/license.model';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LicenseService } from './license.service';
import { DemoHelper } from 'src/app/helpers/demo-helper';
import {
  MILLISECONDS_IN_MINUTE,
  MILLISECONDS_IN_DAY,
  SECONDS_IN_DAY,
  MILLISECONDS_IN_SECOND
} from 'src/app/components/shared/app-constants';

describe('DemoHelper', () => {
  var dueDate = new Date();
  const days = getRandomInt(90);
  dueDate.setDate(dueDate.getDate() + days);

  var license = {
    status: 'DEMO_PERIOD', //NOT_LICENSED, EXPIRED_DEMO_PERIOD, LICENSE_EXPIRED, LICENSED, DEMO_PERIOD,
    validationResult: 'NO_KEY',
    dueDate: dueDate.toUTCString() // "2020-06-09T10:09:01.174892500Z --> yyyy-MM-ddThh:mm:ss
  };
  var httpClientMock: Partial<HttpClient> = {
    get(url: string): any {
      return of(license);
    }
  };
  function setUp(httpClient = httpClientMock) {
    TestBed.configureTestingModule({
      providers: [LicenseService, { provide: HttpClient, useValue: httpClient }]
    });

    const spyHttpClientMock = jest.spyOn(httpClient, 'get').mockClear();
    const licenseService: LicenseService = TestBed.get(LicenseService);
    const spyOnChangeStatus = jest.spyOn(licenseService.onChangeStatus, 'emit');
    const spyOnShowDemoAlert = jest.spyOn(licenseService.onShowDemoAlert, 'emit');

    return {
      licenseService,
      spyHttpClientMock,
      spyOnChangeStatus,
      spyOnShowDemoAlert
    };
  }

  test('call LicenseService -> loadLicense check licenseView result', async () => {
    const { licenseService, spyHttpClientMock } = setUp();

    // Check license
    const licenseViewExpected: LicenseView = {
      isLicense: true,
      demoStatus: DemoHelper.calculateDemoStatus(days),
      daysLeft: DemoHelper.calculateDemoLeftDays(dueDate)
    };

    licenseService.loadLicense().then(() => {
      expect(licenseService.getLicenseView()).toEqual(licenseViewExpected);
      // spys calls
      expect(spyHttpClientMock).toHaveBeenCalledTimes(1);
    });
    // Call to ngOnDestroy
    licenseService.ngOnDestroy();
  });

  test('LicenseService -> refreshLicense check licenseView result after one minute passed', fakeAsync(() => {
    const { licenseService, spyHttpClientMock, spyOnChangeStatus, spyOnShowDemoAlert } = setUp();

    const licenseViewExpected: LicenseView = {
      isLicense: true,
      demoStatus: DemoHelper.calculateDemoStatus(days),
      daysLeft: DemoHelper.calculateDemoLeftDays(dueDate)
    };
    // Call to load to initialize license
    licenseService.loadLicense();
    // simulate time passes
    tick(MILLISECONDS_IN_MINUTE);
    // emit
    licenseService.onChangeStatus.subscribe((onChangeStatus: LicenseView) =>
      expect(onChangeStatus).toEqual(licenseViewExpected)
    );

    // Call to ngOnDestroy
    licenseService.ngOnDestroy();

    expect(spyHttpClientMock).toHaveBeenCalledTimes(2);
    expect(spyOnChangeStatus).toHaveBeenCalledTimes(1);
    expect(spyOnShowDemoAlert).toHaveBeenCalledTimes(0);
  }));
/*
  test('LicenseService -> refreshLicense check licenseView result after time passed', fakeAsync(() => {
    const startDate: number = Date.now();
    const endDate: number = startDate + 90 * MILLISECONDS_IN_DAY;
    var dueDateNowPlus90Days = new Date();
    dueDateNowPlus90Days.setDate(dueDateNowPlus90Days.getDate() + 90);
    license = {
      status: 'DEMO_PERIOD',
      validationResult: 'NO_KEY',
      dueDate: dueDateNowPlus90Days.toUTCString()
    };

    // Build fake backend service simulate demo period
    httpClientMock = {
      get(url: string): any {
        const dateNow: number = Date.now();
        const diffDates: number = endDate - dateNow;
        if (diffDates > 0) {
          return of(license);
        } else {
          return of({ ...license, status: 'EXPIRED_DEMO_PERIOD' });
        }
      }
    };

    const { licenseService, spyHttpClientMock, spyOnChangeStatus, spyOnShowDemoAlert } = setUp(httpClientMock);

    // Call to load to initialize license
    licenseService.loadLicense();

    var diffDatesInDays: number = 0;

    // Check license
    var licenseView: LicenseView;
    licenseService.onChangeStatus.subscribe((result: LicenseView) => (licenseView = result));
    // check show demo alert
    licenseService.onShowDemoAlert.subscribe((result: DemoStatusEnum) => {
      var date = new Date();
      expect(result === DemoStatusEnum.DEMO_WARNING || result === DemoStatusEnum.DEMO_END).toBeTruthy();
      switch (result) {
        case DemoStatusEnum.DEMO_WARNING: {
          expect(date.getHours() === 12 && date.getMinutes() === 0 && date.getSeconds() === 0).toBeTruthy();
          break;
        }
        case DemoStatusEnum.DEMO_END: {
          expect(date.getHours() === 8 || date.getHours() === 16 || date.getHours() === 0).toBeTruthy();
          expect(date.getMinutes() === 0 && date.getSeconds() === 0).toBeTruthy();
          break;
        }
      }
    });

    // simulate clock
    var diffDatesInDaysBefore: number = 0;
    for (let i = 0; i <= 91 * SECONDS_IN_DAY; i++) {
      tick(MILLISECONDS_IN_SECOND);
      const dateNow: number = Date.now();
      diffDatesInDays = Math.round((dateNow - startDate) / MILLISECONDS_IN_DAY);
      if (diffDatesInDaysBefore !== diffDatesInDays) {
        // Check counter every day changes and demo status have the correct status
        expect(licenseView).toEqual({
          isLicense: 91 - diffDatesInDays >= 1,
          demoStatus: getDemoStatusExpected(91 - diffDatesInDays),
          daysLeft: 91 - diffDatesInDays > 0 ? 91 - diffDatesInDays : 0
        });
        diffDatesInDaysBefore = diffDatesInDays;
      }
    }

    // Call to ngOnDestroy
    licenseService.ngOnDestroy();

    expect(spyHttpClientMock).toHaveBeenCalledTimes((91 * SECONDS_IN_DAY) / 60 + 1); // +1 -> load initial
    expect(spyOnChangeStatus).toHaveBeenCalledTimes((91 * SECONDS_IN_DAY) / 60);
    expect(spyOnShowDemoAlert).toHaveBeenCalled();
  }));
*/
  test('LicenseService -> refreshLicense received NOT_LICENSED', fakeAsync(() => {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate());

    httpClientMock = {
      get(url: string): any {
        return of({
          status: 'NOT_LICENSED',
          validationResult: 'NO_KEY',
          dueDate: dueDate.toUTCString()
        });
      }
    };

    const { licenseService, spyHttpClientMock, spyOnChangeStatus, spyOnShowDemoAlert } = setUp(httpClientMock);

    // Call to load to initialize license
    licenseService.loadLicense();
    // simulate clock
    tick(MILLISECONDS_IN_MINUTE);
    licenseService.onChangeStatus.subscribe((licenseView: LicenseView) => {
      expect(licenseView).toEqual({
        isLicense: false,
        demoStatus: DemoStatusEnum.NO_DEMO,
        daysLeft: 0
      });
    });

    // Call to ngOnDestroy
    licenseService.ngOnDestroy();

    expect(spyHttpClientMock).toHaveBeenCalledTimes(2);
    expect(spyOnChangeStatus).toHaveBeenCalledTimes(1);
    expect(spyOnShowDemoAlert).toHaveBeenCalledTimes(0);
  }));

  test('LicenseService -> refreshLicense received EXPIRED_DEMO_PERIOD', fakeAsync(() => {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate());

    httpClientMock = {
      get(url: string): any {
        return of({
          status: 'EXPIRED_DEMO_PERIOD',
          validationResult: 'NO_KEY',
          dueDate: dueDate.toUTCString()
        });
      }
    };

    const { licenseService, spyHttpClientMock, spyOnChangeStatus, spyOnShowDemoAlert } = setUp(httpClientMock);

    // Call to load to initialize license
    licenseService.loadLicense();
    // simulate clock
    tick(MILLISECONDS_IN_MINUTE);
    licenseService.onChangeStatus.subscribe((licenseView: LicenseView) => {
      expect(licenseView).toEqual({
        isLicense: false,
        demoStatus: DemoStatusEnum.NO_DEMO,
        daysLeft: 0
      });
    });

    // Call to ngOnDestroy
    licenseService.ngOnDestroy();

    expect(spyHttpClientMock).toHaveBeenCalledTimes(2);
    expect(spyOnChangeStatus).toHaveBeenCalledTimes(1);
    expect(spyOnShowDemoAlert).toHaveBeenCalledTimes(0);
  }));

  test('LicenseService -> refreshLicense received LICENSE_EXPIRED', fakeAsync(() => {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate());

    httpClientMock = {
      get(url: string): any {
        return of({
          status: 'LICENSE_EXPIRED',
          validationResult: 'NO_KEY',
          dueDate: dueDate.toUTCString()
        });
      }
    };

    const { licenseService, spyHttpClientMock, spyOnChangeStatus, spyOnShowDemoAlert } = setUp(httpClientMock);

    // Call to load to initialize license
    licenseService.loadLicense();
    // simulate clock
    tick(MILLISECONDS_IN_MINUTE);
    licenseService.onChangeStatus.subscribe((licenseView: LicenseView) => {
      expect(licenseView).toEqual({
        isLicense: false,
        demoStatus: DemoStatusEnum.NO_DEMO,
        daysLeft: 0
      });
    });

    // Call to ngOnDestroy
    licenseService.ngOnDestroy();

    expect(spyHttpClientMock).toHaveBeenCalledTimes(2);
    expect(spyOnChangeStatus).toHaveBeenCalledTimes(1);
    expect(spyOnShowDemoAlert).toHaveBeenCalledTimes(0);
  }));

  test('LicenseService -> refreshLicense received LICENSED', fakeAsync(() => {
    dueDate = new Date();
    dueDate.setDate(dueDate.getDate());

    httpClientMock = {
      get(url: string): any {
        return of({
          status: 'LICENSED',
          validationResult: 'NO_KEY',
          dueDate: dueDate.toUTCString()
        });
      }
    };

    const { licenseService, spyHttpClientMock, spyOnChangeStatus, spyOnShowDemoAlert } = setUp(httpClientMock);

    // Call to load to initialize license
    licenseService.loadLicense();
    // simulate clock one day after
    tick(MILLISECONDS_IN_DAY);
    // Call to ngOnDestroy
    licenseService.ngOnDestroy();

    expect(spyHttpClientMock).toHaveBeenCalledTimes(1);
    expect(spyOnChangeStatus).toHaveBeenCalledTimes(0);
    expect(spyOnShowDemoAlert).toHaveBeenCalledTimes(0);
  }));

  function getDemoStatusExpected(daysLeft: number): DemoStatusEnum {
    let demoStatus: DemoStatusEnum = DemoStatusEnum.NO_DEMO;
    if (daysLeft >= 31) {
      demoStatus = DemoStatusEnum.DEMO_ADVISE;
    } else if (daysLeft >= 16) {
      demoStatus = DemoStatusEnum.DEMO_WARNING;
    } else if (daysLeft >= 1) {
      demoStatus = DemoStatusEnum.DEMO_END;
    }
    return demoStatus;
  }
});
