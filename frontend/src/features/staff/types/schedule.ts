import type { Session } from './class';

export interface ScheduleSession {
    id: number;
    class: string;
    tutor: string;
    room: string;
    dayIndex: number;
    startTime: string;
    endTime: string;
    color: string;
    rawSession?: Session;
}
