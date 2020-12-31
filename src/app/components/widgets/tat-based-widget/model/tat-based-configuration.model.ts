import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';

export class TatBasedConfiguration implements WidgetConfiguration {
  initialEventType: string;
  organisations?: string;
  instrumentsIdInitialEvent: string;
  instrumentsIdFinalEvent: string;
  instrumentsId: string;
  finalEventType: string;
  title: string;
  issueTarget: number;
  warningTarget: number;
  alarmIssueTarget: number;
  alarmWarningTarget: number;
  type: string;
  timeToExcludeFromList?: number;
  timeToEraseFromList?: number;
  priority?: string;
  tests?: string;
}
