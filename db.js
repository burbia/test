module.exports = () => {
  var hostConnectionsArray = buildHostConnectionsArray();

  function buildHostConnectionsArray() {
    var result = [];

    for (let i = 0; i < 100; i++) {
      result.push({
        hostConnectionId: {
          tenantId: 'leonidas',
          id: `${i}`
        },
        connectionName: `Connection Name A${i}`,
        hostName: `Host Name A1 ${i}`
      });
    }

    return result;
  }

  var cmPayloadWidgetCNS2 = buildPayloadCNS2();

  function buildPayloadCNS2() {
    var result = '';
    for (let i = 1; i < 37; i++) {
      result +=
        i < 36
          ? `{"id":"${i}","name":"Host Auto Name ${i}","time":"2020-08-01T10:13:${9 + i}Z","status":"0"},\n            `
          : `{"id":"${i}","name":"Host Auto Name ${i}","time":"2020-08-01T10:13:${9 + i}Z","status":"0"}\n            `;
    }
    return '[\n            ' + result + ']';
  }

  const data = {
    license: {
      status: 'DEMO_PERIOD', //NOT_LICENSED, EXPIRED_DEMO_PERIOD, LICENSE_EXPIRED, LICENSED, DEMO_PERIOD,
      validationResult: 'NO_KEY',
      dueDate: '2020-08-24T10:09:01.174892500Z' // "2020-08-09T10:09:01.174892500Z --> yyyy-MM-ddThh:mm:ss
    },
    resetnow: {},
    dashboardReset: {
      dashboardId: { tenantId: 'leonidas', id: '35cb7328-5920-4184-8cab-ed014d323fcb' },
      title: 'EVENTS',
      creationDate: '2020-10-07T11:16:23.407+0000',
      widgets: [
        {
          id: '313608e5-cca3-4a77-9dc6-d8f93bd1add0',
          idDashboard: '35cb7328-5920-4184-8cab-ed014d323fcb',
          code: 'TAT',
          title: 'tat-reset',
          cols: 1,
          rows: 1,
          x: 1,
          y: 0,
          active: true,
          configuration: {
            issueTarget: '120',
            warningTarget: '60',
            initialEventType: 'O0001',
            instrumentsIdInitialEvent: '',
            finalEventType: 'T0003',
            instrumentsIdFinalEvent: '',
            instrumentsId:
              '452||1,452||2,452||3,452||4,452||5,452||6,452||7,452||8,452||9,452||10,452||11,452||12,452||13,452||14,452||15,572||1,572||2,572||3,579||1,579||4,579||5,579||6,579||7,579||8,579||9,579||10,579||11,579||12,579||13,579||14,713||1,713||3,713||4,713||5,713||6,713||7,713||8,713||9,713||10,715||1,715||2,715||3,715||4,715||5,715||6,715||7,715||88,715||9,715||10',
            alarmIssueTarget: '0',
            alarmWarningTarget: '0',
            type: 'Test',
            timeToEraseFromList: null,
            timeToExcludeFromList: null,
            priority: 'any',
            organisations: '',
            tests: '1',
            title: 'tat-reset'
          },
          deleteDate: null
        },
        {
          id: 'b836c1dc-2958-4c5f-90fa-e8bb28766d05',
          idDashboard: '35cb7328-5920-4184-8cab-ed014d323fcb',
          code: 'SWL',
          title: 'swl',
          cols: 1,
          rows: 1,
          x: 1,
          y: 0,
          active: true,
          configuration: {
            priority: 'any',
            instrumentsId: '636||1,636||2,636||3,636||4,636||5',
            tests: '1',
            pending: 'O0001',
            processing: 'FSS,S0001,S0003,S0002,S0004,S0005',
            completed: 'T0001,T0002,T0003,T0008',
            resetPending: '7',
            resetProcessing: '7',
            resetCompleted: '0',
            title: 'swl'
          },
          deleteDate: null
        },
        {
          id: 'ff4a7e27-2b8d-45f0-8cb4-2c60708f6718',
          idDashboard: '35cb7328-5920-4184-8cab-ed014d323fcb',
          code: 'SWL',
          title: 'swl',
          cols: 1,
          rows: 1,
          x: 0,
          y: 0,
          active: true,
          configuration: {
            priority: 'any',
            instrumentsId: '636||1,636||2,636||3,636||4,636||5',
            tests: '1',
            pending: 'O0001',
            processing: 'FSS,S0001,S0003,S0002,S0004,S0005',
            completed: 'T0001,T0002,T0003,T0008',
            resetPending: '7',
            resetProcessing: '7',
            resetCompleted: '0',
            title: 'swl'
          },
          deleteDate: null
        },
        {
          id: '25ac1cdb-12bd-462a-a265-057736604dfa',
          idDashboard: '35cb7328-5920-4184-8cab-ed014d323fcb',
          code: 'LST',
          title: 'lst',
          cols: 2,
          rows: 2,
          x: 4,
          y: 0,
          active: true,
          configuration: {
            issueTarget: '120',
            warningTarget: '60',
            initialEventType: 'O0001',
            instrumentsIdInitialEvent: '',
            finalEventType: 'T0004',
            instrumentsIdFinalEvent: '',
            instrumentsId:
              '452||1,452||2,452||3,452||4,452||5,452||6,452||7,452||8,452||9,452||10,452||11,452||12,452||13,452||14,452||15,572||1,572||2,572||3,579||1,579||4,579||5,579||6,579||7,579||8,579||9,579||10,579||11,579||12,579||13,579||14,713||1,713||3,713||4,713||5,713||6,713||7,713||8,713||9,713||10,715||1,715||2,715||3,715||4,715||5,715||6,715||7,715||88,715||9,715||10',
            alarmIssueTarget: '0',
            alarmWarningTarget: '0',
            type: 'Test',
            timeToEraseFromList: null,
            timeToExcludeFromList: null,
            priority: 'any',
            organisations: 'any',
            tests: '1',
            title: 'lst'
          },
          deleteDate: null
        },
        {
          id: '29ab75a5-600b-419b-a2c2-3f0b9b6518f2',
          idDashboard: '35cb7328-5920-4184-8cab-ed014d323fcb',
          code: 'TAT',
          title: 'tat2',
          cols: 1,
          rows: 1,
          x: 2,
          y: 1,
          active: true,
          configuration: {
            issueTarget: '120',
            warningTarget: '60',
            initialEventType: 'O0001',
            instrumentsIdInitialEvent: '',
            finalEventType: 'T0003',
            instrumentsIdFinalEvent: '',
            instrumentsId:
              '452||1,452||2,452||3,452||4,452||5,452||6,452||7,452||8,452||9,452||10,452||11,452||12,452||13,452||14,452||15,572||1,572||2,572||3,579||1,579||4,579||5,579||6,579||7,579||8,579||9,579||10,579||11,579||12,579||13,579||14,713||1,713||3,713||4,713||5,713||6,713||7,713||8,713||9,713||10,715||1,715||2,715||3,715||4,715||5,715||6,715||7,715||88,715||9,715||10',
            alarmIssueTarget: '0',
            alarmWarningTarget: '0',
            type: 'Test',
            timeToEraseFromList: null,
            timeToExcludeFromList: null,
            priority: 'any',
            organisations: '',
            tests: '1',
            title: 'tat2'
          },
          deleteDate: null
        },
        {
          id: 'fc94e317-c329-4bd0-b7ae-553ea0b61923',
          idDashboard: '35cb7328-5920-4184-8cab-ed014d323fcb',
          code: 'CNS',
          title: 'host',
          cols: 1,
          rows: 1,
          x: 1,
          y: 1,
          active: true,
          configuration: {
            type: 'Host',
            instruments: '',
            hosts:
              '0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99',
            title: 'host'
          },
          deleteDate: null
        },
        {
          id: '802bd675-179e-451e-9305-ec75080f1e99',
          idDashboard: '35cb7328-5920-4184-8cab-ed014d323fcb',
          code: 'CNS',
          title: 'instrument',
          cols: 2,
          rows: 2,
          x: 0,
          y: 1,
          active: true,
          configuration: {
            type: 'Instrument',
            instruments:
              '579||2,579||3,713||2,452||1,452||2,452||3,452||4,452||5,452||6,452||7,452||8,452||9,452||10,452||11,452||12,452||13,452||14,452||15,572||1,572||2,572||3,579||1,579||4,579||5,579||6,579||7,579||8,579||9,579||10,579||11,579||12,579||13,579||14,713||1,713||3,713||4,713||5,713||6,713||7,713||8,713||9,713||10,715||1,715||2,715||3,715||4,715||5,715||6,715||7,715||88,715||9,715||10,636||1,636||2,636||3,636||4,636||5',
            hosts: '',
            title: 'instrument'
          },
          deleteDate: null
        },
        {
          id: 'f72b9ae8-8f4f-4e6d-976f-59f2c8214032',
          idDashboard: '35cb7328-5920-4184-8cab-ed014d323fcb',
          code: 'CNS',
          title: 'instrument',
          cols: 1,
          rows: 1,
          x: 0,
          y: 1,
          active: true,
          configuration: {
            type: 'Instrument',
            instruments: '579||2,579||23,713||2,452||3',
            hosts: '',
            title: 'cns-instrument2'
          },
          deleteDate: null
        }
      ],
      changes: [],
      deletedWidgets: [
        {
          id: '6a707b39-1c3e-4faf-9d9c-afa78648b463',
          title: 'HOST2',
          deleteDate: '2020-08-17T10:33:34.302+0000',
          code: 'CNS',
          cols: 1,
          rows: 1
        },
        {
          id: 'c2c43273-fc15-46e1-a498-052ceb5ff99c',
          title: 'INSTRUMENT',
          deleteDate: '2020-09-02T13:20:30.166+0000',
          code: 'CNS',
          cols: 1,
          rows: 1
        },
        {
          id: '244b20e9-9643-4248-b91b-a3f82d44396a',
          title: 'Copy_INSTRUMENT',
          deleteDate: '2020-09-02T13:20:27.725+0000',
          code: 'CNS',
          cols: 1,
          rows: 1
        }
      ]
    },
    resetdashboard: { resetTime: '12:43' },
    dashboard: [
      {
        dashboardId: '35cb7328-5920-4184-8cab-ed014d323fcb',
        tenantId: 'leonidas',
        title: 'EVENTS',
        creationDate: '2020-07-24T11:46:29.740Z'
      }
    ],
    kpis: [
      {
        id: { tenantId: 'leonidas', widgetId: 'f72b9ae8-8f4f-4e6d-976f-59f2c8214032' },
        values: {
          cmPayload: `[
                {"id":"579||2","name":"Instrument 1","time":"2020-06-16T17:03:12Z","status":"1"},
                {"id":"579||23","name":"Instrument 2","time":"2020-06-16T17:03:12Z","status":"1"},
                {"id":"713||2","name":"Instrument 3","time":"2020-06-16T17:03:12Z","status":"1"},
                {"id":"452||3","name":"Instrument 4","status":"1"}
               ]`
        },
        time: 1591093028.161
      },
      {
        id: { tenantId: 'leonidas', widgetId: 'fc94e317-c329-4bd0-b7ae-553ea0b61923' },
        values: {
          cmPayload: cmPayloadWidgetCNS2
        },
        time: 1591093028.161
      },
      {
        id: { tenantId: 'leonidas', widgetId: '802bd675-179e-451e-9305-ec75080f1e99' },
        values: {
          cmPayload: `[
            {"id":"452||1","name":"Instrument 1","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"452||2","name":"Instrument 2","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"452||3","name":"Instrument 3","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"452||4","name":"Instrument 4","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"452||5","name":"Instrument 5","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"452||6","name":"Instrument 6","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"452||7","name":"Instrument 7","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"452||8","name":"Instrument 8","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"452||9","name":"Instrument 9","time":"2020-08-26T17:03:12Z","status":"0"},
            {"id":"452||10","name":"Instrument 10","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"452||11","name":"Instrument 11","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"452||12","name":"Instrument 12","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"452||13","name":"Instrument 13","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"452||14","name":"Instrument 14","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"452||15","name":"Instrument 15","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"572||1","name":"Instrument 16","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"572||2","name":"Instrument 17","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"572||3","name":"Instrument 18","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||1","name":"Instrument 19","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||2","name":"Instrument 20","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||3","name":"Instrument 21","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||4","name":"Instrument 22","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||5","name":"Instrument 23","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||6","name":"Instrument 24","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||7","name":"Instrument 25","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||8","name":"Instrument 26","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||9","name":"Instrument 27","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||10","name":"Instrument 28","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||11","name":"Instrument 29","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||12","name":"Instrument 30","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||13","name":"Instrument 31","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"579||14","name":"Instrument 32","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"636||1","name":"Instrument  33","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"636||2","name":"Instrument  34","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"636||3","name":"Instrument  34","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"636||4","name":"Instrument  36","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"636||5","name":"Instrument  37","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||1","name":"Instrument 38","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||2","name":"Instrument 39","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||3","name":"Instrument 40","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||4","name":"Instrument 41","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||5","name":"Instrument 42","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||6","name":"Instrument 43","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||7","name":"Instrument 44","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||8","name":"Instrument 45","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||9","name":"Instrument 46","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"713||10","name":"Instrument 47","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"715||1","name":"Instrument 48","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"715||2","name":"Instrument 49","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"715||3","name":"Instrument 50","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"715||4","name":"Instrument 51","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"715||5","name":"Instrument 52","time":"2020-08-16T17:03:12Z","status":"0"},
            {"id":"715||6","name":"Instrument 53","time":"2020-08-16T17:03:12Z","status":"3"},
            {"id":"715||7","name":"Instrument 54","time":"2020-08-16T17:03:12Z","status":"3"}
               ]`
        },
        time: 1591093028.161
      },
      {
        id: '4c72efb7-1184-4354-a308-df1072863f66',
        eventType: 'DashboardResetEvent',
        eventTime: 1599600203.018,
        tenantId: 'leonidas',
        dashboardId: '35cb7328-5920-4184-8cab-ed014d323fcb',
        attempts: 1,
        totalAttempts: 3,
        failedWidgets: []
      },
      {
        id: '36f0b2b8-d104-4c8a-b69f-5286d8900aab',
        eventType: 'DashboardResetRetried',
        eventTime: 1600343222.231,
        tenantId: 'leonidas',
        attempts: 1,
        totalAttempts: 3,
        dashboardId: '35cb7328-5920-4184-8cab-ed014d323fcb',
        failedWidgets: [
          'c0106ba6-6ea8-4270-bdbf-e4950cfdb263',
          'ccc24f73-01c4-4a69-84e9-e837e4d7ce34',
          '70d91a36-e9e6-44ac-8462-76c33041544c'
        ]
      },
      {
        id: '9a4aab8f-f1b3-4401-b846-facc8b2bd451',
        eventType: 'DashboardResetFailed',
        eventTime: 1600359960.055,
        tenantId: 'leonidas',
        attempts: 3,
        totalAttempts: 3,
        dashboardId: '35cb7328-5920-4184-8cab-ed014d323fcb',
        failedWidgets: [
          'c0106ba6-6ea8-4270-bdbf-e4950cfdb263',
          'ccc24f73-01c4-4a69-84e9-e837e4d7ce34',
          '70d91a36-e9e6-44ac-8462-76c33041544c'
        ]
      },
      {
        id: { tenantId: 'leonidas', widgetId: '25ac1cdb-12bd-462a-a265-057736604dfa' },
        values: {
          errorsCounter: '8',
          lstItems: `[
                {"instrumentId":"452||1","sampleId":"32","orderId":"0032","time":1209238,"status":"ALERT"},
                {"instrumentId":"452||2","sampleId":"28","orderId":"0028","time":1209238,"status":"ALERT"},
                {"instrumentId":"452||3","sampleId":"41","orderId":"0041","time":1209238,"status":"WARNING"},
                {"instrumentId":"452||4","sampleId":"33","orderId":"0033","time":1209168,"status":"WARNING"},
                {"instrumentId":"452||5","sampleId":"29","orderId":"0029","time":1209279,"status":"ALERT"},
                {"instrumentId":"452||6","sampleId":"31","orderId":"0031","time":1209252,"status":"WARNING"}
                ]`,
          samplesExceededCounter: '4',
          warningsCounter: '2'
        },
        time: 1591965805.911
      },
      {
        id: { tenantId: 'leonidas', widgetId: 'b836c1dc-2958-4c5f-90fa-e8bb28766d05' },
        values: {
          pendingCount: '6',
          processingCount: '1',
          pendingMedValCount: '2',
          completedCount: '5',
          pendingResultsCount: '0',
          pendingTecValCount: '0'
        },
        time: 1593443043.441
      },
      {
        id: { tenantId: 'leonidas', widgetId: '313608e5-cca3-4a77-9dc6-d8f93bd1add0' },
        values: {
          tatValue: 'null'
        },
        time: 1599596914.208
      },
      {
        id: { tenantId: 'leonidas', widgetId: '29ab75a5-600b-419b-a2c2-3f0b9b6518f2' },
        values: {
          tatValue: 181
        },
        time: '2020-10-07T11:50:54.086Z'
      }
    ],
    hostconnections: hostConnectionsArray,
    parents: [{ groupId: 'SG.1', testGroupName: 'Internal lab.' }],
    organisations: [
      {
        id: {
          tenantId: 'leonidas',
          organisationId: '2',
          organisationCode: '2'
        },
        organisationDescription: 'Origin2'
      },
      {
        id: {
          tenantId: 'leonidas',
          organisationId: '3',
          organisationCode: '3'
        },
        organisationDescription: 'Origin3'
      },
      {
        id: {
          tenantId: 'leonidas',
          organisationId: '4',
          organisationCode: '4'
        },
        organisationDescription: 'Origin4'
      }
    ],
    testinstruments: [
      {
        tenantId: 'leonidas',
        testId: '1',
        code: '1',
        name: 'Test 1'
      }
    ],
    instruments: [
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||1'
        },
        instrumentName: 'C6000 Haven',
        instrumentModel: 'Cobas C6000',
        instrumentType: 'INSTRUMENT',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||2'
        },
        instrumentName: 'C6000 Daniel',
        instrumentModel: 'Cobas C6000',
        instrumentType: 'INSTRUMENT',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||3'
        },
        instrumentName: 'C6000 Sophia',
        instrumentModel: 'Cobas C6000',
        instrumentType: 'INSTRUMENT',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||4'
        },
        instrumentName: 'Instrument 17',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||5'
        },
        instrumentName: 'Instrument 27',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||6'
        },
        instrumentName: 'Instrument 27',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||7'
        },
        instrumentName: 'Instrument 14',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||8'
        },
        instrumentName: 'Instrument 20',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||9'
        },
        instrumentName: 'Instrument 24',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||10'
        },
        instrumentName: 'Instrument 10',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||11'
        },
        instrumentName: 'Instrument 10',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||12'
        },
        instrumentName: 'Instrument 10',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||13'
        },
        instrumentName: 'Instrument 10',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '452||14'
        },
        instrumentName: 'Instrument 10',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '452||15' },
        instrumentName: 'Instrument 44',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '572||1'
        },
        instrumentName: 'c8000-2',
        instrumentModel: 'Cobas C8000',
        instrumentType: 'INSTRUMENT',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '572||2'
        },
        instrumentName: 'c8000-1',
        instrumentModel: 'Cobas C8000',
        instrumentType: 'INSTRUMENT',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '572||3'
        },
        instrumentName: 'c8000-1',
        instrumentModel: 'Cobas C8000',
        instrumentType: 'INSTRUMENT',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '579||1'
        },
        instrumentName: 'Instrument 11',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '579||2'
        },
        instrumentName: 'p612',
        instrumentModel: 'RSA Dynamic Interface',
        instrumentType: 'PRE-ANALYTIC',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '579||3'
        },
        instrumentName: 'p471',
        instrumentModel: 'RSA Dynamic Interface',
        instrumentType: 'PRE-ANALYTIC',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||4' },
        instrumentName: 'Instrument 15',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||5' },
        instrumentName: 'Instrument 15',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||6' },
        instrumentName: 'Instrument 18',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||7' },
        instrumentName: 'Instrument 18',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||8' },
        instrumentName: 'Instrument 25',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||9' },
        instrumentName: 'Instrument 18',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||10' },
        instrumentName: 'Instrument 18',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||11' },
        instrumentName: 'Instrument 25',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||12' },
        instrumentName: 'Instrument 18',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||13' },
        instrumentName: 'Instrument 25',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '579||14' },
        instrumentName: 'Instrument 21',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '636||1'
        },
        instrumentName: 'COBAS P701',
        instrumentModel: 'Cobas P 501-701',
        instrumentType: 'POST-ANALYTIC',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '636||2'
        },
        instrumentName: 'COBAS P701',
        instrumentModel: 'Cobas P 501-701',
        instrumentType: 'POST-ANALYTIC',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '636||3'
        },
        instrumentName: 'COBAS P701',
        instrumentModel: 'Cobas P 501-701',
        instrumentType: 'POST-ANALYTIC',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '636||4'
        },
        instrumentName: 'COBAS P701',
        instrumentModel: 'Cobas P 501-701',
        instrumentType: 'POST-ANALYTIC',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '636||5'
        },
        instrumentName: 'COBAS P701',
        instrumentModel: 'Cobas P 501-701',
        instrumentType: 'POST-ANALYTIC',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '713||1'
        },
        instrumentName: 'NOT WORKING - C8100 TT',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '713||2'
        },
        instrumentName: 'C8100',
        instrumentModel: 'cobas 8100',
        instrumentType: 'PRE-ANALYTIC',
        instrumentStatus: true
      },
      {
        id: {
          tenantId: 'leonidas',
          instrumentId: '713||3'
        },
        instrumentName: 'cobas 8100-3',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '713||4' },
        instrumentName: 'Instrument 16',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '713||5' },
        instrumentName: 'Instrument 40',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '713||6' },
        instrumentName: 'Instrument 13',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '713||7' },
        instrumentName: 'Instrument 19',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '713||8' },
        instrumentName: 'Instrument 29',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '713||9' },
        instrumentName: 'Instrument 23',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '713||10' },
        instrumentName: 'Instrument 26',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||1' },
        instrumentName: 'Instrument 33',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||2' },
        instrumentName: 'Instrument 43',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||3' },
        instrumentName: 'Instrument 33',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||4' },
        instrumentName: 'Instrument 43',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||5' },
        instrumentName: 'Instrument 33',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||6' },
        instrumentName: 'Instrument 43',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||7' },
        instrumentName: 'Instrument 33',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||88' },
        instrumentName: 'Instrument 43',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||9' },
        instrumentName: 'Instrument 33',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      },
      {
        id: { tenantId: 'leonidas', instrumentId: '715||10' },
        instrumentName: 'Instrument 43',
        instrumentModel: 'cobas 8100',
        instrumentType: 'UNKNOWN',
        instrumentStatus: true
      }
    ]
  };
  return data;
};
