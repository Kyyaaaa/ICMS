import { Request, Response } from 'express';
import { CourseService } from './course.service';

export class CourseController {
    static async createCourse(req: Request, res: Response) {
        try {
            const newCourse = await CourseService.createCourse(req.body);
            res.status(201).json({
                success: true,
                message: 'Course created successfully',
                data: newCourse
            });
        } catch (error: any) {
            console.error('Create course error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create course'
            });
        }
    }

    static async getAllCourses(_req: Request, res: Response) {
        try {
            const courses = await CourseService.getAllCourses();
            res.status(200).json({
                success: true,
                data: courses
            });
        } catch (error: any) {
            console.error('Get courses error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch courses'
            });
        }
    }

    static async getCourseById(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const course = await CourseService.getCourseById(id);
            res.status(200).json({
                success: true,
                data: course
            });
        } catch (error: any) {
            console.error('Get course by id error:', error);
            res.status(404).json({
                success: false,
                message: error.message || 'Failed to fetch course'
            });
        }
    }

    static async deleteCourse(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            await CourseService.deleteCourse(id);
            res.status(200).json({
                success: true,
                message: 'Course deleted successfully'
            });
        } catch (error: any) {
            console.error('Error deleting course:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal Server Error'
            });
        }
    }

    static async updateCourse(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const courseData = req.body;
            const updatedCourse = await CourseService.updateCourse(id, courseData);
            res.status(200).json({
                success: true,
                message: 'Course updated successfully',
                data: updatedCourse
            });
        } catch (error: any) {
            console.error('Error updating course:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Internal Server Error'
            });
        }
    }
}
