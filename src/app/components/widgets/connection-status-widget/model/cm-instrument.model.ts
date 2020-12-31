export class CmInstrument {
  instrumentId: string;
  instrumentName: string;
  status: string;
  time: Date;
}

export class CmInstrumentEvent {
  id: string;
  name: string;
  status: string;
  time: Date;
  alarmOn?: boolean;
}
