import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';

export class SampleWorkloadWidgetConfiguration implements WidgetConfiguration {
    title: string;
    instrumentsId: string;
    tests: string;
    priority: string;
    pending: string;
    processing: string;
    completed: string;
    resetPending;
    resetProcessing;
    resetCompleted;
}
