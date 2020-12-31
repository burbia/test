import { WidgetConfiguration } from './widgetConfiguration.model';

export class DashboardItem {
  title?: string;
  cols: number;
  rows: number;
  x: number;
  y: number;
  code: string;
  id: string;
  idDashboard: string;
  configuration: WidgetConfiguration;
}
