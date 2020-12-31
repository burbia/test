import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Instrument } from 'src/app/models/instrument.model';
import { FormGroup, FormControl } from '@angular/forms';
import { ConnectionStatusWidgetConfiguration } from 'src/app/components/widgets/connection-status-widget/model/connection-status-widget.configuration';
import { InstrumentTypes, ScreenCodes, WidgetTypes } from 'src/app/components/shared/app-constants';
import { LabService } from 'src/app/services/lab/lab.service';
import { UserService } from 'src/app/services/user/user.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-modal-cs-setup',
  templateUrl: './modal-cs-setup.component.html',
  styleUrls: ['./modal-cs-setup.component.scss']
})
export class ModalCsSetupComponent implements OnInit {
  steps = [{ name: 'setup' }, { name: 'filter-instrument-host' }];
  widgetTypes = [
    { name: WidgetTypes.Host, selected: false },
    { name: WidgetTypes.Instrument, selected: false }
  ];
  selectedWidgetType: string = '';
  hostSelected: string = '';

  preAnalytics: Array<Instrument> = [];
  analytics: Array<Instrument> = [];
  postAnalytics: Array<Instrument> = [];

  preAnalyticsSelected: Array<Instrument> = [];
  analyticsSelected: Array<Instrument> = [];
  postAnalyticsSelected: Array<Instrument> = [];

  preAnalyticsCheckboxIndeterminate: boolean;
  analyticsCheckboxIndeterminate: boolean;
  postAnalyticsCheckboxIndeterminate: boolean;
  generalLabCheckboxIndeterminate: boolean;

  preAnalyticsCheckboxChecked: boolean;
  analyticsCheckboxChecked: boolean;
  postAnalyticsCheckboxChecked: boolean;
  generalLabCheckboxChecked: boolean;

  widgetTypeForm: FormGroup;

  noSelectedPreview = ['./assets/widgets-preview/connection_status/NoSelectedPreview.png'];
  hostPreviews = [
    './assets/widgets-preview/connection_status/HostPreview01.png',
    './assets/widgets-preview/connection_status/HostPreview02.png',
    './assets/widgets-preview/connection_status/HostPreview03.png'
  ];
  instrumentPreviews = [
    './assets/widgets-preview/connection_status/InstrumentPreview01.png',
    './assets/widgets-preview/connection_status/InstrumentPreview02.png',
    './assets/widgets-preview/connection_status/InstrumentPreview03.png'
  ];

  selectedPreview = this.noSelectedPreview;

  nextButtonEnabled: boolean = false;
  setupButtonEnabled: boolean = false;
  isHostDisabled: boolean = false;
  hostSelectedPrevious: string = '';

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalCsSetupComponent>,
    private labService: LabService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('info-required', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/info-24px.svg'));
    iconRegistry.addSvgIcon(
      'host-noselected',
      sanitizer.bypassSecurityTrustResourceUrl('assets/widgets-preview/connection_status/HostNoSelected.svg')
    );
    iconRegistry.addSvgIcon(
      'instrument-noselected',
      sanitizer.bypassSecurityTrustResourceUrl('assets/widgets-preview/connection_status/InstrumentNoSelected.svg')
    );
  }

  ngOnInit() {
    this.labService.getInstruments().subscribe((data: Instrument[]) => {
      data.forEach(instrument => {
        if (
          instrument.instrumentType === InstrumentTypes.Analytic ||
          instrument.instrumentType === InstrumentTypes.Unknown
        ) {
          this.analytics.push(instrument);
        } else if (instrument.instrumentType === InstrumentTypes.PostAnalytic) {
          this.postAnalytics.push(instrument);
        } else if (instrument.instrumentType === InstrumentTypes.PreAnalytic) {
          this.preAnalytics.push(instrument);
        }
      });
      if (this.data.reconfigure) {
        this.recover();
      }
    });
    this.widgetTypeForm = new FormGroup({
      widgetTitle: new FormControl('')
    });
  }

  get typeForm() {
    return this.widgetTypeForm.controls;
  }

