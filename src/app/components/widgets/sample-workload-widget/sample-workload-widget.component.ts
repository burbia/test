import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { LpmDashboardItemComponent } from '../../dashboard-item/lpm-dashoard-item.component';
import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';
import { UpdateService } from 'src/app/services/update-service/update.service';
import { DashboardItem } from 'src/app/models/dashboard-item.model';
import { v4 as uuid } from 'uuid';
import { SampleWorkloadWidgetConfiguration } from './model/sample-workload-widget.configuration';
import { ModalSwSetupComponent } from './modal-sw-setup/modal-sw-setup.component';
import { ComponentType } from '@angular/cdk/portal';
import * as d3 from 'd3';
import { SampleWorkloadWidgetView } from './model/sample-workload-widget.view';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SampleWorkloadWidgetResult } from './model/sample-workload-widget-result.model';
import { KPIValue } from 'src/app/models/kpivalue.model';
import { WidgetCodes } from '../../shared/app-constants';

@Component({
  selector: 'app-sample-workload-widget',
  templateUrl: './sample-workload-widget.component.html',
  styleUrls: ['./sample-workload-widget.component.scss']
})
export class SampleWorkloadWidgetComponent extends LpmDashboardItemComponent<WidgetConfiguration> implements OnInit {
  componentType = SampleWorkloadWidgetComponent;
  oid: string;
  configuration: SampleWorkloadWidgetConfiguration;
  code = WidgetCodes.SWL;
  viewValues = {} as SampleWorkloadWidgetView;
  editTitle = false;
  oneXversion = false;
  subCode: string;

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpdateTitle = new EventEmitter<any>();

  @ViewChild('loader', { static: true }) noData: ElementRef;
  @ViewChild('values', { static: true }) values: ElementRef;
  @ViewChild('swBackground', { static: true }) background: ElementRef;
  @ViewChild('inputTitle', { static: false }) inputTitle: ElementRef;

  // D3 objects
  noDataD3: any;
  valuesD3: any;
  backgroundD3: any;

  widgetTitleForm = new FormGroup({
    inputTitle: new FormControl('')
  });

  constructor(private updateService: UpdateService) {
    super();
  }

  static getCode() {
    return WidgetCodes.SWL;
  }
  static getSubCode() {
    return '';
  }

  static createNew(kpiUpdatesService: UpdateService): SampleWorkloadWidgetComponent {
    const component = new SampleWorkloadWidgetComponent(kpiUpdatesService);
    component.setId(uuid());
    component.cols = 1;
    component.rows = 1;
    component.maxItemCols = 1;
    component.maxItemRows = 2;
    component.requiresConfiguration = true;
    return component;
  }

  static rebuild(widget: DashboardItem, kpiUpdatesService: UpdateService) {
    const cs = new SampleWorkloadWidgetComponent(kpiUpdatesService);
    cs.oid = widget.id;
    cs.cols = widget.cols;
    cs.rows = widget.rows;
    cs.maxItemCols = 1;
    cs.maxItemRows = 2;
    cs.x = widget.x;
    cs.y = widget.y;
    cs.configuration = <SampleWorkloadWidgetConfiguration>widget.configuration;
    cs.requiresConfiguration = false;
    return cs;
  }

  duplicate(): SampleWorkloadWidgetComponent {
    const configurationCopy = JSON.parse(JSON.stringify(this.configuration));
    const component = new SampleWorkloadWidgetComponent(this.updateService);
    const newId = uuid();
    component.oid = newId;
    component.cols = this.cols;
    component.rows = this.rows;
    component.maxItemCols = this.maxItemCols;
    component.maxItemRows = this.maxItemRows;
    component.x = this.x;
    component.y = this.y;
    component.configuration = configurationCopy;
    component.configuration.title = 'Copy_' + configurationCopy.title;
    component.requiresConfiguration = false;
    return component;
  }

  setId(value: any) {
    this.oid = value;
  }

  resize(cols: any, rows: any) {
    if (cols === 1 && rows === 1) {
      this.oneXversion = false;
    } else if (cols === 1 && rows === 2) {
      this.oneXversion = true;
    }
  }
  getConfigurer(): ComponentType<{}> {
    return ModalSwSetupComponent;
  }
  ngOnInit() {
    this.backgroundD3 = this.createBackground(this.background.nativeElement);
    this.backgroundD3.setGrey();
    this.noDataD3 = this.createNoData(this.noData.nativeElement);
    let values = this.calculateValues({
      pendingCount: 0,
      processingCount: 0,
      completedCount: 0,
      pendingResultsCount: 0,
      pendingTecValCount: 0,
      pendingMedValCount: 0
    });
    this.valuesD3 = this.valuesPieProgress(this.values.nativeElement, values);
    this.updateService.getSubscriber(this.oid).subscribe((data: KPIValue) => {
      if (data !== null) {
        if (data.id.widgetId === this.oid) {
          values = this.calculateValues({
            pendingCount: Number.parseInt(data.values.pendingCount, 10),
            processingCount: Number.parseInt(data.values.processingCount, 10),
            completedCount: Number.parseInt(data.values.completedCount, 10),
            pendingResultsCount: Number.parseInt(data.values.pendingResultsCount, 10),
            pendingMedValCount: Number.parseInt(data.values.pendingMedValCount, 10),
            pendingTecValCount: Number.parseInt(data.values.pendingTecValCount, 10)
          });
          if (this.viewValues.totalSamples !== 0) {
            this.noDataD3.showLoader(0);
            this.backgroundD3.setGradient();
          } else {
            this.noDataD3.showLoader(1);
            this.backgroundD3.setGrey();
          }
          this.valuesD3.updateData(values);
        }
      }
    });
  }

