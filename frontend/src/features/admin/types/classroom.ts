export interface MaintenanceSchedule {
    date: string;
    startTime: string;
    endTime: string;
    note: string;
}

export interface Room {
    id: string;
    name: string;
    capacity: number;
    status: 'Available' | 'Maintenance' | 'Occupied';
    maintenanceSchedule?: MaintenanceSchedule;
}
