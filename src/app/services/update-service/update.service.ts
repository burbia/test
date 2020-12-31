import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from '../user/user.service';
import { Observable, Subject } from 'rxjs';
import { KPIValue } from 'src/app/models/kpivalue.model';
import { DashboardResetEvent } from 'src/app/models/dashboard-reset-event.model';
import { EventType } from 'src/app/components/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  private subscriptions = new Map<string, Subject<KPIValue | DashboardResetEvent>>();

  private readonly interval = 1000;

  private requestInterval;

  constructor(private http: HttpClient, private userService: UserService) {}

  getLatestValue(oid: string) {
    return this.http.get(environment.dashboardUrl + 'dashboard/kpi/' + this.userService.tenantId + '/' + oid);
  }

  public start() {
    this.requestInterval = setInterval(() => {
      if (this.isWindowVisible()) {
        const subs = this.makeRequest().subscribe((response: KPIValue[] | DashboardResetEvent[]) => {
          if (response !== undefined && response.length > 0) {
            response.forEach(event => {
              // Dashboards crean subscription aquí también y muestran las alertas.
              switch (this.getUpdateEventType(event)) {
                case EventType.KPI:
                  if (this.subscriptionExists(event.id.widgetId)) {
                    this.subscriptions.get(event.id.widgetId).next(event);
                  }
                  break;
                case EventType.DASHBOARD_RESET:
                  if (this.subscriptionExists(event.dashboardId)) {
                    this.subscriptions.get(event.dashboardId).next(event);
                  }
                  break;
                default:
                  break;
              }
            });
          }
          setTimeout(() => {
            subs.unsubscribe();
          });
        });
      }
    }, this.interval);
  }

  getUpdateEventType(event: KPIValue | DashboardResetEvent): EventType {
    return event.hasOwnProperty('eventType') ? EventType.DASHBOARD_RESET : EventType.KPI;
  }

  public stop() {
    clearInterval(this.requestInterval);
  }

  public isWindowVisible(): boolean {
    return !document.hidden;
  }

  private makeRequest(): Observable<any> {
    const options = { params: new HttpParams().set('from', new Date(new Date().getTime() - 86400000).toISOString()) };
    return this.http.get(environment.dashboardUrl + 'dashboard/changes/' + this.userService.tenantId, options);
  }

  private subscriptionExists(id: string) {
    return this.subscriptions.has(id);
  }

  public getSubscriber(id: string): Subject<KPIValue | DashboardResetEvent> {
    if (this.hasNoSubscription(id)) {
      this.subscriptions.set(id, new Subject<KPIValue | DashboardResetEvent>());
    }
    return this.subscriptions.get(id);
  }

  private hasNoSubscription(id: string) {
    return this.subscriptions.has(id) === false;
  }

  public unsubscribe(id: string) {
    if (this.subscriptions.has(id)) {
      this.subscriptions.delete(id);
    }
  }
}
