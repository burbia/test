import { EventType, localStorageDashboardEventIdArrayVarName } from './../shared/app-constants';
import { ScheduledConfig } from 'src/app/models/ScheduledConfig.model';
import { DemoHelper } from 'src/app/helpers/demo-helper';
import { LicenseView, DemoStatusEnum } from 'src/app/models/license.model';
import { LicenseService } from 'src/app/services/license/license.service';
import { LabService } from 'src/app/services/lab/lab.service';
import { Component, OnInit, ViewChild, ComponentRef, AfterContentInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as screenfull from 'screenfull';
import { DisplayGrid, GridsterConfig, GridType } from 'angular-gridster2';
import { DashboardService } from 'src/app/services/dashboard/dashboard.service';
import { Widget } from 'src/app/models/widget.model';
import { DashboardItem } from 'src/app/models/dashboard-item.model';
import { LpmDashboardItemComponent } from '../dashboard-item/lpm-dashoard-item.component';
import { WidgetCodes, WidgetSubCodes, ScreenCodes, ANY_ITEM, WidgetTypes } from '../shared/app-constants';
import { UpdateService } from 'src/app/services/update-service/update.service';
import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';
import * as widgets from '../widgets';
import { NotificationService } from 'src/app/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Dashboard } from 'src/app/models/dashboard.model';
import { DashboardItemRemoved } from 'src/app/models/dashboard-item-removed.model';
import { UserService } from 'src/app/services/user/user.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Subscription } from 'rxjs';
import { ModalResetDashboardComponent } from 'src/app/components/modals/modal-reset-dashboard/modal-reset-dashboard.component';
import { DashboardResetEvent, DashboardResetEventTypeEnum } from 'src/app/models/dashboard-reset-event.model';
import { TranslateService } from '@ngx-translate/core';

declare var particlesJS: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({ transform: 'translateY(0%)' })),
      state('false', style({ transform: 'translateY(100%)' })),
      transition('true => false', animate('200ms ease-in', style({ transform: 'translateY(100%)' }))),
      transition('false => true', animate('200ms ease-in', style({ transform: 'translateY(0%)' })))
    ])
  ]
})
export class DashboardComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('sidenav', { static: true }) sidenav: MatSidenav;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public dashboard: LpmDashboardItemComponent<WidgetConfiguration>[] = [];
  dashboardTitle: string;
  widgetsBin: Array<DashboardItemRemoved> = [];
  widgetsBinDataSource = new MatTableDataSource<DashboardItemRemoved>(this.widgetsBin);
  widgetsBinSelected = new SelectionModel<DashboardItemRemoved>(true, []);
  widgetsBinColumns: string[] = ['select', 'code', 'name', 'size', 'deletedTime'];
  public options: GridsterConfig;
  public editing = false;
  trashVisible = false;
  desiredItem: LpmDashboardItemComponent<WidgetConfiguration>;
  selectedWidget: string;
  information: string;
  widgets: Widget[];
  dashboardId: string;
  time: Date;
  fullscreenStatus = true;
  isLoggedIn = false;
  widgetOutputs = {
    onUpdateTitle: widget => this.updateTitle(widget)
  };
  widgetsRefs = new Map();
  availableWidgets = new Map();
  availableWidgetsCNS = new Map();
  zoomValue = 1;
  opacityValue = 0;
  darkMode = false;
  clockInterval: any;
  readonly secondsInMinute: number = 60;
  readonly miliSecondsInSecond: number = 1e3;

  license: LicenseView;
  licenseStatusChangeSubcription: Subscription;
  showDemoAlertSubscription: Subscription;
  resetTime: string;
  dashboardEventIdProcessed: Array<string>;

  constructor(
    private dashboardService: DashboardService,
    public dialog: MatDialog,
    private updateService: UpdateService,
    private labService: LabService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private licenseService: LicenseService,
    private demoHelper: DemoHelper,
    private translateService: TranslateService
  ) {
    this.license = licenseService.getLicenseView();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.dashboardId = params.get('id');
      this.dashboardService.getDashboard(this.dashboardId).subscribe(
        (result: Dashboard) => {
          this.dashboardTitle = result.title;
          if (result.widgets.length > 0 || result.deletedWidgets.length > 0) {
            this.recoverWidgets(result.widgets, result.deletedWidgets);
          } else {
            if (this.authenticationService.isLoggedIn()) {
              this.sidenav.open();
            }
          }
          if (this.authenticationService.isLoggedIn()) {
            this.isLoggedIn = true;
          } else {
            this.isLoggedIn = false;
            this.disableEdit();
          }
          // Reset Time
          this.resetTime = result.resetTime ? result.resetTime : '';
        },
        error => this.router.navigate(['dashboardManagement'])
      );
    });

    Object.entries(widgets).forEach(([key, value]) => {
      this.availableWidgets.set(value.getCode(), value);
      if (key === 'ConnectionStatusWidgetComponent' || key === 'ConnectionStatusHostComponent') {
        this.availableWidgetsCNS.set(value.getSubCode(), value);
      }
    });
    this.clockInterval = setInterval(() => {
      const date = new Date();
      this.time = date;
      if (date.getHours() === 0 && date.getMinutes() === 3 && date.getSeconds() === 0) {
        window.location.reload();
      }
    }, 1000);
    const cols = 4;
    this.options = {
      gridType: GridType.Fixed,
      displayGrid: DisplayGrid.None,
      enableEmptyCellClick: false,
      emptyCellClickCallback: this.addItem.bind(this),
      draggable: {
        enabled: false,
        stop: this.dragItem.bind(this)
      },
      resizable: {
        enabled: false,
        stop: this.resizeItem.bind(this)
      },
      minCols: cols,
      minRows: Math.round(window.innerHeight / 160) - 1,
      fixedColWidth: 160,
      fixedRowHeight: 160,
      margin: 12,
      outerMarginTop: 16,
      outerMarginBottom: 28,
      outerMarginRight: 18,
      outerMarginLeft: 18
    };
    this.widgets = this.dashboardService.getWidgets();
    this.updateService.start();
    this.options.displayGrid = DisplayGrid.Always;
    this.options.enableEmptyCellClick = true;
    this.options.draggable.enabled = true;
    this.options.resizable.enabled = true;
    this.editing = true;

    screenfull.on('change', () => {
      if (screenfull.isFullscreen) {
        this.fullscreenStatus = false;
      } else {
        this.fullscreenStatus = true;
      }
    });

    // Demo period
    this.licenseStatusChangeSubcription = this.licenseService.onChangeStatus.subscribe((license: LicenseView) =>
      this.processLicense(license)
    );
    this.showDemoAlertSubscription = this.licenseService.onShowDemoAlert.subscribe((demoStatus: DemoStatusEnum) =>
      this.demoHelper.showDemoAlert(demoStatus, this.license.daysLeft)
    );

    // Dashboard id notifications
    var localArrayIds = JSON.parse(localStorage.getItem(localStorageDashboardEventIdArrayVarName));
    this.dashboardEventIdProcessed = localArrayIds ? localArrayIds : [];
  }

  ngOnDestroy(): void {
    this.updateService.stop();
    clearInterval(this.clockInterval);
    this.licenseStatusChangeSubcription.unsubscribe();
    this.showDemoAlertSubscription.unsubscribe();
    this.updateService.unsubscribe(this.dashboardId);
  }

  ngAfterContentInit(): void {
    particlesJS.load('particles-js', 'assets/particles.json', null);
    this.updateService.getSubscriber(this.dashboardId).subscribe((data: DashboardResetEvent) => {
      if (data !== null && !this.dashboardEventIdProcessed.includes(data.id)) {
        // Dashboard id notifications
        var localArrayIds = JSON.parse(localStorage.getItem(localStorageDashboardEventIdArrayVarName));
        this.dashboardEventIdProcessed = localArrayIds
          ? localArrayIds.length <= 300
            ? localArrayIds
            : localArrayIds.slice(1)
          : [];
        this.dashboardEventIdProcessed.push(data.id);
        localStorage.setItem(localStorageDashboardEventIdArrayVarName, JSON.stringify(this.dashboardEventIdProcessed));
        this.showAlertDashboardResetEvent(data);
      }
    });
  }

  showAlertDashboardResetEvent(data: DashboardResetEvent) {
    switch (data.eventType) {
      case DashboardResetEventTypeEnum.RESET_EVENT:
        this.notificationService.resetOK('dashboard-reseted');
        break;
      case DashboardResetEventTypeEnum.RESET_RETRIED:
        let message;
        this.translateService.get('reset-attempt-failed').subscribe((literalValue: string) => {
          message = literalValue;
        });
        this.notificationService.resetAttemptFail(data.attempts + '/' + data.totalAttempts + message);
        break;
      case DashboardResetEventTypeEnum.RESET_RETRIED_FAIL:
        this.notificationService.resetFail('reset-failed');
        break;
      default:
        break;
    }
  }

  fullscreen() {
    if (screenfull.enabled) {
      screenfull.toggle();
    }
  }

  onZoomChange(event: any) {
    this.options.fixedColWidth = 160 * event.value;
    this.options.fixedRowHeight = 160 * event.value;
    this.options.api.optionsChanged();
  }

  onOpacityChange(event) {
    this.opacityValue = event.value;
  }

  isAllBinSelected() {
    const numSelected = this.widgetsBinSelected.selected.length;
    let numRows = 0;
    if (this.widgetsBinDataSource) {
      numRows = this.widgetsBinDataSource.data.length;
    }
    return numSelected === numRows;
  }

  masterBinToggle() {
    this.isAllBinSelected()
      ? this.widgetsBinSelected.clear()
      : this.widgetsBinDataSource.data.forEach(row => this.widgetsBinSelected.select(row));
  }

  applyBinFilter(filterValue: string) {
    this.widgetsBinDataSource.filter = filterValue.trim().toLowerCase();
  }

  updateTitle(widget) {
    const index = this.dashboard.findIndex(element => element.oid === widget.oid);
    this.dashboardService.updateWidget(this.dashboard[index], this.dashboardId).subscribe();
  }

  public addItem($event: MouseEvent, item: LpmDashboardItemComponent<WidgetConfiguration>) {
    this.sidenav.open();
    this.desiredItem = item;
  }

  dragItem(item, gridsterItem) {
    if (this.checkIfPositionIsUpdated(item, gridsterItem)) {
      const item2 = gridsterItem.$item;
      item.x = item2.x;
      item.y = item2.y;
      const widgetToUpdate = item;
      if (!item.requiresConfiguration) {
        this.dashboardService.updateWidget(widgetToUpdate, this.dashboardId).subscribe();
      }
    }
  }
  resizeItem(item, gridsterItem) {
    if (this.checkIfSizeIsUpdated(item, gridsterItem)) {
      const item2 = gridsterItem.$item;
      const { colsAllowed, rowsAllowed } = this.widgetsRefs
        .get(item.oid)
        .instance.isAllowedSizeOrDefault(item2.cols, item2.rows);
      item2.cols = colsAllowed;
      item2.rows = rowsAllowed;
      item.cols = item2.cols;
      item.rows = item2.rows;
      const widgetToUpdate = item;
      if (!item.requiresConfiguration) {
        this.widgetsRefs.get(item.oid).instance.resize(item.cols, item.rows);
        this.dashboardService.updateWidget(widgetToUpdate, this.dashboardId).subscribe();
      }
    }
  }

  checkIfSizeIsUpdated(item, gridsterItem) {
    if (item.cols !== gridsterItem.$item.cols || item.rows !== gridsterItem.$item.rows) {
      return true;
    } else {
      return false;
    }
  }

  checkIfPositionIsUpdated(item, gridsterItem) {
    if (item.x !== gridsterItem.$item.x || item.y !== gridsterItem.$item.y) {
      return true;
    } else {
      return false;
    }
  }

  disableEdit() {
    this.dashboard = this.dashboard.filter(el => el.requiresConfiguration === false || el.code === WidgetCodes.LAY);
    this.options.displayGrid = DisplayGrid.None;
    this.options.enableEmptyCellClick = false;
    this.options.draggable.enabled = false;
    this.options.resizable.enabled = false;
    this.editing = false;
    this.options.api.optionsChanged();
  }

  swapFromEdit(edit: boolean) {
    if (this.isLoggedIn) {
      if (edit) {
        this.options.displayGrid = DisplayGrid.Always;
        this.options.enableEmptyCellClick = true;
        this.options.draggable.enabled = true;
        this.options.resizable.enabled = true;
        this.editing = true;
      } else {
        this.disableEdit();
        this.sidenav.close();
      }
    } else {
      this.router.navigate(['/dashboardManagement']);
    }

    this.options.api.optionsChanged();
  }
  public removeItem(item: LpmDashboardItemComponent<WidgetConfiguration>) {
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
    if (item.requiresConfiguration === false) {
      this.deleteWidget(item);
    }
  }
  removeElement(item: LpmDashboardItemComponent<WidgetConfiguration>, $event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.removeItem(item);
  }
  componentCreated(
    item: LpmDashboardItemComponent<WidgetConfiguration>,
    compRef: ComponentRef<LpmDashboardItemComponent<WidgetConfiguration>>
  ) {
    if (item.requiresConfiguration === false) {
      compRef.instance.configuration = item.configuration;
    }
    this.widgetsRefs.set(item.oid, compRef);
    compRef.instance.oid = item.oid;
    setTimeout(() => {
      compRef.instance.resize(item.cols, item.rows);
    }, 500);
  }

  onWidgetSelect(code: string) {
    if (code) {
      const widget = this.availableWidgets.get(code).createNew(this.updateService);

      if (this.desiredItem) {
        widget.x = this.desiredItem.x;
        widget.y = this.desiredItem.y;
      }

      if (widget.requiresConfiguration) {
        this.configureWidget(widget, false);
      } else {
        this.dashboard.push(widget);
        this.saveWidget(widget);
      }

      this.options.api.optionsChanged();
    }
  }

  saveWidget(widget: LpmDashboardItemComponent<WidgetConfiguration>) {
    this.dashboardService.saveWidget(widget, this.dashboardId).subscribe(
      result => {
        this.notificationService.okMessage('widget-added');
      },
      error => {
        this.notificationService.errorMessage('something-wrong');
      }
    );
  }

  deleteWidgetDefinetely() {
    this.widgetsBinSelected.selected.forEach(widget => {
      this.dashboardService.deleteWidgetDefinetely(widget, this.dashboardId).subscribe(
        (result: any) => {
          this.notificationService.okMessage('widget-removed');
          const index = this.widgetsBinDataSource.data.findIndex(widgetBinItem => widgetBinItem.id === widget.id);
          this.widgetsBinDataSource.data.splice(index, 1);
          this.widgetsBinDataSource.data = [...this.widgetsBinDataSource.data];
          this.widgetsBinSelected.clear();
        },
        error => {
          this.notificationService.errorMessage('something-wrong');
        }
      );
    });
  }

  deleteWidget(widget: LpmDashboardItemComponent<WidgetConfiguration>) {
    this.dashboardService.deleteWidget(widget, this.dashboardId).subscribe(
      (result: any) => {
        this.notificationService.okMessage('widget-removed');
        this.widgetsBinDataSource.data = result.deletedWidgets;
        this.widgetsBinSelected.clear();
      },
      error => {
        this.notificationService.errorMessage('something-wrong');
      }
    );
  }

  updateWidget(widget: LpmDashboardItemComponent<WidgetConfiguration>) {
    this.dashboardService.updateWidget(widget, this.dashboardId).subscribe(
      result => {
        this.notificationService.okMessage('widget-updated');
      },
      error => {
        this.notificationService.errorMessage('something-wrong');
      }
    );
  }

  duplicateWidget(item: LpmDashboardItemComponent<WidgetConfiguration>) {
    const widget = item.duplicate();
    this.saveDuplicateWidget(widget);
  }

  duplicateWidgetAs(item: LpmDashboardItemComponent<WidgetConfiguration>, type: string) {
    const widget = this.availableWidgets.get(type).createNew(this.updateService);
    widget.configuration = JSON.parse(JSON.stringify(item.configuration));
    widget.requiresConfiguration = false;
    switch (type) {
      case WidgetCodes.LST: {
        widget.configuration.alarmWarningTarget = '0';
        widget.configuration.organisations = ANY_ITEM;
        this.saveDuplicateWidget(widget);
        break;
      }
      case WidgetCodes.TAT: {
        widget.configuration.organisations = '';
        this.saveDuplicateWidget(widget);
        break;
      }
      default: {
        widget.requiresConfiguration = false;
        this.saveDuplicateWidget(widget);
      }
    }
  }

  saveDuplicateWidget(widget: LpmDashboardItemComponent<WidgetConfiguration>) {
    this.dashboardService.saveWidget(widget, this.dashboardId).subscribe(
      res => {
        this.dashboard.push(widget);
        this.notificationService.okMessage('widget-added');
      },
      error => {
        this.notificationService.errorMessage('something-wrong');
      }
    );
  }

  recoverWidgets(recoverWidgets: Array<DashboardItem>, deletedWidgets: Array<any>) {
    this.dashboard = [];
    recoverWidgets.forEach(widget => {
      this.rebuildWidget(widget);
    });
    deletedWidgets.forEach(widget => {
      this.widgetsBin.push(widget);
    });
    this.widgetsBinDataSource = new MatTableDataSource<DashboardItemRemoved>(this.widgetsBin);
    this.widgetsBinDataSource.filterPredicate = (data: any, filter: string) =>
      data.title.toLowerCase().includes(filter.toLowerCase());
    this.widgetsBinDataSource.sort = this.sort;
  }

  rebuildWidget(item: DashboardItem) {
    let widget;
    if (item.code === WidgetCodes.CNS) {
      if (item.configuration['type'].toUpperCase() === WidgetTypes.Host) {
        widget = this.availableWidgetsCNS
          .get('CNS_' + item.configuration['type'].toUpperCase())
          .rebuild(item, this.updateService, this.labService);
      } else {
        widget = this.availableWidgetsCNS
          .get('CNS_' + item.configuration['type'].toUpperCase())
          .rebuild(item, this.updateService);
      }
    } else {
      widget = this.availableWidgets.get(item.code).rebuild(item, this.updateService);
    }

    this.dashboard.push(widget);
    this.options.api.optionsChanged();
  }

  restoreWidget() {
    this.widgetsBinSelected.selected.forEach((item: DashboardItemRemoved) => {
      this.dashboardService.recoverWidget(this.dashboardId, item).subscribe((result: any) => {
        result.widgets.forEach(widget => {
          const widgetAlreadyInDashboard = this.dashboard.findIndex(element => element.oid === widget.id);
          if (widgetAlreadyInDashboard === -1) {
            const widgetToAdd = this.availableWidgets.get(widget.code).rebuild(widget, this.updateService);
            this.dashboard.push(widgetToAdd);
          }
        });
        this.widgetsBinDataSource.data = result.deletedWidgets;
      });
      this.widgetsBinSelected.clear();
      this.trashVisible = false;
      this.sidenav.toggle();
      this.notificationService.okMessage('widget-restored');
    });
  }

  configureWidget(widget: LpmDashboardItemComponent<WidgetConfiguration>, reconfigure: boolean) {
    const dialogRef = this.dialog.open(widget.getConfigurer(), {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: true,
      hasBackdrop: false,
      panelClass: 'modal-panel',
      data: {
        configuration: widget.configuration,
        reconfigure: reconfigure,
        widget: widget.code
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        switch (result.type) {
          case WidgetTypes.Host: {
            if (reconfigure === true) {
              const oldType = this.widgetsRefs.get(widget.oid).instance.configuration.type;
              if (oldType === WidgetTypes.Host) {
                this.widgetsRefs.get(widget.oid).instance.configuration = result;
                widget.configure(result);
                this.updateWidget(widget);
              } else {
                const newWidget = this.availableWidgetsCNS
                  .get(WidgetSubCodes.CNS_HOST)
                  .createNew(this.updateService, this.labService);
                newWidget.x = widget.x;
                newWidget.y = widget.y;
                newWidget.requiresConfiguration = false;
                newWidget.oid = widget.oid;
                newWidget.configure(result);
                this.updateWidget(newWidget);
                this.widgetsRefs.get(widget.oid).instance = newWidget;
                let index: number = this.dashboard.findIndex(element => element.oid === widget.oid);
                this.dashboard[index] = newWidget;
              }
            } else {
              const newWidget = this.availableWidgetsCNS
                .get(WidgetSubCodes.CNS_HOST)
                .createNew(this.updateService, this.labService);
              newWidget.x = widget.x;
              newWidget.y = widget.y;
              newWidget.requiresConfiguration = false;
              newWidget.oid = widget.oid;
              newWidget.configure(result);
              this.saveWidget(newWidget);
              this.dashboard.push(newWidget);
            }
            break;
          }
          case WidgetTypes.Instrument: {
            if (reconfigure === true) {
              const oldType = this.widgetsRefs.get(widget.oid).instance.configuration.type;
              if (oldType === WidgetTypes.Instrument) {
                this.widgetsRefs.get(widget.oid).instance.configuration = result;
                widget.configure(result);
                this.updateWidget(widget);
              } else {
                const newWidget = this.availableWidgetsCNS
                  .get(WidgetSubCodes.CNS_INSTRUMENT)
                  .createNew(this.updateService);
                newWidget.x = widget.x;
                newWidget.y = widget.y;
                newWidget.requiresConfiguration = false;
                newWidget.oid = widget.oid;
                newWidget.configure(result);
                this.updateWidget(newWidget);
                this.widgetsRefs.get(widget.oid).instance = newWidget;
                let index: number = this.dashboard.findIndex(element => element.oid === widget.oid);
                this.dashboard[index] = newWidget;
              }
            } else {
              const newWidget = this.availableWidgetsCNS
                .get(WidgetSubCodes.CNS_INSTRUMENT)
                .createNew(this.updateService);
              newWidget.x = widget.x;
              newWidget.y = widget.y;
              newWidget.requiresConfiguration = false;
              newWidget.oid = widget.oid;
              newWidget.configure(result);
              this.saveWidget(newWidget);
              this.dashboard.push(newWidget);
            }
            break;
          }

          default: {
            widget.configure(result);
            if (reconfigure === true) {
              this.widgetsRefs.get(widget.oid).instance.configuration = result;
              this.updateWidget(widget);
            } else {
              widget.requiresConfiguration = false;
              this.saveWidget(widget);
              this.dashboard.push(widget);
            }
            break;
          }
        }
      }
    });
  }

  launchUserAssistance() {
    this.userService.openUA(ScreenCodes.Dashboard);
  }
  shareDashboard() {
    this.userService.shareDashboard(this.dashboardId);
  }

  processLicense(license: LicenseView) {
    this.license = license;
  }

  resetDashboard() {
    const clearFunction = (scheduledConfig: ScheduledConfig) => this.sendScheduledReset(scheduledConfig);

    const dialogRef = this.dialog.open(ModalResetDashboardComponent, {
      autoFocus: false,
      closeOnNavigation: true,
      panelClass: 'modal-reset-dashboard',
      data: { resetTime: this.resetTime, clearFunction: clearFunction }
    });

    dialogRef.afterClosed().subscribe((result: ScheduledConfig) => {
      if (result) {
        if (result.resetTime !== undefined) {
          this.sendScheduledReset(result);
        } else {
          this.resetDashboardService();
        }
      }
    });
  }

  sendScheduledReset(result: ScheduledConfig) {
    this.dashboardService.resetDashboardScheduled(this.dashboardId, result).subscribe(
      () => {
        this.resetTime = result.resetTime;
        this.notificationService.resetAttempt('reset-scheduled');
      },
      error => {
        this.notificationService.resetFail('reset-attempt-failed');
      }
    );
  }

  resetDashboardService() {
    this.dashboardService.resetDashboardNow(this.dashboardId).subscribe(
      () => {},
      error => {
        this.notificationService.resetFail('reset-failed');
      }
    );
  }
}
