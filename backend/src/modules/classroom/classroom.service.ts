import { ClassroomRepository, CreateClassroomDTO, UpdateClassroomDTO, MaintenanceDTO } from './classroom.repository';

// Helper to map DB format to Frontend format
const mapToRoom = (classroom: any, maintenance?: any) => {
    // Map status from UPPERCASE to Title Case
    const statusMap: Record<string, string> = {
        'AVAILABLE': 'Available',
        'OCCUPIED': 'Occupied',
        'MAINTENANCE': 'Maintenance'
    };

    const room: any = {
        id: classroom.id,
        name: classroom.room_name,
        capacity: classroom.capacity,
        status: statusMap[classroom.status] || classroom.status
    };

    if (classroom.status === 'MAINTENANCE' && maintenance) {
        room.maintenanceSchedule = {
            date: maintenance.maintenance_date,
            startTime: maintenance.start_time,
            endTime: maintenance.end_time,
            note: maintenance.note
        };
    }

    return room;
};

// Helper to map Frontend format to DB format
const mapToDB = (data: any): { classData: any, maintData?: MaintenanceDTO } => {
    // Map status to UPPERCASE
    const status = data.status ? data.status.toUpperCase() : undefined;
    
    const classData: any = {};
    if (data.name) classData.room_name = data.name;
    if (data.capacity !== undefined) classData.capacity = data.capacity;
    if (status) classData.status = status;

    let maintData: MaintenanceDTO | undefined = undefined;
    if (status === 'MAINTENANCE' && data.maintenanceSchedule) {
        maintData = {
            maintenance_date: data.maintenanceSchedule.date,
            start_time: data.maintenanceSchedule.startTime,
            end_time: data.maintenanceSchedule.endTime,
            note: data.maintenanceSchedule.note
        };
    }

    return { classData, maintData };
};

export const ClassroomService = {
  async getAllClassrooms() {
    const { classrooms, maintenance } = await ClassroomRepository.findAll();
    
    return classrooms.map((room: any) => {
        const roomMaintenance = maintenance.find((m: any) => m.classroom_id === room.id);
        return mapToRoom(room, roomMaintenance);
    });
  },

  async getClassroomById(id: string) {
    const { classroom, maintenance } = await ClassroomRepository.findById(id);
    return mapToRoom(classroom, maintenance);
  },

  async createClassroom(data: any) {
    const { classData, maintData } = mapToDB(data);
    
    if (!classData.room_name || !classData.capacity || !classData.status) {
        throw new Error('Missing required fields');
    }

    const { classroom, maintenance } = await ClassroomRepository.create(classData as CreateClassroomDTO, maintData);
    return mapToRoom(classroom, maintenance);
  },

  async updateClassroom(id: string, data: any) {
    const { classData, maintData } = mapToDB(data);
    const { classroom, maintenance } = await ClassroomRepository.update(id, classData as UpdateClassroomDTO, maintData);
    return mapToRoom(classroom, maintenance);
  },

  async deleteClassroom(id: string) {
    return ClassroomRepository.delete(id);
  }
};
