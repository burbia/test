export class CmHost {
  hostConnectionId: Id;
  connectionName: string;
  hostName: string;
  status: string;
  time: Date;
}

class Id {
  tenantId: string;
  id: string;
}

export class CmHostEvent {
  id: string;
  name: string;
  connectionName: string;
  status: string;
  time: Date;
  alarmOn?: boolean;
}
