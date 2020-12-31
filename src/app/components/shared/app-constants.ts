export const ANY_ITEM: string = 'any';

export const HOURS_IN_DAY: number = 24;
export const MINUTES_IN_HOUR: number = 60;
export const MINUTES_IN_DAY: number = HOURS_IN_DAY * MINUTES_IN_HOUR;
export const SECONDS_IN_MINUTE: number = 60;
export const SECONDS_IN_HOUR: number = 3600;
export const SECONDS_IN_DAY: number = SECONDS_IN_HOUR * HOURS_IN_DAY;
export const MILLISECONDS_IN_SECOND: number = 1000;
export const MILLISECONDS_IN_MINUTE = SECONDS_IN_MINUTE * MILLISECONDS_IN_SECOND;
export const MILLISECONDS_IN_DAY = HOURS_IN_DAY * SECONDS_IN_HOUR * MILLISECONDS_IN_SECOND;

export enum OrderEnum {
  ASC = 'asc',
  DESC = 'desc'
}

export enum WidgetCodes {
  TAT = 'TAT',
  LST = 'LST',
  LAY = 'LAY',
  CNS = 'CNS',
  SWL = 'SWL'
}

export enum WidgetSubCodes {
  CNS_HOST = 'CNS_HOST',
  CNS_INSTRUMENT = 'CNS_INSTRUMENT'
}

export enum InstrumentTypes {
  Analytic = 'INSTRUMENT',
  PostAnalytic = 'POST-ANALYTIC',
  PreAnalytic = 'PRE-ANALYTIC',
  Unknown = 'UNKNOWN',
  All = 'ALL',
  Manual = 'MANUAL'
}

export enum WidgetTypes {
  Test = 'Test',
  Instrument = 'Instrument',
  Host = 'Host',
  Sample = 'Sample',
  Validation = 'Validation'
}

export enum EventCodes {
  FirstSampleSeen = 'FSS',
  SecondSampleSeen = 'SSS',
  SampleSeen = 'SS',
  SampleNotSeen = 'SNS',
  SampleSeenAnalyticOrUndefined = 'SSAU',
  OrderRegistered = 'O0001',
  SampleSeenManually = 'S0001',
  SampleSeenPreAnalytic = 'S0002',
  SampleSeenAnalytic = 'S0003',
  SampleSeenPostAnalytic = 'S0004',
  SampleSeenOnUnknown = 'S0005',
  SampleSortedManual = 'S0006',
  SampleSortedInstrument = 'S0007',
  InstructionsSentAnalyzer = 'S0008',
  TestResultProduced = 'T0001',
  TestResultReceived = 'T0002',
  TestResultUpdated = 'T0003',
  TestResultValidatedTechnically = 'T0004',
  TestResultValidatedMedically = 'T0005',
  ResultSentToHost = 'T0006',
  TestRequestRegistered = 'T0007',
  TestResultCalculated = 'T0008',
  TestRerun = 'T0009',
  TestAssigned = 'T0011',
  TestResults = 'TT'
}

export enum WidgetStatus {
  ERROR = 'ERROR',
  ALERT = 'ALERT',
  WARNING = 'WARNING',
  OK = 'OK'
}

export enum KeyCodes {
  PLUS = 43,
  COMMA = 44,
  MINUS = 45,
  DOT = 46,
  E = 101
}

export enum ScreenCodes {
  DashboardManagement = 'DAMA',
  LSTConfiguration = 'LSTCO',
  TATConfiguration = 'TATCO',
  CSConfiguration = 'COSCO',
  SWLConfiguration = 'SWLCO',
  Dashboard = 'DASH'
}

export enum StatusCNS {
  Waiting = 'WAITING',
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED'
}

export enum Status {
  Waiting = '3',
  Connected = '1',
  Disconnected = '0'
}

export enum EventType {
  KPI = 'KPI',
  DASHBOARD_RESET = 'DASHBOARD_RESET'
}

export const localStorageDashboardEventIdArrayVarName:string = "cipm.dashboard.dashboardEventIdProcessed";
