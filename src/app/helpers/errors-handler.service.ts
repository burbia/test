import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '../services/notification.service';
import { AuthenticationService } from '../services/authentication.service';
@Injectable({
  providedIn: 'root',
})
export class ErrorsHandler implements ErrorHandler {
  constructor( private notificationService: NotificationService, private authenticationService: AuthenticationService) { }

  messagingStarted = false;

  handleError(error: Error | HttpErrorResponse) {
    if (error instanceof HttpErrorResponse) {
      if (!navigator.onLine) {
        if (!this.messagingStarted) {
          this.notificationService.connectionLost('Network');
          this.messagingStarted = true;
          const timer = setInterval(() => {
            if (navigator.onLine) {
              this.messagingStarted = false;
              this.notificationService.connectionRecovered('Network');
              clearInterval(timer);
            }
          }, 1000);
        }
      } else {
        if (error.status === 401) {
          this.authenticationService.logout();
        }
      }
    } else {
      // Handle Client Error (Angular Error, ReferenceError...)
    }
    console.log(error);
  }

}
