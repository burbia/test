import { Component, OnInit, ViewChild, ElementRef, Inject } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper, MatStep } from '@angular/material/stepper';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Test } from 'src/app/models/test.model';
import { WidgetTypes, WidgetCodes, KeyCodes, ScreenCodes, ANY_ITEM } from 'src/app/components/shared/app-constants';
import { TatBasedConfiguration } from '../../model/tat-based-configuration.model';
import { ModalChangeWidgetTypeComponent } from 'src/app/components/modals/modal-change-widget-type/modal-change-widget-type.component';
import { UserService } from 'src/app/services/user/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-widget-configuration',
  templateUrl: './widget-configuration.component.html',
  styleUrls: ['./widget-configuration.component.scss']
})
export class WidgetConfigurationComponent implements OnInit {
  static heightSelectDemoGraphicWithoutError: string = '507';
  static heightSelectDemoGraphicWithError: string = '400px';
  static heightSelectDemoGraphicPercentWithoutError: string = '84%';
  static heightSelectDemoGraphicPercentWithError: string = '94%';
  heightSelect: string;
  heightPercent: string;
  showAllDemograpchicSelected: boolean;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  selectedTests: Test[] = [];
  steps = [];
  chooseType = true;
  stepOrder: number; // 0 for test widget   1 for instrument/sample/validation widget
  stepOption0 = [
    { name: 'filter-test' },
    { name: 'filter-instrument' },
    { name: 'events' },
    { name: 'filter-demographics' },
    { name: 'setup' }
  ];
  stepOption1 = [
    { name: 'filter-instrument' },
    { name: 'events' },
    { name: 'filter-test' },
    { name: 'filter-demographics' },
    { name: 'setup' }
  ];
  stepInfo: string;
  widgetTypes = [
    { name: WidgetTypes.Sample, selected: false },
    { name: WidgetTypes.Test, selected: false },
    { name: WidgetTypes.Instrument, selected: false },
    { name: WidgetTypes.Validation, selected: false }
  ];
  selectedWidgetType = '';
  selectButtonText = 'Select all';
  saveDisabled = true;
  selectAllDisabled = false;
  selectAllClass = 'select-all';
  @ViewChild('testInput', { static: false }) testInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  startEventSelected: any = {};
  finalEventSelected: any = {};
  instrumentsSelected: any = {};

  prioritySelected: string = '';
  demographicSelected: string = '';
  demographicSelectedPrevious: string = '';
  isDemographicsConfigure: boolean;
  isDemographicsDisabled: boolean = false;

  selectedIndex = 0;
  widgetSetupForm: FormGroup;
  widgetTypeForm: FormGroup;
  imageUrlArray = [];
  tatPreviews = ['./assets/widgets-preview/tat/Preview1.png'];
  lstPreviews = [
    './assets/widgets-preview/late_sample_tracking/Preview1.png',
    './assets/widgets-preview/late_sample_tracking/Preview2.png',
    './assets/widgets-preview/late_sample_tracking/Preview3.png'
  ];
  readonly secondsInMinute: number = 60;
  readonly secondsInHour: number = 3600;
  initialEventsInstrumentsSelected: string[] = null;
  finalEventsInstrumentsSelected: string[] = null;

