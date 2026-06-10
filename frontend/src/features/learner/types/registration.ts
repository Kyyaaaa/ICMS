export interface RegistrationClassOption {
    id: number;
    name: string;
    availableSeats: number;
    schedule: string;
    time: string;
    room: string;
    sessions: number;
}

export interface RegistrationInvoicePreview {
    courseFee: number;
    discount: number;
    totalDue: number;
}
