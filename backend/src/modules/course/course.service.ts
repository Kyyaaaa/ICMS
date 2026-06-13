import { CourseRepository } from './course.repository';

export class CourseService {
    static async createCourse(data: any) {
        const { modules, ...courseData } = data;
        
        // Kiểm tra tính hợp lệ cơ bản của dữ liệu đầu vào
        if (!courseData.title || !courseData.band) {
            throw new Error('Title and band are required fields.');
        }

        return await CourseRepository.createCourse(courseData, modules);
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
        const success = await CourseRepository.deleteCourse(id);
        if (!success) throw new Error('Course not found or could not be deleted.');
        return success;
    }

    static async updateCourse(id: string, courseData: any) {
        if (!id) throw new Error('Course ID is required.');
        const { modules, ...data } = courseData;
        const updatedCourse = await CourseRepository.updateCourse(id, data, modules);
        return updatedCourse;
    }
}
