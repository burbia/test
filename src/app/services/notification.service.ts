import { MILLISECONDS_IN_MINUTE } from './../components/shared/app-constants';
import { WarningDemoToast } from './../custom-toasts/warning.demo.toast';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SuccessToast } from '../custom-toasts/success.toast';
import { ErrorToast } from '../custom-toasts/error.toast';
import { WarningToast } from '../custom-toasts/warning.toast';
import { WarningDemoEndToast } from '../custom-toasts/warning.demo.end.toast';
import { ResetToast } from '../custom-toasts/reset.toast';
import { ResetAttemptToast } from '../custom-toasts/reset.attemp.toast';
import { ResetFailedToast } from '../custom-toasts/reset.failed.toast';
import { ResetAttemptFailedToast } from '../custom-toasts/reset.attemp.failed.toast';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  toastMap = new Map();

  okMessage(message: string) {
    this.toastr.show('', message, {
      toastComponent: SuccessToast
    });
  }

  errorMessage(message: string) {
    this.toastr.show('', message, {
      toastComponent: ErrorToast
    });
  }

  warningMessage(message: string) {
    this.toastr.show('', message, {
      toastComponent: WarningToast
    });
  }

  demoWarningMessage(message: string) {
    this.toastr.show('', message, {
      toastComponent: WarningDemoToast,
      timeOut: MILLISECONDS_IN_MINUTE
    });
  }
  demoWarningEndMessage(message: string) {
    this.toastr.show('', message, {
      toastComponent: WarningDemoEndToast,
      timeOut: MILLISECONDS_IN_MINUTE
    });
  }

  connectionLost(code: string) {
    if (!this.toastMap.has(code)) {
      const toast = this.toastr.show(code, 'connection-lost', {
        toastComponent: ErrorToast,
        disableTimeOut: true
      });
      this.toastMap.set(code, toast);
    }
  }

  connectionRecovered(code: string) {
    if (this.toastMap.has(code)) {
      this.toastr.remove(this.toastMap.get(code).toastId);
      this.toastMap.delete(code);
      this.toastr.show(code, 'connection-recovered', {
        toastComponent: SuccessToast
      });
    }
  }

  resetFail(message: string) {
    this.toastr.show('', message, {
      toastComponent: ResetFailedToast
    });
  }

  resetOK(message: string) {
    this.toastr.show('', message, {
      toastComponent: ResetToast
    });
  }

  resetAttempt(message: string) {
    this.toastr.show('', message, {
      toastComponent: ResetAttemptToast
    });
  }

  resetAttemptFail(message: string) {
    this.toastr.show('', message, {
      toastComponent: ResetAttemptFailedToast
    });
  }
}
