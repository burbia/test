import { LicenseView, DemoStatusEnum } from 'src/app/models/license.model';
import { Injectable, OnDestroy, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { interval, Subscription, Observable } from 'rxjs';
import { License, LicenseStatusEnum } from 'src/app/models/license.model';
import { DemoHelper } from 'src/app/helpers/demo-helper';
import { MILLISECONDS_IN_MINUTE, MILLISECONDS_IN_SECOND } from 'src/app/components/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class LicenseService implements OnDestroy {
  private licenseView: LicenseView;
  private intervalRequest: Observable<number> = interval(MILLISECONDS_IN_MINUTE);
  private intervalDemoMessages: Observable<number> = interval(MILLISECONDS_IN_SECOND);
  private internalRequestSubscription: Subscription;
  private intervalDemoMessagesSubscription: Subscription;
  private alertDemoWarningHasBeenShowen = { 12: false };
  private alertDemoEndHasBeenShowen = { 8: false, 16: false, 0: false };

  @Output() onChangeStatus = new EventEmitter<LicenseView>();
  @Output() onShowDemoAlert = new EventEmitter<DemoStatusEnum>();

  constructor(private http: HttpClient) {
    this.startRefreshLicenseStatus();
  }

  ngOnDestroy(): void {
    this.stopRefreshLicenseStatus();
  }

  public startRefreshLicenseStatus() {
    this.internalRequestSubscription = this.intervalRequest.subscribe(() => this.refreshLicense());
    this.intervalDemoMessagesSubscription = this.intervalDemoMessages.subscribe(() => this.emitShowDemoMessage());
  }

  public stopRefreshLicenseStatus() {
    this.internalRequestSubscription.unsubscribe();
    this.intervalDemoMessagesSubscription.unsubscribe();
  }

  public loadLicense(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getLicenseStatus().subscribe((license: License) => {
        this.licenseView = this.processLicense(license);
        if (license.status === LicenseStatusEnum.LICENSED) {
          this.stopRefreshLicenseStatus();
        }
        resolve(true);
      });
    });
  }

  public getLicenseView() {
    return this.licenseView;
  }

  private processLicense(license: License): LicenseView {
    let licenseView: LicenseView;
    switch (license.status) {
      case LicenseStatusEnum.NOT_LICENSED:
      case LicenseStatusEnum.EXPIRED_DEMO_PERIOD:
      case LicenseStatusEnum.LICENSE_EXPIRED:
        licenseView = { daysLeft: 0, demoStatus: DemoStatusEnum.NO_DEMO, isLicense: false };
        break;
      case LicenseStatusEnum.DEMO_PERIOD:
        const daysLeft = DemoHelper.calculateDemoLeftDays(license.dueDate);
        licenseView = {
          daysLeft: daysLeft,
          demoStatus: DemoHelper.calculateDemoStatus(daysLeft),
          isLicense: true
        };
        break;
      case LicenseStatusEnum.LICENSED:
      default:
        licenseView = { daysLeft: 0, demoStatus: DemoStatusEnum.NO_DEMO, isLicense: true };
        break;
    }
    return licenseView;
  }

  private getLicenseStatus() {
    return this.http.get(environment.licenseUrl + 'license');
  }

  private refreshLicense(): void {
    const subs = this.getLicenseStatus().subscribe((license: License) => {
      if (license) {
        this.licenseView = this.processLicense(license);
        if (license.status === LicenseStatusEnum.LICENSED) {
          this.stopRefreshLicenseStatus();
        }
        this.onChangeStatus.emit(this.licenseView);
      }
      setTimeout(() => {
        subs.unsubscribe();
      });
    });
  }

  private emitShowDemoMessage(): void {
    const date = new Date();
    const hours = date.getHours();
    if (this.licenseView) {
      switch (this.licenseView.demoStatus) {
        case DemoStatusEnum.DEMO_WARNING: {
          switch (hours) {
            case 12: {
              if (date.getMinutes() === 0 && !this.alertDemoWarningHasBeenShowen[hours]) {
                this.alertDemoWarningHasBeenShowen[hours] = true;
                this.onShowDemoAlert.emit(DemoStatusEnum.DEMO_WARNING);
              }
              break;
            }
            case 1: {
              Object.keys(this.alertDemoEndHasBeenShowen).forEach(
                field => (this.alertDemoEndHasBeenShowen[field] = false)
              );
              break;
            }
            default:
              break;
          }
          break;
        }
        case DemoStatusEnum.DEMO_END: {
          switch (hours) {
            case 8:
            case 16:
            case 0: {
              if (date.getMinutes() === 0 && !this.alertDemoEndHasBeenShowen[hours]) {
                this.alertDemoEndHasBeenShowen[hours] = true;
                this.onShowDemoAlert.emit(DemoStatusEnum.DEMO_END);
              }
              break;
            }
            case 1: {
              Object.keys(this.alertDemoEndHasBeenShowen).forEach(
                field => (this.alertDemoEndHasBeenShowen[field] = false)
              );
              break;
            }
            default:
              break;
          }
          break;
        }
        default:
          break;
      }
    }
  }
}
