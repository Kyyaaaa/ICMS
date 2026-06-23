import { Request, Response } from 'express';
import { ClassroomService } from './classroom.service';

export const ClassroomController = {
  async getAll(req: Request, res: Response) {
    try {
      const classrooms = await ClassroomService.getAllClassrooms();
      res.json(classrooms);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const classroom = await ClassroomService.getClassroomById(req.params.id as string);
      res.json(classroom);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async create(req: Request, res: Response) {
    try {
      const newClassroom = await ClassroomService.createClassroom(req.body);
      res.status(201).json(newClassroom);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const updatedClassroom = await ClassroomService.updateClassroom(req.params.id as string, req.body);
      res.json(updatedClassroom);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      await ClassroomService.deleteClassroom(req.params.id as string);

      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
};
