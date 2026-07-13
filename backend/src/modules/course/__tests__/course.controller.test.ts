import request from 'supertest';
import app from '../../../app';
import { CourseService } from '../course.service';
import { CourseController } from '../course.controller';

// Mock the CourseService
jest.mock('../course.service');

// Mock auth middlewares to bypass authentication for tests
jest.mock('../../../middlewares/auth.middleware', () => ({
  verifyToken: jest.fn((_req: any, _res: any, next: any) => next()),
  requireRole: jest.fn(() => (_req: any, _res: any, next: any) => next()),
  optionalVerifyToken: jest.fn((_req: any, _res: any, next: any) => next())
}));

describe('CourseController API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/courses', () => {
    it('should return 200 and a list of courses with onlyActive: true for public/non-admin user', async () => {
      const mockCourses = [
        { id: '1', name: 'Course 1', price: 100, status: 'Active' },
        { id: '2', name: 'Course 2', price: 200, status: 'Active' }
      ];
      (CourseService.getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

      const response = await request(app).get('/api/courses');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCourses);
      expect(CourseService.getAllCourses).toHaveBeenCalledWith({ onlyActive: true });
    });

    it('should call CourseService.getAllCourses with onlyActive: false when user role is ADMIN', async () => {
      const mockCourses = [
        { id: '1', name: 'Course 1', price: 100, status: 'Active' },
        { id: '2', name: 'Course 2', price: 200, status: 'Draft' }
      ];
      (CourseService.getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

      const reqMock: any = {
        user: { role: 'ADMIN' }
      };
      const resMock: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CourseController.getAllCourses(reqMock, resMock);

      expect(CourseService.getAllCourses).toHaveBeenCalledWith({ onlyActive: false });
      expect(resMock.status).toHaveBeenCalledWith(200);
      expect(resMock.json).toHaveBeenCalledWith({
        success: true,
        data: mockCourses
      });
    });

    it('should call CourseService.getAllCourses with onlyActive: true when user role is STAFF or TUTOR (not ADMIN)', async () => {
      const mockCourses = [
        { id: '1', name: 'Course 1', price: 100, status: 'Active' }
      ];
      (CourseService.getAllCourses as jest.Mock).mockResolvedValue(mockCourses);

      const reqMock: any = {
        user: { role: 'STAFF' }
      };
      const resMock: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CourseController.getAllCourses(reqMock, resMock);

      expect(CourseService.getAllCourses).toHaveBeenCalledWith({ onlyActive: true });
    });

    it('should return 500 if service throws an error', async () => {
      (CourseService.getAllCourses as jest.Mock).mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/courses');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Failed to fetch courses');
    });
  });

  describe('GET /api/courses/:id', () => {
    it('should return 200 and course data with onlyActive: true for public/non-admin user', async () => {
      const mockCourse = { id: '1', name: 'Course 1', price: 100, status: 'Active' };
      (CourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const response = await request(app).get('/api/courses/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockCourse);
      expect(CourseService.getCourseById).toHaveBeenCalledWith('1', { onlyActive: true });
    });

    it('should call CourseService.getCourseById with onlyActive: false when user role is ADMIN', async () => {
      const mockCourse = { id: '1', name: 'Course 1', price: 100, status: 'Draft' };
      (CourseService.getCourseById as jest.Mock).mockResolvedValue(mockCourse);

      const reqMock: any = {
        params: { id: '1' },
        user: { role: 'ADMIN' }
      };
      const resMock: any = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await CourseController.getCourseById(reqMock, resMock);

      expect(CourseService.getCourseById).toHaveBeenCalledWith('1', { onlyActive: false });
      expect(resMock.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if course not found', async () => {
      (CourseService.getCourseById as jest.Mock).mockRejectedValue(new Error('Course not found'));

      const response = await request(app).get('/api/courses/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Course not found');
    });
  });

  describe('POST /api/courses', () => {
    it('should return 201 when course is successfully created', async () => {
      const newCourseData = { name: 'New Course', price: 150 };
      const createdCourse = { id: '3', ...newCourseData };
      (CourseService.createCourse as jest.Mock).mockResolvedValue(createdCourse);

      const response = await request(app)
        .post('/api/courses')
        .send(newCourseData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Course created successfully');
      expect(response.body.data).toEqual(createdCourse);
      expect(CourseService.createCourse).toHaveBeenCalledWith(newCourseData);
    });

    it('should return 400 if creation fails', async () => {
      (CourseService.createCourse as jest.Mock).mockRejectedValue(new Error('Invalid data'));

      const response = await request(app)
        .post('/api/courses')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid data');
    });
  });

  describe('PUT /api/courses/:id', () => {
    it('should return 200 when course is updated successfully', async () => {
      const updateData = { price: 250 };
      const updatedCourse = { id: '1', name: 'Course 1', price: 250 };
      (CourseService.updateCourse as jest.Mock).mockResolvedValue(updatedCourse);

      const response = await request(app)
        .put('/api/courses/1')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Course updated successfully');
      expect(response.body.data).toEqual(updatedCourse);
      expect(CourseService.updateCourse).toHaveBeenCalledWith('1', updateData);
    });

    it('should return 500 if update fails', async () => {
      (CourseService.updateCourse as jest.Mock).mockRejectedValue(new Error('Update failed'));

      const response = await request(app)
        .put('/api/courses/1')
        .send({ price: 250 });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Update failed');
    });
  });

  describe('DELETE /api/courses/:id', () => {
    it('should return 200 when course is deleted successfully', async () => {
      (CourseService.deleteCourse as jest.Mock).mockResolvedValue(true);

      const response = await request(app).delete('/api/courses/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Course deleted successfully');
      expect(CourseService.deleteCourse).toHaveBeenCalledWith('1');
    });

    it('should return 500 if deletion fails', async () => {
      (CourseService.deleteCourse as jest.Mock).mockRejectedValue(new Error('Delete failed'));

      const response = await request(app).delete('/api/courses/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Delete failed');
    });
  });
});
