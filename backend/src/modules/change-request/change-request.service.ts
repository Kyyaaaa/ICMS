import { ChangeRequestRepository } from './change-request.repository';
import { CreateChangeRequestDTO, UpdateChangeRequestStatusDTO } from './change-request.model';

export class ChangeRequestService {
    private changeRequestRepository: ChangeRequestRepository;

    constructor() {
        this.changeRequestRepository = new ChangeRequestRepository();
    }

    async getAll() {
        return await this.changeRequestRepository.findAll();
    }

    async getByTutorId(tutorId: string) {
        return await this.changeRequestRepository.findByTutorId(tutorId);
    }

    async create(data: CreateChangeRequestDTO) {
        return await this.changeRequestRepository.create(data);
    }

    async updateStatus(id: string, updateData: UpdateChangeRequestStatusDTO) {
        return await this.changeRequestRepository.updateStatus(id, updateData);
    }
}
