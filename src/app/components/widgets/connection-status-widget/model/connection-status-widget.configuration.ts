import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';

export class ConnectionStatusWidgetConfiguration implements WidgetConfiguration {
  title: string;
  type?: string;
  instruments: string;
  hosts?: string;
}
