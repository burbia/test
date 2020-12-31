import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { KeyCodes, EventCodes, ScreenCodes } from 'src/app/components/shared/app-constants';
import { SampleWorkloadWidgetConfiguration } from '../model/sample-workload-widget.configuration';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-modal-sw-setup',
  templateUrl: './modal-sw-setup.component.html',
  styleUrls: ['./modal-sw-setup.component.scss']
})
export class ModalSwSetupComponent implements OnInit {
  steps = [
    { name: 'Name and priority' },
    { name: 'Filter by instrument' },
    { name: 'Filter by test' },
    { name: 'Setup' }
  ];

  priorities = [
    { name: 'Any', value: 'any' },
    { name: 'STAT', value: 'STAT' },
    { name: 'Routine', value: 'ROUTINE' }
  ];
  prioritySelected = 'any';
  instrumentsSelected: any = {};
  selectedTests = [];

  pendingOptions = [
    { title: 'added-order', value: EventCodes.OrderRegistered, disabled: false },
    { title: '1-sample-seen', value: EventCodes.FirstSampleSeen, disabled: false }
  ];

  processingOptions = [
    { title: '1-sample-seen', value: EventCodes.FirstSampleSeen, disabled: false },
    { title: '2-sample-seen', value: EventCodes.SecondSampleSeen, disabled: false },
    { title: 'manual-sample-seen', value: EventCodes.SampleSeenManually, disabled: false },
    { title: 'sample-seen-pre', value: EventCodes.SampleSeenPreAnalytic, disabled: false },
    { title: 'sample-seen-analyzer-undefined', value: EventCodes.SampleSeenAnalyticOrUndefined, disabled: false },
    { title: 'sample-seen-post', value: EventCodes.SampleSeenPostAnalytic, disabled: false }
  ];

  completedOptions = [
    { title: 'test-results', value: EventCodes.TestResultProduced, disabled: false },
    { title: 'technical-validation', value: EventCodes.TestResultValidatedTechnically, disabled: false },
    { title: 'medical-validation', value: EventCodes.TestResultValidatedMedically, disabled: false }
  ];

  pendingSelected;
  processingSelected;
  completedSelected;

  imageUrlArray = [
    './assets/widgets-preview/sample_workload/Preview1.png',
    './assets/widgets-preview/sample_workload/Preview2.png'
  ];

  widgetTitleForm: FormGroup;
  widgetSetupForm: FormGroup;

