import { Injectable } from '@angular/core';
import { DashboardItem } from 'src/app/models/dashboard-item.model';
import { Widget } from 'src/app/models/widget.model';

import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { LpmDashboardItemComponent } from 'src/app/components/dashboard-item/lpm-dashoard-item.component';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';
import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';
import { AnalyticsService } from 'src/app/services/analytics.service';
import { Dashboard } from 'src/app/models/dashboard.model';
import { DashboardItemRemoved } from 'src/app/models/dashboard-item-removed.model';
import { ScheduledConfig } from 'src/app/models/ScheduledConfig.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  dashboardSave: DashboardItem[];
  widgets: Widget[] = [
    {
      code: 'TAT',
      description: 'Turnaround time',
      preview: './assets/widgets-preview/tat/TATPreview.png',
      information: 'tat-description',
      active: true
    },
    {
      code: 'LST',
      description: 'Late sample tracking',
      preview: './assets/widgets-preview/late_sample_tracking/LSTPreview.png',
      information: 'lst-description',
      active: true
    },
    {
      code: 'CNS',
      description: 'Connection status',
      preview: './assets/widgets-preview/connection_status/ConnectionPreview.png',
      information: 'cm-description',
      active: true
    },
    {
      code: 'SWL',
      description: 'Sample workload',
      preview: './assets/widgets-preview/sample_workload/WorkLoadPreview.png',
      information: 'swl-description',
      active: true
    }
  ];
  constructor(public http: HttpClient, private userService: UserService, private analyticsService: AnalyticsService) {}

  saveWidget(widget: LpmDashboardItemComponent<WidgetConfiguration>, dashboardId: string): Observable<any> {
    let widgetToSave;

    widgetToSave = {
      cols: widget.cols,
      rows: widget.rows,
      x: widget.x,
      y: widget.y,
      code: widget.code,
      id: widget.oid,
      active: true,
      configuration: widget.configuration
    };
    this.analyticsService.emitwidgetManagementEvent('addWidget', widgetToSave.code);
    return this.http.post(
      environment.dashboardUrl + 'dashboard/' + this.userService.tenantId + '/' + dashboardId,
      widgetToSave
    );
  }

  updateWidget(widget: LpmDashboardItemComponent<WidgetConfiguration>, dashboardId: string): Observable<any> {
    let widgetToUpdate;

    widgetToUpdate = {
      cols: widget.cols,
      rows: widget.rows,
      x: widget.x,
      y: widget.y,
      code: widget.code,
      id: widget.oid,
      active: true,
      configuration: widget.configuration
    };

    return this.http.put(
      environment.dashboardUrl + 'dashboard/' + this.userService.tenantId + '/' + dashboardId,
      widgetToUpdate
    );
  }

  deleteWidget(widget: LpmDashboardItemComponent<WidgetConfiguration>, dashboardId: string) {
    const widgetToDelete: string = widget.oid;
    const options = { params: new HttpParams().set('hard-delete', 'false') };

    this.analyticsService.emitwidgetManagementEvent('deleteWidget', widget.code);

    return this.http.delete(
      environment.dashboardUrl + 'dashboard/' + this.userService.tenantId + '/' + dashboardId + '/' + widgetToDelete,
      options
    );
  }

  deleteWidgetDefinetely(widget: DashboardItemRemoved, dashboardId: string) {
    const widgetToDelete: string = widget.id;
    const options = { params: new HttpParams().set('hard-delete', 'true') };

    this.analyticsService.emitwidgetManagementEvent('deleteWidgetDefinetely', widget.code);

    return this.http.delete(
      environment.dashboardUrl + 'dashboard/' + this.userService.tenantId + '/' + dashboardId + '/' + widgetToDelete,
      options
    );
  }

  recoverWidget(dashboardId: string, widget: DashboardItemRemoved) {
    this.analyticsService.emitwidgetManagementEvent('recoverWidget', widget.code);
    return this.http.put(
      environment.dashboardUrl +
        'dashboard/' +
        this.userService.tenantId +
        '/' +
        dashboardId +
        '/' +
        widget.id +
        '/restore',
      {}
    );
  }

  recover() {
    return this.http.get(environment.dashboardUrl + 'dashboard/' + this.userService.tenantId);
  }

  getWidgets() {
    return this.widgets;
  }

  getDashboards() {
    return this.http.get(environment.dashboardUrl + 'dashboard/' + this.userService.tenantId);
  }

  getDashboard(id: string) {
    return this.http.get(environment.dashboardUrl + 'dashboard/' + this.userService.tenantId + '/' + id);
  }

  createDashboard(dashboard: Dashboard) {
    return this.http.post(environment.dashboardUrl + 'dashboard/' + this.userService.tenantId, dashboard);
  }

  updateDashboard(dashboard: Dashboard) {
    const body = { dashboardId: dashboard.dashboardId, title: dashboard.title };
    return this.http.put(environment.dashboardUrl + 'dashboard/' + this.userService.tenantId, body);
  }

  deleteDashboard(dashboard: Dashboard) {
    return this.http.delete(
      environment.dashboardUrl + 'dashboard/' + this.userService.tenantId + '/' + dashboard.dashboardId
    );
  }

  duplicateDashboard(dashboard: Dashboard) {
    return this.http.post(
      environment.dashboardUrl + 'dashboard/duplicate/' + this.userService.tenantId + '/' + dashboard.dashboardId,
      {}
    );
  }

  resetDashboardNow(id: string) {
    return this.http.post(
      environment.dashboardUrl + 'dashboard/' + this.userService.tenantId + '/' + id + '/reset/now',
      {}
    );
  }

  resetDashboardScheduled(id: string, scheduledConfig: ScheduledConfig) {
    return this.http.put(
      environment.dashboardUrl + 'dashboard/' + this.userService.tenantId + '/' + id + '/reset/schedule',
      scheduledConfig
    );
  }
}
