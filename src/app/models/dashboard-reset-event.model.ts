export enum DashboardResetEventTypeEnum {
  RESET_EVENT = 'DashboardResetEvent',
  RESET_RETRIED = 'DashboardResetRetried',
  RESET_RETRIED_FAIL = 'DashboardResetFailed'
}

export class DashboardResetEvent {
  id: string;
  eventType: DashboardResetEventTypeEnum;
  tenantId: string;
  dashboardId: string;
  attempts: number;
  totalAttempts: number;
  failedWidgets: string[];
}
