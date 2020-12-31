import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService } from '../notification.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  tenantId = 'leonidas';

  helper = new JwtHelperService();

  constructor(private notificationService: NotificationService) {}

  getRole() {
    if (localStorage.getItem('access_token')) {
      const decodedToken = this.helper.decodeToken(localStorage.getItem('access_token'));
      return decodedToken.authorities[0];
    } else {
      return null;
    }
  }

  getUserName() {
    return 'mockUser';
    /*
    if (localStorage.getItem('access_token')) {
      const decodedToken = this.helper.decodeToken(localStorage.getItem('access_token'));
      return decodedToken.user_name;
    }
    return null;
    */
  }

  openUA(screenCode: string) {
    const params = 'status=no,location=no,toolbar=no,menubar=no,titlebar=no, width=700,height=600,left=-1000,top=40';
    window.open(
      'http://' + window.location.hostname + ':' + window.location.port + '/assistance/en#context=' + screenCode,
      'ciPM',
      params
    );
  }

  shareDashboard(dashboardId: string) {
    const value = 'http://' + window.location.hostname + ':' + window.location.port + '/app/dashboard/' + dashboardId;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = value;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.notificationService.okMessage('link-copied');
  }
}