  focusInput() {
    setTimeout(() => {
      this.inputTitle.nativeElement.focus();
      this.widgetTitleForm.controls['inputTitle'].setValue(this.configuration.title);
    }, 100);
  }

  get titleForm() {
    return this.widgetTitleForm.controls;
  }

  updateTitle() {
    if (this.inputTitle.nativeElement.value.length > 0) {
      this.configuration.title = this.inputTitle.nativeElement.value;
      this.onUpdateTitle.emit(this);
    }
  }

  calculateValues(data: SampleWorkloadWidgetResult) {
    const total = data.pendingCount + data.processingCount + data.completedCount;
    const percentageStart = data.pendingCount / total;
    const percentageProcessing = data.processingCount / total;
    const percentageProcessed = data.completedCount / total;
    this.viewValues = {
      percentageStart: percentageStart * 100,
      percentageProcessing: percentageProcessing * 100,
      percentageProcessed: percentageProcessed * 100,
      totalStart: data.pendingCount,
      totalProcessing: data.processingCount,
      totalProcessed: data.completedCount,
      pendingResultsCount: data.pendingResultsCount,
      pendingTecValCount: data.pendingTecValCount,
      pendingMedValCount: data.pendingMedValCount,
      totalSamples: total
    };
    return [this.viewValues.percentageProcessed, this.viewValues.percentageProcessing, this.viewValues.percentageStart];
  }

  valuesPieProgress(selector: any, values: Array<number>) {
    const data = values;
    const width = 70,
      height = 86,
      radius = 60;

    const arc = d3
      .arc()
      .innerRadius(36)
      .outerRadius(radius);

    const pie = d3.pie().sort(null);
    const svg = d3
      .select(selector)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', '-30 -49 160 160')
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    const color = ['#00875A', 'transparent', '#BABABA'];

    const path = svg
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .style('fill', function(d, i) {
        return color[i];
      })
      .attr('d', arc)
      .each(function(d) {
        this._current = d;
      });

    function arcTween(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function(t) {
        return arc(i(t));
      };
    }

    return {
      updateData: function(newData) {
        path.data(pie(newData));
        path
          .transition()
          .duration(750)
          .attrTween('d', arcTween); // redraw the arcs
      }
    };
  }

  createBackground(selector: any) {
    const w = 70,
      h = 88,
      r = 58;

    const svg = d3
      .select(selector)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', '-28 -45 155 155')
      .append('g')
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')');

    const radialGradient = svg
      .append('defs')
      .append('radialGradient')
      .attr('id', 'radial-gradient-sw');

    radialGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#058CCF');

    radialGradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#058CCF');

    radialGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#47D6EB');

    const circle = svg
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', r)
      .style('fill', 'url(#radial-gradient-sw)');

    return {
      setGrey: function() {
        circle.style('fill', '#BABABA');
      },
      setGradient: function() {
        circle.style('fill', 'url(#radial-gradient-sw)');
      }
    };
  }

  createNoData(selector: any) {
    const radius = 70;
    const tau = 2 * Math.PI;

    const arc = d3
      .arc()
      .innerRadius(radius * 0.8)
      .outerRadius(radius * 0.9)
      .startAngle(0);

    const svg = d3
      .select(selector)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', '-5 -32 160 160')
      .append('g')
      .attr('transform', 'translate(' + 120 / 2 + ',' + 120 / 2 + ')');

    const gradient = svg
      .append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '20%')
      .attr('y1', '50%')
      .attr('x2', '150%')
      .attr('y2', '50%');
    gradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#FFFFFF')
      .attr('stop-opacity', 1);
    gradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#BABABA')
      .attr('stop-opacity', 1);

    const background = svg
      .append('path')
      .datum({ endAngle: 1 * tau })
      .style('fill', 'url(#gradient)')
      .attr('d', arc)
      .call(spin, 1500);

    function spin(selection, duration) {
      selection
        .transition()
        .ease(d3.easeLinear)
        .duration(duration)
        .attrTween('transform', function() {
          return d3.interpolateString('rotate(0)', 'rotate(360)');
        });

      setTimeout(function() {
        spin(background, duration);
      }, duration);
    }

    return {
      showLoader: function(status: number) {
        background.style('opacity', status);
      }
    };
  }

  configure(configuration: WidgetConfiguration): void {
    const swConfiguration = <SampleWorkloadWidgetConfiguration>configuration;
    this.configuration = swConfiguration;
  }

  isAllowedSizeOrDefault(newColsSize: number, newRowsSize: number) {
    return { colsAllowed: newColsSize, rowsAllowed: newRowsSize };
  }
}
