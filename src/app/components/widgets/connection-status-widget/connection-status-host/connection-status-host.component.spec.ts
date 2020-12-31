import { UpdateService } from 'src/app/services/update-service/update.service';
import { StatusCNS } from './../../../shared/app-constants';
import { hostDesconnectedArray } from './../../../../test-utils/test-host-array';
import { KPIValue } from './../../../../models/kpivalue.model';
import { ConnectionStatusHostComponent } from './connection-status-host.component';
import { LabService } from 'src/app/services/lab/lab.service';
import { of, Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatGridListModule } from '@angular/material/grid-list';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { MatCardTitle, MatCardHeader, MatCardContent, MatCard } from '@angular/material/card';
import { TranslatePipeMock } from 'src/app/test-utils/translate-pipe-mock';
import { MatIconComponentMock } from 'src/app/test-utils/mat-icon-component-mock';
import { hostArray, hostStatusArray } from 'src/app/test-utils/test-host-array';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('ConnectionStatusHostComponent', () => {
  const itemList = hostArray.map(function(element) {
    return { hostName: element.hostName, connectionName: element.connectionName, value: element.hostConnectionId.id };
  });
  const itemListStatus = hostStatusArray.map(function(element) {
    return { id: element.id, values: element.values };
  });

  let labServiceMock: Partial<LabService> = {
    getHostConnections: function() {
      return of(hostArray);
    }
  };

  let kpiUpdatesServiceMock: Partial<UpdateService> = {
    getSubscriber: function() {
      let kpiValues: Subject<KPIValue> = new Subject<KPIValue>();
      kpiValues.next(hostStatusArray[0]);
      return kpiValues;
    }
  };

  const connectionStatusHostComponent = ConnectionStatusHostComponent.createNew(null, null);
  connectionStatusHostComponent.configuration = {
    title: 'HostMock',
    type: 'Host',
    instruments: '',
    hosts: '1,2,4,3'
  };

  function setUp(
    kpiUpdatesService: Partial<UpdateService> = kpiUpdatesServiceMock,
    labService: Partial<LabService> = labServiceMock
  ) {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCheckboxModule,
        MatGridListModule,
        MatChipsModule,
        MatSelectModule,
        MatDividerModule,
        MatListModule,
        MatSelectModule,
        TranslateModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        MatTabsModule,
        MatTooltipModule,
        ToastrModule.forRoot()
      ],
      declarations: [
        ConnectionStatusHostComponent,
        TranslatePipeMock,
        MatIconComponentMock,
        MatCardTitle,
        MatCardHeader,
        MatCardContent,
        MatCard
      ],
      providers: [
        { provide: LabService, useValue: labServiceMock },
        { provide: kpiUpdatesService, useValue: kpiUpdatesServiceMock }
      ]
    });

    const spyLabService = jest.spyOn(labServiceMock, 'getHostConnections').mockClear();
    const fixture = TestBed.createComponent(ConnectionStatusHostComponent);
    const component = fixture.componentInstance;
    return { component, spyLabService };
  }

  // Test ngOninit method
  test('ngOnInit(): initialize component test with no host configured', async () => {
    let labServiceNoValuesMock: Partial<LabService> = {
      getHostConnections: function() {
        return of([]);
      }
    };

    let kpiUpdatesServiceNoValuesMock: Partial<UpdateService> = {
      start: function() {
        return of([]);
      }
    };
    const { component, spyLabService } = setUp(kpiUpdatesServiceNoValuesMock, labServiceNoValuesMock);
    component.ngOnInit();
    expect(spyLabService).toHaveBeenCalledTimes(1);
  });

  test('ngOnInit(): initialize component test with host configured', async () => {
    const { component } = setUp();
    component.configuration = connectionStatusHostComponent.configuration;
    component.oid = '7361218f-563a-4aed-8497-becfc7b79aea';

    component.ngOnInit();
    // spys calls
    expect(component.allHosts.length).toEqual(0);
    expect(component.allHostsWaiting.length).toEqual(0);
    expect(component.statusCNS).toEqual(StatusCNS.Waiting);
  });

  test('ngAfterContentInit():   Initialize test without KPI configuration', async () => {
    const { component } = setUp();
    component.oid = '7361218f-563a-4aed-8497-becfc7b79aea';

    component.onUpdateTitle.subscribe(kpiUpdatesServiceMock);
    component.ngAfterContentInit();
    expect(component.allHosts.length).toEqual(0);
    expect(component.allHostsWaiting.length).toEqual(0);
  });
  test('updateContent(): Connected host', async () => {
    const { component } = setUp();
    component.oid = '7361218f-563a-4aed-8497-becfc7b79aea';
    component.configuration = connectionStatusHostComponent.configuration;
    component.existHosts = true;
    component.progressD3 = component.createRadial(component.progress.nativeElement);
    component.backgroundD3 = component.createBackground(component.background.nativeElement);

    component.updateContent();
    expect(component.statusCNS).toEqual(StatusCNS.Connected);
  });

  test('updateContent(): Disconnected host', async () => {
    const { component } = setUp();
    component.oid = '7361218f-563a-4aed-8497-becfc7b79aea';
    component.configuration = connectionStatusHostComponent.configuration;

    component.allHosts = hostDesconnectedArray.map(function(element) {
      return {
        id: element.id,
        name: element.name,
        connectionName: element.connectionName,
        time: new Date(element.time),
        status: element.status
      };
    });
    component.progressD3 = component.createRadial(component.progress.nativeElement);
    component.backgroundD3 = component.createBackground(component.background.nativeElement);

    component.updateContent();
    expect(component.statusCNS).toEqual(StatusCNS.Disconnected);
    expect(component.allHosts.length).toEqual(3);
    expect(component.disconnectedHost.length).toEqual(3);
  });

  test('resize(newCols, newRows): widget size setting', async () => {
    const { component } = setUp();
    component.oid = '7361218f-563a-4aed-8497-becfc7b79aea';
    component.configuration = connectionStatusHostComponent.configuration;

    component.allHosts = hostDesconnectedArray.map(function(element) {
      return {
        id: element.id,
        name: element.name,
        connectionName: element.connectionName,
        time: new Date(element.time),
        status: element.status
      };
    });
    component.progressD3 = component.createRadial(component.progress.nativeElement);
    component.backgroundD3 = component.createBackground(component.background.nativeElement);
    let newCols: number = 1;
    let newRows: number = 2;
    component.resize(newCols, newRows);

    expect(component.showPlug).toBeTruthy;
    expect(component.showPlug2).toBeTruthy;
    expect(component.oneXVersion).toBeFalsy;
    expect(component.twoXVersion).toBeFalsy;
  });

  test('duplicate(): Duplicate confirutation CNS', async () => {
    const { component } = setUp();
    component.oid = '7361218f-563a-4aed-8497-becfc7b79aea';
    component.configuration = connectionStatusHostComponent.configuration;

    const duplicateComponent = component.duplicate();
    expect(component.requiresConfiguration).toBeFalsy;
  });
});
