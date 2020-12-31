import {
  Component,
  OnInit,
  AfterContentInit,
  ViewChildren,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter
} from '@angular/core';
import { v4 as uuid } from 'uuid';
import * as d3 from 'd3';
import { DashboardItem } from 'src/app/models/dashboard-item.model';
import { LstResultItem } from 'src/app/models/lst.model';
import { WidgetStatus, WidgetCodes } from 'src/app/components/shared/app-constants';
import { TatBasedWidgetComponent } from '../tat-widget/tat-based-widget.component';
import { TatBasedConfiguration } from '../model/tat-based-configuration.model';
import { UpdateService } from 'src/app/services/update-service/update.service';
import { KPIValue } from 'src/app/models/kpivalue.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppModule } from 'src/app/app.module';
import { Instrument } from 'src/app/models/instrument.model';
import { LabService } from 'src/app/services/lab/lab.service';

@Component({
  selector: 'app-lst-widget',
  templateUrl: './lst-widget.component.html',
  styleUrls: ['./lst-widget.component.scss']
})
export class LstWidgetComponent extends TatBasedWidgetComponent implements OnInit, AfterContentInit {
  private labService: LabService;

  @ViewChildren('alertsElem') alertList;
  @ViewChildren('warningsElem') warningList;
  @ViewChild('inputTitle', { static: false }) inputTitle: ElementRef;
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onUpdateTitle = new EventEmitter<any>();
  componentType = LstWidgetComponent;
  warnings: Array<LstResultItem> = [];
  alerts: Array<LstResultItem> = [];
  shownWarnings: Array<LstResultItem> = [];
  shownAlerts: Array<LstResultItem> = [];
  showOk: boolean;
  extraSamples: number;
  errorsCounter: string;
  warningsCounter: string;
  exceedsCounter: string;
  numXVersion: number;
  widgetTitleForm = new FormGroup({
    inputTitle: new FormControl('')
  });
  editTitle = false;
  code = WidgetCodes.LST;
  subCode: string;
  instrumentsMap = new Map();
  maxItems = 10;
  constructor(private updateService: UpdateService) {
    super();
    this.labService = AppModule.injector.get(LabService);
  }

  static getCode() {
    return WidgetCodes.LST;
  }

  static getSubCode() {
    return '';
  }

  static createNew(kpiUpdatesService: UpdateService): LstWidgetComponent {
    const component = new LstWidgetComponent(kpiUpdatesService);
    component.oid = uuid();
    component.requiresConfiguration = true;
    component.setMaxSizes();
    component.cols = 1;
    component.rows = 1;
    return component;
  }

  static rebuild(widget: DashboardItem, kpiUpdatesService: UpdateService): LstWidgetComponent {
    const component = new LstWidgetComponent(kpiUpdatesService);
    component.oid = widget.id;
    component.configuration = <TatBasedConfiguration>widget.configuration;
    component.requiresConfiguration = false;
    component.cols = widget.cols;
    component.rows = widget.rows;
    component.setMaxSizes();
    component.x = widget.x;
    component.y = widget.y;
    return component;
  }

  createInstance(): TatBasedWidgetComponent {
    return new LstWidgetComponent(this.updateService);
  }

  setMaxSizes(): void {
    this.minItemCols = 1;
    this.maxItemCols = 2;
    this.maxItemRows = 5;
  }

  resize(newCols: number, newRows: number) {
    if (newRows === 1) {
      this.maxItems = 1;
    }
    if (newRows === 2) {
      this.maxItems = 5;
    }
    if (newRows === 3) {
      this.maxItems = 10;
    }
    if (newRows === 4) {
      this.maxItems = 15;
    }
    if (newRows === 5) {
      this.maxItems = 20;
    }

    if (newCols === 1) {
      this.numXVersion = 1;
    } else {
      this.numXVersion = 2;
    }
    this.removeToFit();
    this.updateContent();
  }

  removeToFit() {
    while (this.shownAlerts.length + this.shownWarnings.length > this.maxItems) {
      if (this.shownWarnings.length > 0) {
        this.shownWarnings.pop();
      } else {
        this.shownAlerts.pop();
      }
    }
  }

  ngOnInit() {
    this.showOk = false;
    this.labService.getInstruments().subscribe((result: Array<Instrument>) => {
      result.forEach((instrument: Instrument) => {
        this.instrumentsMap.set(instrument.id.instrumentId, instrument.instrumentName);
      });
    });
  }
  ngAfterContentInit(): void {
    this.updateService.getSubscriber(this.oid).subscribe((data: KPIValue) => {
      if (data !== null) {
        if (data.id.widgetId === this.oid) {
          this.errorsCounter = data.values['errorsCounter'];
          this.warningsCounter = data.values['warningsCounter'];
          this.exceedsCounter = data.values['samplesExceededCounter'];
          const stringOfItems = data.values['lstItems'];
          const listOfItems = JSON.parse(stringOfItems);
          listOfItems.forEach((item: LstResultItem) => {
            item.instrumentName = this.instrumentsMap.get(item.instrumentId);
          });
          this.alerts = listOfItems.filter(item => item.status === WidgetStatus.ALERT);
          this.warnings = listOfItems.filter(item => item.status === WidgetStatus.WARNING);
          this.warnings.forEach(warning => (warning.alarmOn = false));
          this.updateContent();
        }
      }
    });
  }

