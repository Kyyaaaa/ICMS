import { CourseRepository } from './course.repository';

import { ClassService } from '../class/class.service';
import { EnrollmentService } from '../enrollment/enrollment.service';

export class CourseService {
  static async createCourse(data: any) {
    const { sessions_list, ...courseData } = data;
    
    // Kiểm tra tính hợp lệ cơ bản của dữ liệu đầu vào
    if (!courseData.title || !courseData.band) {
        throw new Error('Title and band are required fields.');
    }

    return await CourseRepository.createCourse(courseData, sessions_list);
  }

  static async getAllCourses() {
    return await CourseRepository.getAllCourses();
  }

  static async getCourseById(id: string) {
    if (!id) throw new Error('Course ID is required.');
    const course = await CourseRepository.getCourseById(id);
    if (!course) throw new Error('Course not found.');
    return course;
  }

  static async deleteCourse(id: string) {
    if (!id) throw new Error('Course ID is required.');
    
    // Check if there are any enrollments via EnrollmentService
    const enrollmentCount = await EnrollmentService.countEnrollmentsByCourseId(id);
    if (enrollmentCount > 0) {
        throw new Error('Cannot delete this course because it has enrolled students.');
    }

    // Delete classes via ClassService
    await ClassService.deleteClassesByCourseId(id);

    try {
        const success = await CourseRepository.deleteCourse(id);
        if (!success) throw new Error('Course not found or could not be deleted.');
        return success;
    } catch (error: any) {
        if (error.code === '23503') {
            throw new Error('Cannot delete this course because it has associated records.');
        }
        throw error;
    }
  }

    static async updateCourse(id: string, courseData: any) {
        if (!id) throw new Error('Course ID is required.');
        
        const existingCourse = await CourseRepository.getCourseById(id);
        if (!existingCourse) throw new Error('Course not found.');

        if (existingCourse.next_cohort) {
            let startDate: Date;
            if (existingCourse.next_cohort.includes('/')) {
                const [day, month, year] = existingCourse.next_cohort.split('/');
                startDate = new Date(Number(year), Number(month) - 1, Number(day));
            } else {
                startDate = new Date(existingCourse.next_cohort);
            }

            const now = new Date();
            now.setHours(0, 0, 0, 0);
            
            if (!isNaN(startDate.getTime()) && startDate <= now) {
                throw new Error('Cannot update course after it has started.');
            }
        }

        const { sessions_list, ...data } = courseData;
        const updatedCourse = await CourseRepository.updateCourse(id, data, sessions_list);
        return updatedCourse;
    }
}