  recover() {
    const instrumentsRecover = this.data.configuration.instruments.split(',');
    const pre = [];
    const post = [];
    const analytics = [];

    this.analytics.forEach(analytic => {
      if (instrumentsRecover.findIndex((inst: string) => inst === analytic.id.instrumentId) !== -1) {
        analytics.push(analytic);
      }
    });
    this.preAnalytics.forEach(preAnalytic => {
      if (instrumentsRecover.findIndex((inst: string) => inst === preAnalytic.id.instrumentId) !== -1) {
        pre.push(preAnalytic);
      }
    });
    this.postAnalytics.forEach(postAnalytic => {
      if (instrumentsRecover.findIndex((inst: string) => inst === postAnalytic.id.instrumentId) !== -1) {
        post.push(postAnalytic);
      }
    });

    this.preAnalyticsSelected = pre;
    this.analyticsSelected = analytics;
    this.postAnalyticsSelected = post;
    this.updateCheckBoxStatus(InstrumentTypes.PreAnalytic);
    this.updateCheckBoxStatus(InstrumentTypes.Analytic);
    this.updateCheckBoxStatus(InstrumentTypes.PostAnalytic);
    this.updateGeneralLabCheckbox();
    this.nextButtonEnabled = true;
    this.selectedWidgetType = this.data.configuration.type || WidgetTypes.Instrument;
    this.selectedPreview = this.selectedWidgetType === WidgetTypes.Host ? this.hostPreviews : this.instrumentPreviews;
    this.hostSelected = this.data.configuration.hosts || '';
    this.hostSelectedPrevious = this.hostSelected;
    this.widgetTypeForm.controls['widgetTitle'].setValue(this.data.configuration.title);
    this.widgetTypes = this.widgetTypes.map(item => {
      return item.name === this.data.configuration.type
        ? { name: item.name, selected: true }
        : { name: item.name, selected: false };
    });
    this.updateSetupButtonStatus();
  }

  selectWidgetType(type) {
    this.selectedWidgetType = type;
    this.nextButtonEnabled = true;
    this.updateSetupButtonStatus();
    this.widgetTypes = this.widgetTypes.map(item => {
      return item.name === type ? { name: item.name, selected: true } : { name: item.name, selected: false };
    });
    this.selectedPreview = type === WidgetTypes.Host ? this.hostPreviews : this.instrumentPreviews;
  }

  selectHost(event: string) {
    this.hostSelected = event;
    this.updateSetupButtonStatus();
  }

  changeIsHostDisabled(event: boolean) {
    this.isHostDisabled = event;
  }

  instrumentSelected() {
    this.updateCheckBoxStatus(InstrumentTypes.PreAnalytic);
    this.updateCheckBoxStatus(InstrumentTypes.Analytic);
    this.updateCheckBoxStatus(InstrumentTypes.PostAnalytic);
    this.updateGeneralLabCheckbox();
    this.updateSetupButtonStatus();
  }

  updateSetupButtonStatus() {
    switch (this.selectedWidgetType) {
      case WidgetTypes.Instrument: {
        this.setupButtonEnabled =
          this.preAnalyticsSelected.length > 0 ||
          this.postAnalyticsSelected.length > 0 ||
          this.analyticsSelected.length > 0;
        break;
      }
      case WidgetTypes.Host: {
        this.setupButtonEnabled = this.hostSelected.length > 0;
        break;
      }
    }
  }

  updateGeneralLabCheckbox() {
    if (
      this.analyticsSelected.length === this.analytics.length &&
      this.preAnalyticsSelected.length === this.preAnalytics.length &&
      this.postAnalyticsSelected.length === this.postAnalytics.length
    ) {
      this.generalLabCheckboxIndeterminate = false;
      this.generalLabCheckboxChecked = true;
    } else if (
      this.analyticsSelected.length === 0 &&
      this.preAnalyticsSelected.length === 0 &&
      this.postAnalyticsSelected.length === 0
    ) {
      this.generalLabCheckboxIndeterminate = false;
      this.generalLabCheckboxChecked = false;
    } else {
      this.generalLabCheckboxIndeterminate = true;
      this.generalLabCheckboxChecked = false;
    }
  }

