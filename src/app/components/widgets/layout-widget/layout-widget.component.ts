import { Component, OnInit } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { LpmDashboardItemComponent } from '../../dashboard-item/lpm-dashoard-item.component';
import { DashboardItem } from 'src/app/models/dashboard-item.model';
import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';
import { ComponentType } from '@angular/cdk/portal';

@Component({
  selector: 'app-layout-widget',
  templateUrl: './layout-widget.component.html',
  styleUrls: ['./layout-widget.scss']
})
export class LayoutWidgetComponent extends LpmDashboardItemComponent<WidgetConfiguration> implements OnInit {
  componentType = LayoutWidgetComponent;
  code = 'LAY';
  oid = uuid();
  subCode: string;

  constructor() {
    super();
  }
  static getCode() {
    return 'LAY';
  }

  static getSubCode() {
    return '';
  }

  static createNew(): LayoutWidgetComponent {
    const component = new LayoutWidgetComponent();
    component.setId(uuid());
    component.cols = 4;
    component.rows = 3;
    component.requiresConfiguration = false;
    return component;
  }

  static rebuild(widget: DashboardItem) {
    const layout = new LayoutWidgetComponent();
    layout.cols = widget.cols;
    layout.rows = widget.rows;
    layout.x = widget.x;
    layout.y = widget.y;
    layout.requiresConfiguration = false;
    return layout;
  }

  duplicate(): LayoutWidgetComponent {
    const component = new LayoutWidgetComponent();
    const newId = uuid();
    component.oid = newId;
    component.cols = this.cols;
    component.rows = this.rows;
    component.x = this.x;
    component.y = this.y;
    component.requiresConfiguration = false;
    return component;
  }

  resize(cols, rows) {}

  setId(value: any) {
    this.oid = value;
  }
  ngOnInit() {}

  configure(configuration: WidgetConfiguration): void {
    throw new Error('Method not implemented.');
  }

  getConfigurer(): ComponentType<{}> {
    throw new Error('Method not implemented.');
  }

  isAllowedSizeOrDefault(newColsSize: number, newRowsSize: number) {
    return { colsAllowed: newColsSize, rowsAllowed: newRowsSize };
  }
}
