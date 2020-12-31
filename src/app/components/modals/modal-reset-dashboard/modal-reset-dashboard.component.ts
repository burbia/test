import { ScheduledConfig } from 'src/app/models/ScheduledConfig.model';
import { Component, OnInit, Inject, Output, EventEmitter } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-modal-reset-dashboard',
  templateUrl: './modal-reset-dashboard.component.html',
  styleUrls: ['./modal-reset-dashboard.component.scss']
})
export class ModalResetDashboardComponent implements OnInit {
  confirmEnabled: boolean = false;
  resetTimeInit: boolean = false;
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone;
  scheduledTimeForm = new FormGroup({
    inputHour: new FormControl('', [
      Validators.required,
      Validators.min(0),
      Validators.max(23),
      Validators.maxLength(2)
    ]),
    inputMin: new FormControl('', [Validators.required, Validators.min(0), Validators.max(59), Validators.maxLength(2)])
  });

  constructor(public dialogRef: MatDialogRef<ModalResetDashboardComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data && data.resetTime) {
      var splitResetTime = data.resetTime.split(':');
      if (splitResetTime.length > 0) {
        this.resetTimeInit = true;
        var hour = splitResetTime[0];
        var minute = splitResetTime[1];
        const imputHour = this.scheduledTimeForm.get('inputHour');
        const inputMin = this.scheduledTimeForm.get('inputMin');
        imputHour.setValue(hour);
        imputHour.markAsDirty();
        inputMin.setValue(minute);
        inputMin.markAsDirty();
      }
    }
  }

  ngOnInit() {}

  scheduled() {
    var hour = this.scheduledTimeForm.controls['inputHour'].value;
    var minute = this.scheduledTimeForm.controls['inputMin'].value;
    const scheduledConfig: ScheduledConfig =
      hour && minute
        ? { resetTime: hour + ':' + minute, timeZone: this.timeZone }
        : { resetTime: '', timeZone: this.timeZone };

    this.dialogRef.close(scheduledConfig);
  }

  resetNow() {
    this.dialogRef.close({ scheduled: false });
  }

  clear() {
    this.scheduledTimeForm.reset();
    this.resetTimeInit = false;
    this.confirmEnabled = this.resetTimeInit;
    this.data.clearFunction({ resetTime: '', timeZone: this.timeZone });
  }

  cancel() {
    this.dialogRef.close();
  }

  onInput(event) {
    if (event.target.value.length > event.target.maxLength) {
      const input = this.scheduledTimeForm.get(event.target.id);
      input.setValue(event.target.value.slice(0, event.target.maxLength));
    }
    this.confirmEnabled = false;
  }

  onBlur(event) {
    if (event.target.value.length > 0 && event.target.value.length < event.target.maxLength) {
      const input = this.scheduledTimeForm.get(event.target.id);
      input.setValue('0' + event.target.value);
    }
  }

  isEmpty() {
    if (this.resetTimeInit) {
      var hour = this.scheduledTimeForm.controls['inputHour'].value;
      var minute = this.scheduledTimeForm.controls['inputMin'].value;
      return !hour && !minute;
    }
    return true;
  }

  get timeForm() {
    return this.scheduledTimeForm.controls;
  }
}
