import { LpmDashboardItemComponent } from 'src/app/components/dashboard-item/lpm-dashoard-item.component';
import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';
import { ComponentType } from '@angular/cdk/portal';
import { WidgetConfigurationComponent } from '../modals/widget-configuration/widget-configuration.component';
import { v4 as uuid } from 'uuid';
import { TatBasedConfiguration } from '../model/tat-based-configuration.model';

export abstract class TatBasedWidgetComponent extends LpmDashboardItemComponent<TatBasedConfiguration> {
  oid: string;
  configuration: TatBasedConfiguration;

  duplicate() {
    const configurationCopy = JSON.parse(JSON.stringify(this.configuration));
    const component = this.createInstance();
    const newId = uuid();
    component.oid = newId;
    component.configuration = configurationCopy;
    component.configuration.title = 'Copy_' + configurationCopy.title;
    component.requiresConfiguration = false;
    component.cols = this.cols;
    component.rows = this.rows;
    component.setMaxSizes();
    return component;
  }

  resize(cols, rows) {}

  abstract setMaxSizes(): void;

  abstract createInstance(): TatBasedWidgetComponent;

  configure(configuration: WidgetConfiguration): void {
    const tatConfiguration = <TatBasedConfiguration>configuration;
    this.configuration = tatConfiguration;
  }

  getConfigurer(): ComponentType<{}> {
    return WidgetConfigurationComponent;
  }

  isAllowedSizeOrDefault(newColsSize: number, newRowsSize: number) {
    return { colsAllowed: newColsSize, rowsAllowed: newRowsSize };
  }
}
