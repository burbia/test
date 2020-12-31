export class Instrument {
    id: Id;
    instrumentName: string;
    instrumentModel: string;
    instrumentType: string;
    status: boolean;
    selected?: boolean;
}

class Id {
    instrumentId: string;
    tenantId: string;
}
