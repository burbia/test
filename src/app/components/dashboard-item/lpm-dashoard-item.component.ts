import { OnInit, Type } from '@angular/core';
import { GridsterItem } from 'angular-gridster2';
import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';
import { ComponentType } from '@angular/cdk/portal';

export abstract class LpmDashboardItemComponent<T extends WidgetConfiguration> implements OnInit, GridsterItem {
  x: number;
  y: number;
  rows: number;
  cols: number;
  minItemCols: number;
  minItemRows: number;
  maxItemCols: number;
  maxItemRows: number;
  resizeEnabled: boolean;
  code: string;
  requiresConfiguration: boolean;
  configuration?: T;
  abstract componentType: Type<LpmDashboardItemComponent<T>>;
  abstract oid: string;
  abstract duplicate();
  abstract resize(cols, rows);
  constructor() {}

  ngOnInit() {}

  abstract configure(configuration: WidgetConfiguration): void;
  abstract getConfigurer(): ComponentType<{}>;
  abstract isAllowedSizeOrDefault(newColsSize: number, newRowsSize: number);
}
