import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.preproduction';
import { of } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { WidgetCodes } from '../components/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  kpiInterval = environment.kpiHealthInterval;
  labInterval = environment.kpiHealthInterval;
  backendInterval = environment.kpiHealthInterval;
  serviceInterval = environment.kpiHealthInterval;

  constructor(private http: HttpClient, private notificationService: NotificationService) {}

  start() {
    this.checkBackendHealth();
    this.checkKpiHealth();
    this.checkLabHealth();
    this.checkServiceHealth();
  }

  checkBackendHealth() {
    return setInterval(() => {
      this.createRequest(environment.dashboardUrl + 'health', 'Backend');
    }, this.backendInterval);
  }

  checkKpiHealth() {
    return setInterval(() => {
      this.createRequest(environment.kpiTatUrl + 'health', WidgetCodes.TAT);

      this.createRequest(environment.kpiLstUrl + 'health', WidgetCodes.LST);

      this.createRequest(environment.kpiCmUrl + 'health', WidgetCodes.CNS);

      this.createRequest(environment.kpiSwlUrl + 'health', WidgetCodes.SWL);
    }, this.kpiInterval);
  }

  checkLabHealth() {
    return setInterval(() => {
      this.createRequest(environment.configurationsUrl + 'health', 'LAB');

      this.createRequest(environment.configurationsUrl + 'health', 'TEST');
    }, this.labInterval);
  }

  checkServiceHealth() {
    return setInterval(() => {
      this.createRequest(environment.rabbitUrl + 'api/healthchecks/node', 'MessageStream');

      this.createRequest(environment.nifiUrl, 'DataPipeline');
    }, this.serviceInterval);
  }

  createRequest(url: string, code: string, headers?) {
    this.http
      .get(url, headers)
      .pipe(
        timeout(10000),
        catchError(e => {
          if (e.status === 404) {
            this.notificationService.connectionRecovered(code);
            return of(null);
          }
          this.notificationService.connectionLost(code);
          return of(null);
        })
      )
      .subscribe(data => {
        if (data) {
          this.notificationService.connectionRecovered(code);
        }
      });
  }
}
