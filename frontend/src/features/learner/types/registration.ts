export interface RegistrationClassOption {
    id: string;
    name: string;
    availableSeats: number;
    schedule: string;
    time: string;
    room: string;
    sessions: number;
    sessionList?: {
        id?: string;
        session_number?: number;
        date?: string;
        slot?: string;
    }[];
}

export interface RegistrationInvoicePreview {
    courseFee: number;
    discount: number;
    totalDue: number;
}