  nextButtonEnabled = false;
  previousSelectedInstruments: any = {};

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<WidgetConfigurationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    iconRegistry.addSvgIcon('info-required', sanitizer.bypassSecurityTrustResourceUrl('assets/icons/info-24px.svg'));
    iconRegistry.addSvgIcon(
      'info-required-demographic-all',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/info-2.svg')
    );
    this.isDemographicsConfigure = data.widget === 'LST';
  }

  ngOnInit() {
    this.createFormControl();
    this.reconfigureWidget(this.data);
    switch (this.data.widget) {
      case WidgetCodes.TAT: {
        this.imageUrlArray = this.tatPreviews;
        break;
      }
      case WidgetCodes.LST: {
        this.imageUrlArray = this.lstPreviews;
      }
    }
  }

  goToChooseType() {
    this.chooseType = true;
    this.steps = [];
  }

  reorderStepper(type, stepper) {
    switch (type) {
      case WidgetTypes.Test: {
        this.steps = this.stepOption0;
        this.stepOrder = 0;
        this.selectedWidgetType = WidgetTypes.Test;
        break;
      }
      case WidgetTypes.Instrument: {
        this.steps = this.stepOption1;
        this.stepOrder = 1;
        this.selectedWidgetType = WidgetTypes.Instrument;
        break;
      }
      case WidgetTypes.Sample: {
        this.steps = this.stepOption1;
        this.stepOrder = 1;
        this.selectedWidgetType = WidgetTypes.Sample;
        break;
      }
      case WidgetTypes.Validation: {
        this.steps = this.stepOption1;
        this.stepOrder = 1;
        this.selectedWidgetType = WidgetTypes.Validation;
        break;
      }
    }
    setTimeout(() => {
      stepper.selectedIndex = 0;
      this.chooseType = false;
    }, 50);
  }

  selectWidgetType(type, stepper) {
    if (this.data.reconfigure) {
      if (type === this.data.configuration.type) {
        this.reorderStepper(type, stepper);
      } else {
        const dialogRef = this.dialog.open(ModalChangeWidgetTypeComponent, {
          autoFocus: false,
          closeOnNavigation: true,
          panelClass: 'modal-widget-type'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.reorderStepper(type, stepper);
          }
        });
      }
    } else {
      this.reorderStepper(type, stepper);
    }
  }

  createFormControl() {
    this.widgetSetupForm = new FormGroup(
      {
        targetH: new FormControl(),
        targetM: new FormControl(),
        targetAlertM: new FormControl(),
        warningTargetH: new FormControl(),
        warningTargetM: new FormControl(),
        warningAlertM: new FormControl(),
        errorM: new FormControl({ value: '', disabled: true }),
        lstExcludeTime: new FormControl(null),
        lstEraseTime: new FormControl(null)
      },
      {
        // tslint:disable: no-use-before-declare
        validators: [
          targetWarningTimeValidator,
          preTargetTimeValidator,
          preTargetTimeValidator2,
          preWarningTimeValidator,
          lstTimeExceedAlertValidator,
          lstTimeExceedDeleteValidator
        ]
        // tslint:enable: no-use-before-declare
      }
    );
    this.widgetTypeForm = new FormGroup({
      widgetTitle: new FormControl('', [Validators.required])
    });
  }

  reconfigureWidget(data) {
    if (data.reconfigure) {
      this.widgetTypeForm.controls['widgetTitle'].setValue(data.configuration.title);
      const issueTarget = this.secondsToHourMinute(data.configuration.issueTarget);
      const warningTarget = this.secondsToHourMinute(data.configuration.warningTarget);
      this.widgetSetupForm.controls['targetH'].setValue(issueTarget.hours);
      this.widgetSetupForm.controls['targetM'].setValue(issueTarget.minutes);
      this.widgetSetupForm.controls['warningTargetH'].setValue(warningTarget.hours);
      this.widgetSetupForm.controls['warningTargetM'].setValue(warningTarget.minutes);
      if (data.configuration.alarmWarningTarget !== '0') {
        const warningAlert = this.secondsToHourMinute(data.configuration.alarmWarningTarget);
        this.widgetSetupForm.controls['warningAlertM'].setValue(warningAlert.minutes);
      }
      if (data.configuration.alarmIssueTarget !== '0') {
        const targetAlert = this.secondsToHourMinute(data.configuration.alarmIssueTarget);
        this.widgetSetupForm.controls['targetAlertM'].setValue(targetAlert.minutes);
      }
      if (
        data.configuration.timeToEraseFromList !== null &&
        data.configuration.timeToExcludeFromList !== null &&
        data.widget === WidgetCodes.LST
      ) {
        this.widgetSetupForm.controls['lstEraseTime'].setValue(
          data.configuration.timeToEraseFromList / this.secondsInHour
        );
        this.widgetSetupForm.controls['lstExcludeTime'].setValue(
          data.configuration.timeToExcludeFromList / this.secondsInHour
        );
      }
      this.prioritySelected = data.configuration.priority;
      this.demographicSelected = data.configuration.organisations ? data.configuration.organisations : '';
      this.demographicSelectedPrevious = this.demographicSelected;
      const widgetTypeIndex = this.widgetTypes.findIndex(type => type.name === data.configuration.type);
      this.widgetTypes[widgetTypeIndex].selected = true;
      this.instrumentsSelected = { instrumentsId: data.configuration.instrumentsId.split(',') };
      this.previousSelectedInstruments = { instrumentsId: data.configuration.instrumentsId.split(',') };
      this.startEventSelected.instrumentsId = data.configuration.instrumentsIdInitialEvent;
      this.finalEventSelected.instrumentsId = data.configuration.instrumentsIdFinalEvent;
      this.startEventSelected.eventType = data.configuration.initialEventType.split(',');
      this.finalEventSelected.eventType = data.configuration.finalEventType.split(',');
      this.selectedTests = data.configuration.tests.split(',');
    }
  }

  get typeForm() {
    return this.widgetTypeForm.controls;
  }

  secondsToHourMinute(totalSeconds: number) {
    const hours = Math.floor(totalSeconds / this.secondsInHour);
    const minutes = Math.floor((totalSeconds - hours * this.secondsInHour) / this.secondsInMinute);
    const result = { hours: hours, minutes: minutes };
    return result;
  }

  selectStartEvent(event) {
    if (event === 'BLOCK') {
      this.nextButtonEnabled = false;
    } else {
      this.startEventSelected = event;
      this.checkSelectedEvents();
    }
  }
  selectFinalEvent(event) {
    if (event === 'BLOCK') {
      this.nextButtonEnabled = false;
    } else {
      this.finalEventSelected = event;
      this.checkSelectedEvents();
    }
  }

  selectInstruments(event) {
    this.instrumentsSelected = event;
    if (event.instrumentsId.length !== 0) {
      this.nextButtonEnabled = true;
    } else {
      if (this.selectedWidgetType === WidgetTypes.Validation) {
        this.nextButtonEnabled = true;
      } else {
        this.nextButtonEnabled = false;
      }
    }
  }

  selectTests(event) {
    this.selectedTests = event;
    if (this.selectedTests.length > 0) {
      this.nextButtonEnabled = true;
    } else {
      this.nextButtonEnabled = false;
    }
  }

  checkSelectedEvents() {
    if (this.finalEventSelected === null || this.startEventSelected === null) {
      this.nextButtonEnabled = false;
    } else {
      if (this.finalEventSelected.eventType && this.startEventSelected.eventType) {
        this.nextButtonEnabled = true;
      } else {
        this.nextButtonEnabled = false;
      }
    }
  }

  changeIsDemographicsConfigure(event: boolean) {
    this.isDemographicsConfigure = event;
    this.nextButtonEnabled =
      this.prioritySelected.length > 0 && (this.demographicSelected.length > 0 || !this.isDemographicsConfigure);
  }

  changeIsDemographicsDisabled(event: boolean) {
    this.isDemographicsDisabled = event;
  }

  selectPriority(event: string) {
    this.prioritySelected = event;
    this.nextButtonEnabled =
      this.prioritySelected.length > 0 && (this.demographicSelected.length > 0 || !this.isDemographicsConfigure);
  }

  selectDemographic(event: string) {
    this.demographicSelected = event;
    this.nextButtonEnabled = this.prioritySelected.length > 0 && this.demographicSelected.length > 0;
    this.updateAlertUserAllDemoSelected(event);
  }

  updateAlertUserAllDemoSelected(event: string) {
    if (event === ANY_ITEM) {
      this.showAllDemograpchicSelected = true;
      this.heightPercent = WidgetConfigurationComponent.heightSelectDemoGraphicPercentWithError;
      this.heightSelect = WidgetConfigurationComponent.heightSelectDemoGraphicWithError;
    } else {
      this.showAllDemograpchicSelected = false;
      this.heightPercent = WidgetConfigurationComponent.heightSelectDemoGraphicPercentWithoutError;
      this.heightSelect = WidgetConfigurationComponent.heightSelectDemoGraphicWithoutError;
    }
  }

  saveParameters() {
    this.dialogRef.close(this.processForm());
  }

  processForm() {
    const targetSeconds =
      (this.widgetSetupForm.value.targetH * this.secondsInMinute + this.widgetSetupForm.value.targetM) *
      this.secondsInMinute;
    const warningSeconds =
      (this.widgetSetupForm.value.warningTargetH * this.secondsInMinute + this.widgetSetupForm.value.warningTargetM) *
      this.secondsInMinute;
    const alarmIssueTarget = this.widgetSetupForm.value.targetAlertM * this.secondsInMinute;
    const alarmWarningTarget = this.widgetSetupForm.value.warningAlertM * this.secondsInMinute;
    const result: TatBasedConfiguration = {
      title: this.widgetTypeForm.value.widgetTitle,
      issueTarget: targetSeconds,
      warningTarget: warningSeconds,
      initialEventType: this.startEventSelected.eventType.toString(),
      instrumentsIdInitialEvent: this.startEventSelected.instrumentsId.toString(),
      finalEventType: this.finalEventSelected.eventType.toString(),
      instrumentsIdFinalEvent: this.finalEventSelected.instrumentsId.toString(),
      instrumentsId: this.instrumentsSelected.instrumentsId.toString(),
      alarmIssueTarget: alarmIssueTarget,
      alarmWarningTarget: alarmWarningTarget,
      type: this.selectedWidgetType,
      timeToEraseFromList: this.widgetSetupForm.value.lstEraseTime * this.secondsInHour,
      timeToExcludeFromList: this.widgetSetupForm.value.lstExcludeTime * this.secondsInHour,
      priority: this.prioritySelected,
      organisations: this.demographicSelected,
      tests: this.selectedTests.toString()
    };
    if (this.widgetSetupForm.value.lstEraseTime === null || this.widgetSetupForm.value.lstEraseTime === 0) {
      result.timeToEraseFromList = null;
    }
    if (this.widgetSetupForm.value.lstExcludeTime === null || this.widgetSetupForm.value.lstExcludeTime === 0) {
      result.timeToExcludeFromList = null;
    }
    return result;
  }

  updateTime(hourControl: string, minuteControl: string, timeInMinutes: number) {
    const minutes = timeInMinutes % this.secondsInMinute;
    const hours = (timeInMinutes - minutes) / this.secondsInMinute;
    const totalHours = this.widgetSetupForm.get(hourControl).value + hours;
    this.widgetSetupForm.controls[hourControl].setValue(totalHours);
    this.widgetSetupForm.controls[minuteControl].setValue(minutes);
  }

  toggleSaveButton() {
    if (this.selectedTests.length !== 0) {
      this.saveDisabled = false;
    } else {
      this.saveDisabled = true;
    }
  }

  goStepBack(stepper: MatStepper) {
    if (this.isDemographicsDisabled && this.demographicSelected === '') {
      this.demographicSelected = this.demographicSelectedPrevious;
    }
    stepper.selected.completed = false;
    stepper.previous();
  }

  goStepForward(stepper: MatStepper) {
    stepper.selected.completed = true;
    stepper.next();
  }

  omit_symbols(e) {
    if (
      e.keyCode === KeyCodes.DOT ||
      e.keyCode === KeyCodes.MINUS ||
      e.keyCode === KeyCodes.COMMA ||
      e.keyCode === KeyCodes.PLUS ||
      e.keyCode === KeyCodes.E
    ) {
      e.preventDefault();
    }
  }

  launchUserAssistance() {
    if (this.data.widget === WidgetCodes.TAT) {
      this.userService.openUA(ScreenCodes.TATConfiguration);
    } else if (this.data.widget === WidgetCodes.LST) {
      this.userService.openUA(ScreenCodes.LSTConfiguration);
    }
  }
}

const targetWarningTimeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const targetTime = control.get('targetH').value * 60 + control.get('targetM').value;
  const warningTime = control.get('warningTargetH').value * 60 + control.get('warningTargetM').value;

  return targetTime <= warningTime && control.get('targetM').value !== null && control.get('warningTargetM') !== null
    ? { timeInvalid: true }
    : null;
};

const preTargetTimeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const targetTime = control.get('targetH').value * 60 + control.get('targetM').value;
  const warningTime = control.get('warningTargetH').value * 60 + control.get('warningTargetM').value;
  const targetAlert = control.get('targetAlertM').value;

  return targetTime - targetAlert <= warningTime && targetAlert !== null && control.get('warningTargetM').value !== null
    ? { preAlertInvalid: true }
    : null;
};

const preTargetTimeValidator2: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const targetTime = control.get('targetH').value * 60 + control.get('targetM').value;
  const targetAlert = control.get('targetAlertM').value;

  return targetAlert >= targetTime && targetAlert !== null ? { preAlertInvalid2: true } : null;
};

const preWarningTimeValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const warningTime = control.get('warningTargetH').value * 60 + control.get('warningTargetM').value;
  const warningAlert = control.get('warningAlertM').value;

  return warningTime <= warningAlert && warningAlert !== null ? { preWarningInvalid: true } : null;
};

const lstTimeExceedAlertValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const targetTime = control.get('targetH').value * 60 + control.get('targetM').value;
  const excludeTime = control.get('lstExcludeTime').value;
  const eraseTime = control.get('lstEraseTime').value;

  return (excludeTime * 60 <= targetTime || eraseTime * 60 <= targetTime) &&
    (excludeTime !== null || eraseTime !== null)
    ? { lstTimeExceedAlertInvalid: true }
    : null;
};

const lstTimeExceedDeleteValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
  const excludeTime = control.get('lstExcludeTime').value;
  const eraseTime = control.get('lstEraseTime').value;

  return eraseTime * 60 <= excludeTime * 60 && excludeTime !== null && eraseTime !== null
    ? { lstTimeExceededDeleteInvalid: true }
    : null;
};
