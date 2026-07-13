export interface Classroom {
  id: string;
  room_name: string;
  capacity: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE';
  created_at?: string;
  updated_at?: string;
}

export interface ClassroomMaintenance {
  id: string;
  classroom_id: string;
  maintenance_date: string;
  start_time: string;
  end_time: string;
  note: string;
  created_at?: string;
}

export interface CreateClassroomDTO {
  room_name: string;
  capacity: number;
  status: string;
}

export interface UpdateClassroomDTO {
  room_name?: string;
  capacity?: number;
  status?: string;
}

export interface MaintenanceDTO {
  maintenance_date: string;
  start_time: string;
  end_time: string;
  note: string;
}