  get titleForm() {
    return this.widgetTitleForm.controls;
  }

  focusInput() {
    setTimeout(() => {
      this.widgetTitleForm.controls['inputTitle'].setValue(this.configuration.title);
      this.inputTitle.nativeElement.focus();
    }, 100);
  }

  updateTitle() {
    if (this.inputTitle.nativeElement.value.length > 0) {
      this.configuration.title = this.inputTitle.nativeElement.value;
      this.onUpdateTitle.emit(this);
    }
  }

  updateContent() {
    if (this.everythingOk()) {
      this.showOk = true;
    } else {
      this.showOk = false;
      this.removeOldAlerts();
      this.addUpdateAlerts();
      this.removeOldWarnings();
      this.addUpdateWarnings();
      this.updateAlarms();
      const extraSamples =
        Number.parseInt(this.warningsCounter, 10) +
        Number.parseInt(this.errorsCounter, 10) -
        (this.shownAlerts.length + this.shownWarnings.length);
      this.extraSamples = extraSamples < 0 ? 0 : extraSamples;
    }
  }

  everythingOk() {
    return this.warnings.length === 0 && this.alerts.length === 0;
  }

  updateAlarms() {
    this.shownWarnings.forEach(warning => {
      if (warning.time <= this.configuration.alarmIssueTarget) {
        this.renderAlarm(warning.sampleId);
      }
    });
  }

  removeOldAlerts() {
    this.shownAlerts.forEach(alert => {
      const alertIndex = this.alerts.findIndex(el => el.sampleId === alert.sampleId);
      if (alertIndex === -1) {
        const index = this.shownAlerts.indexOf(alert);
        this.shownAlerts.splice(index, 1);
      }
    });
  }

  removeOldWarnings() {
    this.shownWarnings.forEach(warning => {
      const warningIndex = this.warnings.findIndex(el => el.sampleId === warning.sampleId);
      if (warningIndex === -1) {
        const index = this.shownWarnings.indexOf(warning);
        this.shownWarnings.splice(index, 1);
      }
    });
  }

  addUpdateAlerts() {
    this.alerts.forEach(alert => {
      const alertIndex = this.shownAlerts.findIndex(el => el.sampleId === alert.sampleId);
      if (alertIndex === -1) {
        if (this.shownAlerts.length < this.maxItems) {
          this.shownAlerts.push(alert);
        }
      } else {
        this.shownAlerts[alertIndex] = alert;
      }
    });
    this.shownAlerts.sort((a, b) => b.time - a.time);
  }

  addUpdateWarnings() {
    this.warnings.forEach(element => {
      const positionsAvailable = this.maxItems - this.shownAlerts.length;
      const warningIndex = this.shownWarnings.findIndex(el => el.sampleId === element.sampleId);
      if (warningIndex === -1) {
        if (this.shownWarnings.length < positionsAvailable) {
          this.shownWarnings.push(element);
        }
      } else {
        if (this.shownWarnings[warningIndex].alarmOn) {
          element.alarmOn = true;
        }
        this.shownWarnings[warningIndex].time = element.time;
        this.shownWarnings[warningIndex].alarmOn = element.alarmOn;
        this.shownWarnings[warningIndex].instrumentName = element.instrumentName;
      }
    });
    this.shownWarnings.sort((a, b) => a.time - b.time);
  }

  renderAlarm(id) {
    let event;
    let alarm;
    let viexBox;
    const color = d3.rgb(204, 0, 51, 0.15);
    const delay = Math.floor(Math.random() * 1501) + 500;
    setTimeout(() => {
      const index = this.shownWarnings.findIndex(el => el.sampleId === id);
      if (index !== -1 && !this.shownWarnings[index].alarmOn) {
        event = this.warningList.toArray()[index];
        viexBox = '0 0 ' + this.numXVersion * 165 + ' 40';
        const svg = d3
          .select(event.nativeElement)
          .append('svg')
          .attr('preserveAspectRatio', 'xMidYMid meet')
          .attr('viewBox', viexBox)
          .append('g');

        alarm = svg
          .append('rect')
          .style('fill', color)
          .attr('height', 34)
          .attr('width', 50)
          .attr('x', -10)
          .attr('rx', 10)
          .attr('ry', 10);
        repeat();

        this.shownWarnings[index].alarmOn = true;
      }

      function repeat() {
        alarm
          .attr('width', 0)
          .style('fill', color)
          .transition()
          .duration(500)
          .attr('width', '103%')
          .transition()
          .duration(500)
          .style('fill', 'transparent')
          .on('end', repeat);
      }
    }, delay);
  }
}
