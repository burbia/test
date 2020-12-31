export class TATResult {
    id: TATResultId;
    name: string;
    averageTat: number;
    percentage: number;
    timeExceededStatus: string;
    alarmStatus: string;
}

class TATResultId {
    tenantId: string;
    widgetId: string;
}