  updateCheckBoxStatus(zone: string) {
    switch (zone) {
      case InstrumentTypes.PreAnalytic: {
        if (this.preAnalyticsSelected.length > 0 && this.preAnalyticsSelected.length < this.preAnalytics.length) {
          this.preAnalyticsCheckboxIndeterminate = true;
        } else if (this.preAnalyticsSelected.length === 0) {
          this.preAnalyticsCheckboxIndeterminate = false;
          this.preAnalyticsCheckboxChecked = false;
        } else if (this.preAnalyticsSelected.length === this.preAnalytics.length) {
          this.preAnalyticsCheckboxChecked = true;
          this.preAnalyticsCheckboxIndeterminate = false;
        }
        break;
      }
      case InstrumentTypes.Analytic: {
        if (this.analyticsSelected.length > 0 && this.analyticsSelected.length < this.analytics.length) {
          this.analyticsCheckboxIndeterminate = true;
        } else if (this.analyticsSelected.length === 0) {
          this.analyticsCheckboxIndeterminate = false;
          this.analyticsCheckboxChecked = false;
        } else if (this.analyticsSelected.length === this.analytics.length) {
          this.analyticsCheckboxChecked = true;
          this.analyticsCheckboxIndeterminate = false;
        }
        break;
      }
      case InstrumentTypes.PostAnalytic: {
        if (this.postAnalyticsSelected.length > 0 && this.postAnalyticsSelected.length < this.postAnalytics.length) {
          this.postAnalyticsCheckboxIndeterminate = true;
        } else if (this.postAnalyticsSelected.length === 0) {
          this.postAnalyticsCheckboxIndeterminate = false;
          this.postAnalyticsCheckboxChecked = false;
        } else if (this.postAnalyticsSelected.length === this.postAnalytics.length) {
          this.postAnalyticsCheckboxChecked = true;
          this.postAnalyticsCheckboxIndeterminate = false;
        }
        break;
      }
    }
  }

  updateFullZone(click, zone: string) {
    switch (zone) {
      case InstrumentTypes.PreAnalytic: {
        if (click.checked) {
          this.preAnalyticsSelected = this.preAnalytics;
        } else {
          this.preAnalyticsSelected = [];
        }
        break;
      }
      case InstrumentTypes.Analytic: {
        if (click.checked) {
          this.analyticsSelected = this.analytics;
        } else {
          this.analyticsSelected = [];
        }
        break;
      }
      case InstrumentTypes.PostAnalytic: {
        if (click.checked) {
          this.postAnalyticsSelected = this.postAnalytics;
        } else {
          this.postAnalyticsSelected = [];
        }
        break;
      }
    }
    this.updateGeneralLabCheckbox();
    this.updateSetupButtonStatus();
  }
  toggleAllLab(click) {
    if (click.checked) {
      this.preAnalyticsSelected = this.preAnalytics;
      this.preAnalyticsCheckboxIndeterminate = false;
      this.preAnalyticsCheckboxChecked = true;
      this.analyticsSelected = this.analytics;
      this.analyticsCheckboxIndeterminate = false;
      this.analyticsCheckboxChecked = true;
      this.postAnalyticsSelected = this.postAnalytics;
      this.postAnalyticsCheckboxIndeterminate = false;
      this.postAnalyticsCheckboxChecked = true;
    } else {
      this.preAnalyticsSelected = [];
      this.preAnalyticsCheckboxIndeterminate = false;
      this.preAnalyticsCheckboxChecked = false;
      this.analyticsSelected = [];
      this.analyticsCheckboxIndeterminate = false;
      this.analyticsCheckboxChecked = false;
      this.postAnalyticsSelected = [];
      this.postAnalyticsCheckboxChecked = false;
      this.postAnalyticsCheckboxChecked = false;
    }
    this.updateSetupButtonStatus();
  }

  closeSetup() {
    const preAnalyticsSelectedId = this.preAnalyticsSelected.map(
      (instrument: Instrument) => instrument.id.instrumentId
    );
    const analyticsSelectedId = this.analyticsSelected.map((instrument: Instrument) => instrument.id.instrumentId);
    const postAnalyticsSelectedId = this.postAnalyticsSelected.map(
      (instrument: Instrument) => instrument.id.instrumentId
    );
    const configuration: ConnectionStatusWidgetConfiguration = {
      title: this.widgetTypeForm.value.widgetTitle,
      type: this.selectedWidgetType,
      instruments:
        this.selectedWidgetType === WidgetTypes.Instrument
          ? preAnalyticsSelectedId
              .concat(analyticsSelectedId)
              .concat(postAnalyticsSelectedId)
              .toString()
          : '',
      hosts: this.selectedWidgetType === WidgetTypes.Host ? this.hostSelected : ''
    };
    this.dialogRef.close(configuration);
  }

  launchUserAssistance() {
    this.userService.openUA(ScreenCodes.CSConfiguration);
  }

  goStepBack(stepper: MatStepper) {
    if (this.selectedWidgetType === WidgetTypes.Host && this.isHostDisabled && this.hostSelected === '') {
      this.hostSelected = this.hostSelectedPrevious;
    }
    stepper.selected.completed = false;
    stepper.previous();
  }

  goStepForward(stepper: MatStepper) {
    stepper.selected.completed = true;
    stepper.next();
  }
}
