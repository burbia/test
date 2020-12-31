import { Component, OnInit, AfterContentInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { v4 as uuid } from 'uuid';
import { DashboardItem } from 'src/app/models/dashboard-item.model';
import * as d3 from 'd3';
import { UpdateService } from 'src/app/services/update-service/update.service';
import { KPIValue } from 'src/app/models/kpivalue.model';
import { TatBasedWidgetComponent } from '../tat-based-widget.component';
import { TatBasedConfiguration } from '../../model/tat-based-configuration.model';
import { TATResult } from '../../model/tat-result.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WidgetCodes } from 'src/app/components/shared/app-constants';

@Component({
  selector: 'app-tat-landscape-widget',
  templateUrl: './tat-landscape-widget.component.html',
  styleUrls: ['../tat-widget.component.scss']
})
export class TatWidgetComponent extends TatBasedWidgetComponent implements OnInit, AfterContentInit {
  @ViewChild('noData', { static: true }) noData: ElementRef;
  @ViewChild('inputTitle', { static: false }) inputTitle: ElementRef;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpdateTitle = new EventEmitter<any>();
  componentType = TatWidgetComponent;
  code = WidgetCodes.TAT;
  subCode: string;
  status: any;
  hours: string;
  class = '#F2F2F2';
  clockClass = '#008F06';
  textClass = '#000000';
  shownStatusIcon: string;
  lastAlarmStatus = '';
  lastStatus: string;
  editTitle = false;
  readonly secondsInHour: number = 3600;
  readonly secondsInMinute: number = 60;
  widgetTitleForm = new FormGroup({
    inputTitle: new FormControl('')
  });

  // Clock status
  readonly statusRed = 'ALERT';
  readonly statusYellow = 'WARNING';
  readonly statusGreen = 'OK';
  readonly statusReset = 'RESETED';

  // Icon Status
  readonly statusIconAlert = 'ALERT';
  readonly statusIconWarning = 'WARNING';
  readonly statusIconOk = 'OK';
  readonly statusIconNoData = 'ERROR';

  // Spinner no data status
  readonly alarmStatusNoData = 'ERROR';
  readonly alarmStatusWarn = 'WARNING';
  readonly alarmStatusIssue = 'ALERT';
  readonly alarmStatusOk = 'OK';

  @ViewChild('radial', { static: true }) radial: ElementRef;
  @ViewChild('background', { static: true }) background: ElementRef;
  @ViewChild('alarm', { static: true }) alarm: ElementRef;
  @ViewChild('alarmPie', { static: false }) alarmPie: ElementRef;

  // D3 objects
  progressD3: any;
  backgroundD3: any;
  alarmD3: any;
  alarmPieD3: any;

  noDataD3: any;
  percentage: number;
  constructor(private updateService: UpdateService) {
    super();
  }

  static getCode() {
    return WidgetCodes.TAT;
  }

  static getSubCode() {
    return '';
  }

  static createNew(kpiUpdatesService: UpdateService): TatWidgetComponent {
    const component = new TatWidgetComponent(kpiUpdatesService);
    component.setId(uuid());
    component.requiresConfiguration = true;
    component.maxItemCols = 1;
    component.maxItemRows = 1;
    component.cols = 1;
    component.rows = 1;
    return component;
  }

  static rebuild(widget: DashboardItem, kpiUpdatesService: UpdateService): TatWidgetComponent {
    const component = new TatWidgetComponent(kpiUpdatesService);
    component.oid = widget.id;
    component.configuration = <TatBasedConfiguration>widget.configuration;
    component.requiresConfiguration = false;
    component.cols = widget.cols;
    component.rows = widget.rows;
    component.maxItemCols = 1;
    component.maxItemRows = 1;
    component.x = widget.x;
    component.y = widget.y;
    return component;
  }

  setMaxSizes(): void {
    this.maxItemCols = 1;
    this.maxItemRows = 1;
  }

  createInstance(): TatBasedWidgetComponent {
    return new TatWidgetComponent(this.updateService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  setId(value: any) {
    this.oid = value;
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

  ngAfterContentInit(): void {
    this.backgroundD3 = this.createBackground(this.background.nativeElement);
    this.progressD3 = this.createRadial(this.radial.nativeElement);
    this.alarmD3 = this.createAlarm(this.alarm.nativeElement);
    this.shownStatusIcon = this.statusIconNoData;
    this.noDataD3 = this.createNoData(this.noData.nativeElement);
    this.updateService.getLatestValue(this.oid).subscribe((x: KPIValue) => {
      this.showValue(x);
    });
    this.updateService.getSubscriber(this.oid).subscribe((kpiValue: KPIValue) => {
      this.showValue(kpiValue);
    });
  }

  showValue(kpiValue: KPIValue) {
    const tatValue = +kpiValue.values['tatValue'];
    const tat = new TATResult();
    tat.averageTat = tatValue;
    if (kpiValue.values['tatValue'] === 'null') {
      tat.timeExceededStatus = this.statusReset;
      tat.alarmStatus = this.alarmStatusNoData;
    }
    if (tat.averageTat < this.configuration.warningTarget) {
      tat.timeExceededStatus = this.statusGreen;
      tat.alarmStatus = this.alarmStatusOk;
      if (tat.averageTat >= this.configuration.warningTarget - this.configuration.alarmWarningTarget) {
        tat.alarmStatus = this.alarmStatusWarn;
      }
    }

    if (tat.averageTat < this.configuration.issueTarget && tat.averageTat >= this.configuration.warningTarget) {
      tat.timeExceededStatus = this.statusYellow;
      tat.alarmStatus = this.alarmStatusOk;
      if (tat.averageTat >= this.configuration.issueTarget - this.configuration.alarmIssueTarget) {
        tat.alarmStatus = this.alarmStatusIssue;
      }
    }

    if (tat.averageTat >= this.configuration.issueTarget) {
      tat.alarmStatus = this.alarmStatusOk;
      tat.timeExceededStatus = this.alarmStatusIssue;
    }
    this.processResult(tat);
  }

  processResult(tat: TATResult) {
    switch (tat.timeExceededStatus) {
      case this.statusRed: {
        this.class = '#CC0033';
        this.clockClass = '#CC0033';
        this.textClass = '#FFFFFF';
        this.shownStatusIcon = this.statusIconAlert;
        this.lastStatus = this.statusRed;
        this.noDataD3.showLoader(0);
        break;
      }
      case this.statusYellow: {
        this.class = '#FFC414';
        this.clockClass = '#FFC414';
        this.textClass = '#000000';

        this.shownStatusIcon = this.statusIconWarning;
        this.lastStatus = this.statusYellow;
        this.noDataD3.showLoader(0);
        break;
      }
      case this.statusGreen: {
        this.class = '#F2F2F2';
        this.textClass = '#000000';
        this.clockClass = '#008F06';

        this.shownStatusIcon = this.statusIconOk;

        this.lastStatus = this.statusGreen;
        this.noDataD3.showLoader(0);

        break;
      }
      case this.statusReset: {
        this.class = '#F2F2F2';
        this.textClass = '#000000';
        this.clockClass = '#008F06';
        this.shownStatusIcon = this.statusIconNoData;
        this.lastStatus = this.statusReset;

        break;
      }

      default: {
        return null;
      }
    }
    this.hours = isNaN(tat.averageTat) ? '' : this.secondsTohhmm(tat.averageTat);
    this.updatePercentage(tat.averageTat, tat.timeExceededStatus);
    switch (tat.alarmStatus) {
      case this.alarmStatusNoData: {
        this.noDataD3.showLoader(1);
        this.shownStatusIcon = this.statusIconNoData;
        this.class = '#F2F2F2';
        this.textClass = '#000000';
        this.alarmD3.stopAlarm();
        this.lastAlarmStatus = this.alarmStatusNoData;
        break;
      }

      case this.alarmStatusIssue: {
        this.noDataD3.showLoader(0);
        this.shownStatusIcon = this.statusIconAlert;
        if (this.lastAlarmStatus !== this.alarmStatusIssue) {
          this.alarmD3.stopAlarm();
          this.alarmD3.startAlarm(this.alarmStatusIssue);
        }
        this.lastAlarmStatus = this.alarmStatusIssue;
        break;
      }

      case this.alarmStatusWarn: {
        this.noDataD3.showLoader(0);
        this.shownStatusIcon = this.statusIconWarning;
        if (this.lastAlarmStatus !== this.alarmStatusWarn) {
          this.alarmD3.stopAlarm();
          this.alarmD3.startAlarm(this.alarmStatusWarn);
        }
        this.lastAlarmStatus = this.alarmStatusWarn;
        break;
      }

      case this.alarmStatusOk: {
        this.noDataD3.showLoader(0);
        this.alarmD3.stopAlarm();
        switch (this.lastStatus) {
          case this.statusGreen: {
            this.shownStatusIcon = this.statusIconOk;
            break;
          }
          case this.statusYellow: {
            this.shownStatusIcon = this.statusIconWarning;
            break;
          }
          case this.statusRed: {
            this.shownStatusIcon = this.statusIconAlert;
          }
        }
        this.lastAlarmStatus = this.alarmStatusOk;
        break;
      }

      default: {
        this.alarmD3.stopAlarm();
      }
    }
  }

  updatePercentage(averageTat: number, status) {
    this.percentage = isNaN(averageTat) ? 0 : (averageTat / this.configuration.issueTarget) * 100;
    this.progressD3.update(this.percentage);
    if (status === this.statusRed) {
      d3.select(this.radial.nativeElement)
        .selectAll('.progress-bar')
        .style('fill', '#CC0033');
    } else if (status === this.statusYellow) {
      d3.select(this.radial.nativeElement)
        .selectAll('.progress-bar')
        .style('fill', '#FFC414');
    } else if (status === this.statusGreen || status === this.statusReset) {
      d3.select(this.radial.nativeElement)
        .selectAll('.progress-bar')
        .style('fill', '#008F06');
    }
  }

  calculateAlarmPieData(configuration: TatBasedConfiguration) {
    if (configuration) {
      const percentageOkAlarm = (configuration.warningTarget / configuration.issueTarget) * 100 - 1;
      const percentageWarningAlarm = 99 - percentageOkAlarm;
      return [1, percentageOkAlarm, 1, percentageWarningAlarm];
    }
  }

  secondsTohhmm(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / this.secondsInHour);
    const minutes = Math.floor((totalSeconds - hours * this.secondsInHour) / this.secondsInMinute);
    let seconds = totalSeconds - hours * this.secondsInHour - minutes * this.secondsInMinute;
    seconds = Math.round(seconds * 100) / 100;
    let result = hours + 'h ' + (minutes < 10 ? '0' + minutes : minutes);
    // tslint:disable-next-line:quotemark
    result += "'";
    return result;
  }

  createNoData(selector: any) {
    const radius = 62;
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
      .attr('viewBox', '-20 -39 160 160')
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

  createAlarm(selector: any) {
    const width = 100,
      height = 100;
    const svg = d3
      .select(selector)
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', '-30 -49 160 160')
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    const alarm = svg
      .append('circle')
      .style('fill', 'transparent')
      .attr('r', 50);

    return {
      startAlarm: function(status: string) {
        const that = this;
        let color;
        if (status === 'WARNING') {
          color = d3.rgb(255, 196, 20, 0.75);
        } else if (status === 'ALERT') {
          color = d3.rgb(204, 0, 51, 0.75);
        }
        alarm
          .style('fill', color)
          .attr('r', 40)
          .transition()
          .duration(900)
          .attr('r', 50)
          .transition()
          .duration(500)
          .style('fill', 'transparent')
          .transition()
          .duration(900)
          .on('end', function() {
            that.startAlarm(status);
          });
      },
      stopAlarm: function() {
        alarm.interrupt().style('fill', 'transparent');
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
      .attr('viewBox', '-28 -45 155 155')
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
  }

  createRadial(selector: any) {
    const parent = d3.select(selector);
    const size = {
      bottom: 988,
      height: 110,
      left: 467.5,
      right: 667.5,
      top: 50,
      width: 110,
      x: 467.5,
      y: 50
    };
    const svg = parent
      .append('svg')
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('viewBox', '-25 -44 160 160');
    const outerRadius = Math.min(size.width, size.height) * 0.45;
    const thickness = 10;
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
      .attr('height', thickness);

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
      }
    };
  }
}
