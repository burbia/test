export class KPIValue {
    id: {
        tenantId: string;
        widgetId: string;
    };
    values: { [key: string]: string; };
}
