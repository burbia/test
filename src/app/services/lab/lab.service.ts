import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LabService {
  constructor(public http: HttpClient, private userService: UserService) {}

  public getLstResult(widgetId: string) {
    return this.http.get(environment.dashboardUrl + 'dashboard/lst/' + this.userService.tenantId + '/' + widgetId);
  }

  getSuperGroups() {
    return this.http.get(environment.configurationsUrl + 'groups/' + this.userService.tenantId + '/parents');
  }

  getGroupsOfSupergroups(groupId: string) {
    return this.http.get(environment.configurationsUrl + 'groups/' + this.userService.tenantId + '/' + groupId);
  }

  getTestsOfGroup(groupId: number) {
    return this.http.get(
      environment.configurationsUrl + 'testinstruments/' + this.userService.tenantId + '/group/' + groupId
    );
  }

  public getGroups() {
    return this.http.get(environment.configurationsUrl + 'groups/' + this.userService.tenantId);
  }

  public getAllTests() {
    return this.http.get(environment.configurationsUrl + 'testinstruments/' + this.userService.tenantId);
  }

  public getTestsGroups(groupId: number) {
    return this.http.get(environment.configurationsUrl + 'groups/' + this.userService.tenantId + '/' + groupId);
  }

  public getInstruments() {
    return this.http.get(environment.configurationsUrl + 'instruments/' + this.userService.tenantId);
  }

  public getEvents() {
    return this.http.get('assets/events.json');
  }

  public getOrganisations() {
    return this.http.get(environment.configurationsUrl + 'organisations/' + this.userService.tenantId);
  }

  public getHostConnections() {
    return this.http.get(environment.configurationsUrl + 'hostconnections/' + this.userService.tenantId);
  }
}