  nextButtonEnabled = true;
  confirmButtonEnabled = false;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ModalSwSetupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.createForms();
    if (this.data.reconfigure) {
      this.recover(this.data.configuration);
    }
  }

  recover(configuration: SampleWorkloadWidgetConfiguration) {
    this.widgetTitleForm.controls['widgetTitle'].setValue(configuration.title);
    this.prioritySelected = configuration.priority;
    this.instrumentsSelected = { instrumentsId: configuration.instrumentsId.split(',') };
    this.selectedTests = configuration.tests.split(',');
    const pending = configuration.pending.split(',');
    const processing = configuration.processing.split(',');
    const completing = configuration.completed.split(',');
    this.pendingSelected = pending[0];
    this.processingSelected = processing[0];
    this.completedSelected = completing[0];
    if (this.pendingSelected === EventCodes.FirstSampleSeen) {
      this.processingOptions[0].disabled = true;
    }
    if (this.pendingSelected === EventCodes.OrderRegistered) {
      this.processingOptions[1].disabled = true;
    }
    this.widgetSetupForm.controls['resetPending'].setValue(configuration.resetPending);
    this.widgetSetupForm.controls['resetProcessing'].setValue(configuration.resetProcessing);
    this.widgetSetupForm.controls['resetCompleted'].setValue(configuration.resetCompleted);
    this.checkTimesValidity();
  }

  createForms() {
    this.widgetTitleForm = new FormGroup({
      widgetTitle: new FormControl('')
    });

    this.widgetSetupForm = new FormGroup({
      resetPending: new FormControl('7', [Validators.required]),
      resetProcessing: new FormControl('7', [Validators.required]),
      resetCompleted: new FormControl('0', [Validators.required])
    });
  }

  get titleForm() {
    return this.widgetTitleForm;
  }
  get setupForm() {
    return this.widgetSetupForm;
  }

  selectInstruments(event) {
    this.instrumentsSelected = event;
    if (event.instrumentsId.length !== 0) {
      this.nextButtonEnabled = true;
    } else {
      this.nextButtonEnabled = false;
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

  changePriority(event) {
    this.prioritySelected = event.value;
  }

  changePendingOption(event) {
    this.pendingSelected = event.value;
    if (event.value === EventCodes.FirstSampleSeen) {
      this.processingOptions[0].disabled = true;
      if (this.processingSelected === this.processingOptions[0].value) {
        this.processingSelected = undefined;
      }
    } else {
      this.processingOptions[0].disabled = false;
    }
    if (event.value === EventCodes.OrderRegistered) {
      this.processingOptions[1].disabled = true;
      if (this.processingSelected === this.processingOptions[1].value) {
        this.processingSelected = undefined;
      }
    } else {
      this.processingOptions[1].disabled = false;
    }
    this.checkTimesValidity();
  }

  changeProcessingOption(event) {
    this.processingSelected = event.value;
    this.checkTimesValidity();
  }

  changeCompletedOption(event) {
    this.completedSelected = event.value;
    this.checkTimesValidity();
  }

  checkTimesValidity() {
    if ((this.pendingSelected && this.processingSelected && this.completedSelected) !== undefined) {
      this.confirmButtonEnabled = true;
    } else {
      this.confirmButtonEnabled = false;
    }
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

  saveParameters() {
    this.dialogRef.close(this.createResult());
  }

  createResult() {
    let pending = this.pendingSelected;
    let processing = this.processingSelected;
    let completing = this.completedSelected;
    if (this.pendingSelected === EventCodes.FirstSampleSeen) {
      pending = [
        EventCodes.FirstSampleSeen,
        EventCodes.SampleSeenManually,
        EventCodes.SampleSeenAnalytic,
        EventCodes.SampleSeenPreAnalytic,
        EventCodes.SampleSeenPostAnalytic,
        EventCodes.SampleSeenOnUnknown
      ];
    }
    if (this.processingSelected === EventCodes.FirstSampleSeen) {
      processing = [
        EventCodes.FirstSampleSeen,
        EventCodes.SampleSeenManually,
        EventCodes.SampleSeenAnalytic,
        EventCodes.SampleSeenPreAnalytic,
        EventCodes.SampleSeenPostAnalytic,
        EventCodes.SampleSeenOnUnknown
      ];
    }
    if (this.processingSelected === EventCodes.SecondSampleSeen) {
      processing = [
        EventCodes.SecondSampleSeen,
        EventCodes.SampleSeenManually,
        EventCodes.SampleSeenAnalytic,
        EventCodes.SampleSeenPreAnalytic,
        EventCodes.SampleSeenPostAnalytic,
        EventCodes.SampleSeenOnUnknown
      ];
    }
    if (this.processingSelected === EventCodes.SampleSeenAnalyticOrUndefined) {
      processing = [
        EventCodes.SampleSeenAnalyticOrUndefined,
        EventCodes.SampleSeenAnalytic,
        EventCodes.SampleSeenOnUnknown
      ];
    }
    if (this.completedSelected === EventCodes.TestResultProduced) {
      completing = [
        EventCodes.TestResultProduced,
        EventCodes.TestResultReceived,
        EventCodes.TestResultUpdated,
        EventCodes.TestResultCalculated
      ];
    }
    const result = {
      title: this.widgetTitleForm.controls.widgetTitle.value,
      priority: this.prioritySelected,
      instrumentsId: this.instrumentsSelected.instrumentsId.toString(),
      tests: this.selectedTests.toString(),
      pending: pending.toString(),
      processing: processing.toString(),
      completed: completing.toString(),
      resetPending: this.setupForm.controls.resetPending.value,
      resetProcessing: this.setupForm.controls.resetProcessing.value,
      resetCompleted: this.setupForm.controls.resetCompleted.value
    };
    console.log(result);
    return result;
  }

  goStepBack(stepper: MatStepper) {
    stepper.selected.completed = false;
    stepper.previous();
    if (stepper.selectedIndex === 0) {
      this.nextButtonEnabled = true;
    }
  }

  goStepForward(stepper: MatStepper) {
    stepper.selected.completed = true;
    stepper.next();
  }

  launchUserAssistance() {
    this.userService.openUA(ScreenCodes.SWLConfiguration);
  }
}
