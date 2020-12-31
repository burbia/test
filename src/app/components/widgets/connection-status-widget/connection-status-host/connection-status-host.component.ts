import { LabService } from 'src/app/services/lab/lab.service';
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
import { LpmDashboardItemComponent } from '../../../dashboard-item/lpm-dashoard-item.component';
import { WidgetConfiguration } from 'src/app/models/widgetConfiguration.model';
import { KPIValue } from 'src/app/models/kpivalue.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ConnectionStatusWidgetConfiguration } from '../model/connection-status-widget.configuration';
import { ModalCsSetupComponent } from '../modal-cs-setup/modal-cs-setup.component';
import { CmHostEvent, CmHost } from '../model/cm-host.model';
import { UpdateService } from 'src/app/services/update-service/update.service';
import { WidgetCodes, StatusCNS, WidgetSubCodes, Status } from '../../../shared/app-constants';

@Component({
  selector: 'app-connection-status-host',
  templateUrl: './connection-status-host.component.html',
  styleUrls: ['./connection-status-host.component.scss']
})
export class ConnectionStatusHostComponent extends LpmDashboardItemComponent<WidgetConfiguration>
  implements OnInit, AfterContentInit {
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpdateTitle = new EventEmitter<any>();

  componentType = ConnectionStatusHostComponent;
  code = WidgetCodes.CNS;
  subcode = WidgetSubCodes.CNS_HOST;
  oid = uuid();
  showPlug = false;
  showPlug2 = false;
  oneXVersion = false;
  twoXVersion = false;
  disconnectedHost: Array<CmHostEvent> = [];
  allHosts: Array<CmHostEvent> = [];
  allHostsWaiting: Array<CmHostEvent> = [];
  itemListHost = [];
  editTitle = false;
  maxItems = 4;
  extraHosts = 0;
  configuration: ConnectionStatusWidgetConfiguration;
  statusCNS = StatusCNS.Waiting;
  hasItemsWithAlarmOn = false;
  existHosts = false;

  widgetTitleForm = new FormGroup({
    inputTitle: new FormControl('', [Validators.required, Validators.minLength(1)])
  });

  @ViewChild('inputTitle', { static: false }) inputTitle: ElementRef;
  @ViewChild('progress', { static: true }) progress: ElementRef;
  @ViewChild('background', { static: true }) background: ElementRef;
  @ViewChildren('warningsElemDoble') warningListDoble;
  @ViewChildren('warningsElem') warningList;

  // D3 objects
  progressD3: any;
  backgroundD3: any;

  constructor(private updateService: UpdateService, private labService: LabService) {
    super();
  }

  static getCode() {
    return WidgetCodes.CNS;
  }
  static getSubCode() {
    return WidgetSubCodes.CNS_HOST;
  }
  static createNew(kpiUpdatesService: UpdateService, labService: LabService): ConnectionStatusHostComponent {
    const component = new ConnectionStatusHostComponent(kpiUpdatesService, labService);
    component.setId(uuid());
    component.cols = 1;
    component.rows = 1;
    component.maxItemCols = 2;
    component.requiresConfiguration = true;
    return component;
  }

  static rebuild(widget: DashboardItem, kpiUpdatesService: UpdateService, labService: LabService) {
    const cs = new ConnectionStatusHostComponent(kpiUpdatesService, labService);
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

  duplicate(): ConnectionStatusHostComponent {
    const configurationCopy = JSON.parse(JSON.stringify(this.configuration));
    const component = new ConnectionStatusHostComponent(this.updateService, this.labService);
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
    this.labService.getHostConnections().subscribe((data: CmHost[]) => {
      data.forEach(element => {
        this.itemListHost.push({
          connectionName: element.connectionName.trim(),
          hostName: element.hostName,
          id: element.hostConnectionId.id.trim()
        });
      });
    });

    this.progressD3 = this.createRadial(this.progress.nativeElement);
    this.backgroundD3 = this.createBackground(this.background.nativeElement);
    this.allHosts = [];
    this.allHostsWaiting = [];
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
          this.existHosts = listOfItems.length > 0;
          this.allHosts = listOfItems
            .filter((host: CmHostEvent) => host.status === Status.Disconnected || host.status === Status.Waiting)
            .map((host: CmHostEvent) => ({
              ...host,
              time: host.time && !isNaN(Date.parse(host.time.toString())) ? new Date(host.time) : null,
              name: this.getHostNameFromHostId(host.id),
              connectionName: host.name,
              alarmOn:
                host.time && !isNaN(Date.parse(host.time.toString())) ? this.calculateAlarm(new Date(host.time)) : false
            }))
            .sort(function(a: CmHostEvent, b: CmHostEvent) {
              return new Date(b.time).getTime() - new Date(a.time).getTime();
            });

          this.allHostsWaiting = listOfItems.filter((item: CmHostEvent) => item.status === Status.Waiting);
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
    const arrayLenght = this.maxItems <= this.allHosts.length ? this.maxItems : this.allHosts.length;
    const hostToShow = this.allHosts.slice(0, arrayLenght);

    hostToShow.forEach((host: CmHostEvent) => {
      const hostIndex = this.disconnectedHost.findIndex(el => el.id === host.id);
      if (hostIndex === -1) {
        // ELEMENT NOT FOUND, PUSH IT
        this.disconnectedHost.push(host);
      } else {
        const hasChanges =
          this.disconnectedHost[hostIndex].name !== host.name ||
          this.disconnectedHost[hostIndex].connectionName !== host.connectionName ||
          this.disconnectedHost[hostIndex].status !== host.status ||
          (host.time &&
            !isNaN(Date.parse(host.time.toString())) &&
            this.disconnectedHost[hostIndex].time.getTime() !== host.time.getTime()) ||
          this.disconnectedHost[hostIndex].alarmOn !== host.alarmOn;
        // ELEMENT FOUND UPDATE IT IF NOT EQUAL
        if (hasChanges) {
          this.disconnectedHost[hostIndex].name = host.name;
          this.disconnectedHost[hostIndex].connectionName = host.connectionName;
          this.disconnectedHost[hostIndex].status = host.status;
          this.disconnectedHost[hostIndex].time = host.time;
          this.disconnectedHost[hostIndex].alarmOn = host.alarmOn;
        }
      }
    });

    var arrayIndexForDelete = [];
    this.disconnectedHost.forEach((host: CmHostEvent) => {
      const hostIndex = hostToShow.findIndex(el => el.id === host.id);
      if (hostIndex === -1) {
        // ELEMENT NOT FOUND, PUSH IT FOR DELETE
        arrayIndexForDelete.push(host.id);
      }
    });

    this.disconnectedHost = this.disconnectedHost.filter(item => !arrayIndexForDelete.includes(item.id));

    // DELETE > maxitems
    const arrayMaxLenght = this.maxItems <= this.disconnectedHost.length ? this.maxItems : this.disconnectedHost.length;
    if (this.disconnectedHost.length > arrayMaxLenght) {
      this.disconnectedHost.length = arrayMaxLenght;
    }
    // Sort
    this.disconnectedHost.sort(function(a: CmHostEvent, b: CmHostEvent) {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    const hostsMore = this.allHosts.length - this.disconnectedHost.length;
    this.extraHosts = hostsMore < 0 ? 0 : hostsMore;

    const percentage = (this.allHosts.length / this.configuration.hosts.split(',').length) * 100;
    if (this.allHosts.length === 0) {
      this.showOk();
    } else {
      this.statusCNS = StatusCNS.Disconnected;
      this.progressD3.update(percentage);
      d3.select(this.progress.nativeElement)
        .selectAll('.progress-bar')
        .style('fill', '#CC0033');
      this.hasItemsWithAlarmOn = this.allHosts.some(host => host.alarmOn === true);
    }
  }

  showOk() {
    if (!this.existHosts) {
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

  getHostNameFromHostId(id: string): string {
    const foundHosts = this.itemListHost.findIndex(hostIndex => hostIndex.id === id);
    return foundHosts !== -1 ? this.itemListHost[foundHosts].hostName : 'loading...';
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
