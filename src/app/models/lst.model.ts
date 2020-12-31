export class LstResult {
    id: LstResultId;
    lstItems: Array<LstResultItem>;
}

class LstResultId {
    tenantId: string;
    widgetId: string;
}

export class LstResultItem {
    instrumentId: string;
    instrumentName?: string;
    sampleId: string;
    time: number;
    status: string;
    alarmOn?: boolean;
}
