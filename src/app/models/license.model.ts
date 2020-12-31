export enum DemoStatusEnum {
  NO_DEMO = 'NO_DEMO',
  DEMO_ADVISE = 'DEMO_ADVISE',
  DEMO_WARNING = 'DEMO_WARNING',
  DEMO_END = 'DEMO_END'
}

export enum LicenseStatusEnum {
  LICENSED = 'LICENSED',
  LICENSE_EXPIRED = 'LICENSE_EXPIRED',
  NOT_LICENSED = 'NOT_LICENSED',
  DEMO_PERIOD = 'DEMO_PERIOD',
  EXPIRED_DEMO_PERIOD = 'EXPIRED_DEMO_PERIOD'
}

export interface LicenseView {
  isLicense: boolean;
  demoStatus: DemoStatusEnum;
  daysLeft: number;
}

export class License {
  status: LicenseStatusEnum;
  validationResult: string;
  dueDate: Date;
}
