import {
  Component,
  OnInit,
  AfterContentInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  ViewChildren
} from '@angular/core';
import { DashboardItem } from 'src/app/models/dashboard-item.model';
import { v4 as uuid } from 'uuid';
import * as d3 from 'd3';
import { ComponentType } from '@angular/cdk/portal';
import { LpmDashboardItemComponent } from '../../dashboard-item/lpm-dashoard-item.component';
import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';
import { KPIValue } from 'src/app/models/kpivalue.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConnectionStatusWidgetConfiguration } from './model/connection-status-widget.configuration';
import { ModalCsSetupComponent } from './modal-cs-setup/modal-cs-setup.component';
import { CmInstrumentEvent } from './model/cm-instrument.model';
import { UpdateService } from 'src/app/services/update-service/update.service';
import { WidgetCodes, WidgetSubCodes, StatusCNS, Status } from '../../shared/app-constants';

@Component({
  selector: 'app-connection-status-widget',
  templateUrl: './connection-status-widget.component.html',
  styleUrls: ['./connection-status-widget.component.scss']
})
export class ConnectionStatusWidgetComponent extends LpmDashboardItemComponent<WidgetConfiguration>
  implements OnInit, AfterContentInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpdateTitle = new EventEmitter<any>();

  componentType = ConnectionStatusWidgetComponent;
  code = WidgetCodes.CNS;
  subcode = WidgetSubCodes.CNS_INSTRUMENT;
  oid = uuid();
  showPlug = false;
  showPlug2 = false;
  oneXVersion = false;
  twoXVersion = false;
  disconnectedInstruments: Array<CmInstrumentEvent> = [];
  allInstruments: Array<CmInstrumentEvent> = [];
  allInstrumentsWaiting: Array<CmInstrumentEvent> = [];
  editTitle = false;
  maxItems = 4;
  extraInstruments = 0;
  configuration: ConnectionStatusWidgetConfiguration;
  statusCNS = StatusCNS.Waiting;
  hasItemsWithAlarmOn = false;
  existInstruments = false;

  widgetTitleForm = new FormGroup({
    inputTitle: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  @ViewChild('inputTitle', { static: false }) inputTitle: ElementRef;
  @ViewChild('progress', { static: true }) progress: ElementRef;
  @ViewChild('background', { static: true }) background: ElementRef;

  // D3 objects
  progressD3: any;
  backgroundD3: any;

  constructor(private updateService: UpdateService) {
    super();
  }

  static getCode() {
    return WidgetCodes.CNS;
  }

  static getSubCode() {
    return WidgetSubCodes.CNS_INSTRUMENT;
  }
  static createNew(kpiUpdatesService: UpdateService): ConnectionStatusWidgetComponent {
    const component = new ConnectionStatusWidgetComponent(kpiUpdatesService);
    component.setId(uuid());
    component.cols = 1;
    component.rows = 1;
    component.maxItemCols = 2;
    component.requiresConfiguration = true;
    return component;
  }

  static rebuild(widget: DashboardItem, kpiUpdatesService: UpdateService) {
    const cs = new ConnectionStatusWidgetComponent(kpiUpdatesService);
    cs.oid = widget.id;
    cs.cols = widget.cols;
    cs.rows = widget.rows;
    cs.maxItemCols = 2;
    cs.x = widget.x;
    cs.y = widget.y;
    cs.configuration = <ConnectionStatusWidgetConfiguration>widget.configuration;
    cs.requiresConfiguration = false;
    return cs;
  }

  duplicate(): ConnectionStatusWidgetComponent {
    const configurationCopy = JSON.parse(JSON.stringify(this.configuration));
    const component = new ConnectionStatusWidgetComponent(this.updateService);
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
  ngOnInit() {
    this.progressD3 = this.createRadial(this.progress.nativeElement);
    this.backgroundD3 = this.createBackground(this.background.nativeElement);
    this.allInstruments = [];
    this.allInstrumentsWaiting = [];
    if (this.configuration) {
      this.updateContent();
    }
  }

  ngAfterContentInit(): void {
    this.updateService.getSubscriber(this.oid).subscribe((data: KPIValue) => {
      if (data !== null) {
        if (data.id.widgetId === this.oid) {
          const stringOfItems = data.values['cmPayload'];
          const listOfItems = JSON.parse(stringOfItems);
          this.existInstruments = listOfItems.length > 0;
          this.allInstruments = listOfItems
            .filter((item: CmInstrumentEvent) => item.status === Status.Disconnected || item.status === Status.Waiting)
            .map(instrument => ({
              ...instrument,
              time:
                instrument.time && !isNaN(Date.parse(instrument.time.toString())) ? new Date(instrument.time) : null,
              alarmOn:
                instrument.time && !isNaN(Date.parse(instrument.time.toString()))
                  ? this.calculateAlarm(new Date(instrument.time))
                  : false
            }))
            .sort(function(a: CmInstrumentEvent, b: CmInstrumentEvent) {
              return new Date(b.time).getTime() - new Date(a.time).getTime();
            });
          this.allInstrumentsWaiting = listOfItems.filter((item: CmInstrumentEvent) => item.status === Status.Waiting);
          this.updateContent();
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

  updateContent() {
    const arrayLenght = this.maxItems <= this.allInstruments.length ? this.maxItems : this.allInstruments.length;
    const instrumentToShow = this.allInstruments.slice(0, arrayLenght);

    instrumentToShow.forEach((instrument: CmInstrumentEvent) => {
      const instrumentIndex = this.disconnectedInstruments.findIndex(el => el.id === instrument.id);
      if (instrumentIndex === -1) {
        // ELEMENT NOT FOUND, PUSH IT
        this.disconnectedInstruments.push(instrument);
      } else {
        const hasChanges =
          this.disconnectedInstruments[instrumentIndex].name !== instrument.name ||
          this.disconnectedInstruments[instrumentIndex].status !== instrument.status ||
          (instrument.time &&
            !isNaN(Date.parse(instrument.time.toString())) &&
            this.disconnectedInstruments[instrumentIndex].time.getTime() !== instrument.time.getTime()) ||
          this.disconnectedInstruments[instrumentIndex].alarmOn !== instrument.alarmOn;
        // ELEMENT FOUND UPDATE IT IF NOT EQUAL
        if (hasChanges) {
          this.disconnectedInstruments[instrumentIndex].name = instrument.name;
          this.disconnectedInstruments[instrumentIndex].status = instrument.status;
          this.disconnectedInstruments[instrumentIndex].time = instrument.time;
          this.disconnectedInstruments[instrumentIndex].alarmOn = instrument.alarmOn;
        }
      }
    });

    var arrayIndexForDelete = [];
    this.disconnectedInstruments.forEach((instrument: CmInstrumentEvent) => {
      const instrumentIndex = instrumentToShow.findIndex(el => el.id === instrument.id);
      if (instrumentIndex === -1) {
        // ELEMENT NOT FOUND, PUSH IT FOR DELETE
        arrayIndexForDelete.push(instrument.id);
      }
    });

    this.disconnectedInstruments = this.disconnectedInstruments.filter(item => !arrayIndexForDelete.includes(item.id));

    // DELETE > maxitems
    const arrayMaxLenght =
      this.maxItems <= this.disconnectedInstruments.length ? this.maxItems : this.disconnectedInstruments.length;
    if (this.disconnectedInstruments.length > arrayMaxLenght) {
      this.disconnectedInstruments.length = arrayMaxLenght;
    }
    // Sort
    this.disconnectedInstruments.sort(function(a: CmInstrumentEvent, b: CmInstrumentEvent) {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    const instrumentsMore = this.allInstruments.length - this.disconnectedInstruments.length;
    this.extraInstruments = instrumentsMore < 0 ? 0 : instrumentsMore;

    const percentage = (this.allInstruments.length / this.configuration.instruments.split(',').length) * 100;
    if (this.allInstruments.length === 0) {
      this.showOk();
    } else {
      this.statusCNS = StatusCNS.Disconnected;
      this.progressD3.update(percentage);
      d3.select(this.progress.nativeElement)
        .selectAll('.progress-bar')
        .style('fill', '#CC0033');

      this.hasItemsWithAlarmOn = this.allInstruments.some(instruments => instruments.alarmOn === true);
    }
  }

  showOk() {
    if (!this.existInstruments) {
      this.statusCNS = StatusCNS.Waiting;
    } else if (this.statusCNS === StatusCNS.Waiting || this.statusCNS === StatusCNS.Disconnected) {
      this.progressD3.update(100);
      d3.select(this.progress.nativeElement)
        .selectAll('.progress-bar')
        .style('fill', '#008F06');
      this.statusCNS = StatusCNS.Connected;
    }
  }

  resize(newCols: number, newRows: number) {
    if (newRows === 1 && newCols === 1) {
      this.showPlug = true;
      this.showPlug2 = false;
      this.progressD3.toggleVisibility(true);
      this.backgroundD3.toggleVisibility(true);
      this.oneXVersion = false;
      this.twoXVersion = false;
    } else if (newRows > 1 && newCols === 1) {
      this.showPlug = false;
      this.showPlug2 = false;
      this.progressD3.toggleVisibility(false);
      this.backgroundD3.toggleVisibility(false);
      this.oneXVersion = true;
      this.twoXVersion = false;
    } else if (newRows === 1 && newCols === 2) {
      this.showPlug = true;
      this.showPlug2 = true;
      this.oneXVersion = false;
      this.twoXVersion = false;
      this.progressD3.toggleVisibility(true);
      this.backgroundD3.toggleVisibility(true);
    } else if (newRows > 1 && newCols === 2) {
      this.progressD3.toggleVisibility(false);
      this.backgroundD3.toggleVisibility(false);
      this.showPlug = false;
      this.showPlug2 = false;
      this.oneXVersion = false;
      this.twoXVersion = true;
    }
    this.maxItems =
      newCols === 1 ? Math.floor(4.6 * (newRows - 2) + 2.5 + 4.2) : Math.floor(4.7 * (newRows - 2) + 3.48 + 4.2);
    this.updateContent();
  }

  createRadial(selector: any) {
    const parent = d3.select(selector);
    const size = {
      bottom: 988,
      height: 115,
      left: 467.5,
      right: 667.5,
      top: 50,
      width: 115,
      x: 467.5,
      y: 50
    };
    const svg = parent
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', '-22 -15 160 160')
      .attr('transform', 'rotate(180)');
    const outerRadius = Math.min(size.width, size.height) * 0.45;
    const thickness = 5;
    let value = 0;

    const mainArc = d3
      .arc()
      .startAngle(0)
      .endAngle(Math.PI * 2)
      .innerRadius(outerRadius - thickness)
      .outerRadius(outerRadius);

    svg
      .append('path')
      .attr('class', 'progress-bar-bg')
      .attr('transform', 'translate(' + size.width / 2 + ',' + size.height / 2 + ')')
      .attr('d', mainArc());

    const mainArcPath = svg
      .append('path')
      .attr('class', 'progress-bar')
      .attr('transform', 'translate(' + size.width / 2 + ',' + size.height / 2 + ')');

    const end = svg
      .append('circle')
      .attr('class', 'progress-bar')
      .attr('transform', `translate(${size.width / 2},${size.height / 2 - outerRadius + thickness / 2})`)
      .attr('width', thickness)
      .attr('height', thickness)
      .attr('r', thickness / 2);

    return {
      update: function(progressPercent: number) {
        const startValue = value;
        const startAngle = (Math.PI * startValue) / 50;
        const angleDiff = (Math.PI * progressPercent) / 50 - startAngle;
        const startAngleDeg = (startAngle / Math.PI) * 180;
        const angleDiffDeg = (angleDiff / Math.PI) * 180;
        const transitionDuration = 1500;

        mainArcPath
          .transition()
          .duration(transitionDuration)
          .attrTween('d', function() {
            return function(t) {
              mainArc.endAngle(startAngle + angleDiff * t);
              return mainArc();
            };
          });
        end
          .transition()
          .duration(transitionDuration)
          .attrTween('transform', function() {
            return function(t) {
              return (
                `translate(${size.width / 2},${size.height / 2})` +
                `rotate(${startAngleDeg + angleDiffDeg * t})` +
                `translate(0,-${outerRadius - thickness / 2})`
              );
            };
          });
        value = progressPercent;
      },
      toggleVisibility: function(visible: boolean) {
        if (visible) {
          svg.attr('opacity', 1);
        } else {
          svg.attr('opacity', 0);
        }
      }
    };
  }

  createBackground(selector: any) {
    const w = 100,
      h = 100,
      r = 50;

    const svg = d3
      .select(selector)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', '-28 -35 155 155')
      .append('g')
      .attr('transform', 'translate(' + w / 2 + ',' + h / 2 + ')');

    const radialGradient = svg
      .append('defs')
      .append('radialGradient')
      .attr('id', 'radial-gradient');

    radialGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#000000');

    radialGradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#B3B3B3');

    radialGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#EDEDED');

    svg
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', r)
      .style('fill', 'url(#radial-gradient)');

    return {
      toggleVisibility: function(visible: boolean) {
        if (visible) {
          svg.attr('opacity', 1);
        } else {
          svg.attr('opacity', 0);
        }
      }
    };
  }

  configure(configuration: WidgetConfiguration): void {
    const csConfiguration = <ConnectionStatusWidgetConfiguration>configuration;
    this.configuration = csConfiguration;
  }

  getConfigurer(): ComponentType<{}> {
    return ModalCsSetupComponent;
  }

  isAllowedSizeOrDefault(newColsSize: number, newRowsSize: number) {
    if (newColsSize === 2 && newRowsSize === 1) {
      return { colsAllowed: 1, rowsAllowed: 1 };
    } else {
      return { colsAllowed: newColsSize, rowsAllowed: newRowsSize };
    }
  }

  calculateAlarm(time: Date) {
    var fiveMinutesBeforeNow = new Date(Date.now() - 1000 * 60 * 5);
    var timeHost = new Date(time);
    return timeHost >= fiveMinutesBeforeNow;
  }
}
