import { DemoHelper } from 'src/app/helpers/demo-helper';
import { LicenseView, DemoStatusEnum } from './../../models/license.model';
import { LicenseService } from 'src/app/services/license/license.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddDashboardComponent } from '../modals/modal-add-dashboard/modal-add-dashboard.component';
import { Router } from '@angular/router';
import { v4 as uuid } from 'uuid';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Dashboard } from 'src/app/models/dashboard.model';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ScreenCodes } from '../shared/app-constants';
import { ModalAboutComponent } from '../modals/modal-about/modal-about.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-management',
  templateUrl: './dashboard-management.component.html',
  styleUrls: ['./dashboard-management.component.scss']
})
export class DashboardManagementComponent implements OnInit, OnDestroy {
  userName: string;
  userAlias: string;
  license: LicenseView;
  licenseStatusChangeSubcription: Subscription;
  showDemoAlertSubscription: Subscription;

  dashboardTitleForm = new FormGroup({
    inputTitle: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  dashboards: Array<Dashboard> = [];

  searchText: string;

  constructor(
    public dialog: MatDialog,
    private router: Router,
    private dashboardService: DashboardService,
    private translate: TranslateService,
    private notificationService: NotificationService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private licenseService: LicenseService,
    private demoHelper: DemoHelper
  ) {
    this.license = licenseService.getLicenseView();
  }
  ngOnDestroy(): void {
    this.licenseStatusChangeSubcription.unsubscribe();
    this.showDemoAlertSubscription.unsubscribe();
  }

  ngOnInit() {
    this.userName = this.userService.getUserName();
    const userNameSplit = this.userName.split(' ');
    if (userNameSplit.length === 1) {
      this.userAlias = userNameSplit[0][0].toUpperCase();
    } else {
      this.userAlias = userNameSplit[0][0] + userNameSplit[1][0];
    }
    this.dashboardService.getDashboards().subscribe(
      (result: Array<Dashboard>) => {
        this.dashboards = result;
      },
      error => {
        this.notificationService.errorMessage('something-wrong');
      }
    );

    // Demo period
    this.licenseStatusChangeSubcription = this.licenseService.onChangeStatus.subscribe((license: LicenseView) =>
      this.processLicense(license)
    );
    this.showDemoAlertSubscription = this.licenseService.onShowDemoAlert.subscribe((demoStatus: DemoStatusEnum) =>
      this.demoHelper.showDemoAlert(demoStatus, this.license.daysLeft)
    );
  }

  changeLang(lang: string) {
    this.translate.use(lang);
  }

  addDashboard() {
    const dialogRef = this.dialog.open(ModalAddDashboardComponent, {
      autoFocus: false,
      closeOnNavigation: true,
      panelClass: 'modal-add-dashboard'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const dashboard = {
          title: result,
          dashboardId: uuid(),
          creationDate: new Date().toISOString(),
          editingTitle: false
        };
        this.dashboardService.createDashboard(dashboard).subscribe(
          (dashboardResult: any) => {
            dashboardResult.dashboardId = dashboardResult.dashboardId.id;
            this.dashboards.push(dashboardResult);
            this.notificationService.okMessage('dashboard-created');
          },
          error => {
            this.notificationService.errorMessage('something-wrong');
          }
        );
      }
    });
  }

  duplicateDashboard(dashboard: Dashboard) {
    this.dashboardService.duplicateDashboard(dashboard).subscribe(
      (result: any) => {
        const dashboardResult: Dashboard = {
          title: result.title,
          dashboardId: result.dashboardId.id,
          creationDate: result.creationDate,
          editingTitle: false
        };
        this.dashboards.push(dashboardResult);
        this.notificationService.okMessage('dashboard-created');
      },
      error => {
        this.notificationService.errorMessage('something-wrong');
      }
    );
  }

  deleteDashboard(dashboard: Dashboard) {
    this.dashboardService.deleteDashboard(dashboard).subscribe(
      result => {
        const dashboardIndex = this.dashboards.findIndex(dash => dash.dashboardId === dashboard.dashboardId);
        this.dashboards.splice(dashboardIndex, 1);
        this.notificationService.okMessage('dashboard-deleted');
      },
      error => {
        this.notificationService.errorMessage('something-wrong');
      }
    );
  }

  launchDashboard(dashboard: Dashboard) {
    this.router.navigate(['/dashboard', dashboard.dashboardId]);
  }

  get titleForm() {
    return this.dashboardTitleForm.controls;
  }

  updateTitle(dashboard: Dashboard) {
    const dashboardIndex = this.dashboards.findIndex((dash: Dashboard) => dash.dashboardId === dashboard.dashboardId);
    const title = this.dashboardTitleForm.controls['inputTitle'].value;

    if (this.dashboardTitleForm.controls['inputTitle'].valid) {
      dashboard.title = title;
      this.dashboardService.updateDashboard(dashboard).subscribe(
        (result: Dashboard) => {
          this.dashboards[dashboardIndex].title = result.title;
          this.notificationService.okMessage('dashboard-updated');
        },
        error => {
          this.notificationService.errorMessage('something-wrong');
        }
      );
    }
  }

  focusTitleInput(dashboard: Dashboard) {
    this.dashboards.forEach(dash => {
      if (dash.dashboardId !== dashboard.dashboardId) {
        dash.editingTitle = false;
      }
    });
    this.dashboardTitleForm.controls['inputTitle'].setValue(dashboard.title);
  }

  logout() {
    this.authenticationService.logout();
  }

  launchUserAssistance() {
    this.userService.openUA(ScreenCodes.DashboardManagement);
  }

  launchAbout() {
    this.dialog.open(ModalAboutComponent, {
      autoFocus: false,
      closeOnNavigation: true,
      panelClass: 'modal-about'
    });
  }

  shareDashboard(dashboard: Dashboard) {
    this.userService.shareDashboard(dashboard.dashboardId);
  }

  processLicense(license: LicenseView) {
    this.license = license;
  }
}
