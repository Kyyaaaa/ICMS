import pool from '../../configs/database';

export class CourseRepository {
    static async createCourse(courseData: any, sessionsList: any[] = []) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Tự động sinh mã Course Code (tiền tố CSR + số tăng dần)
            if (!courseData.code) {
                const maxCodeQuery = `SELECT code FROM courses WHERE code LIKE 'CSR%' ORDER BY LENGTH(code) DESC, code DESC LIMIT 1;`;
                const maxCodeRes = await client.query(maxCodeQuery);
                let nextNumber = 1;
                if (maxCodeRes.rows.length > 0) {
                    const currentMaxCode = maxCodeRes.rows[0].code;
                    const numPart = currentMaxCode.replace('CSR', '');
                    const parsedNum = parseInt(numPart, 10);
                    if (!isNaN(parsedNum)) {
                        nextNumber = parsedNum + 1;
                    }
                }
                courseData.code = `CSR${nextNumber}`;
            }

            // Thêm khóa học mới vào bảng courses
            const insertCourseQuery = `
                INSERT INTO courses (
                    title, code, band, duration, sessions, format, category, type, price, original_price, description, next_cohort, image_url, status, max_size, location, language
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
                RETURNING *;
            `;
            const courseValues = [
                courseData.title,
                courseData.code,
                courseData.band,
                courseData.duration,
                courseData.sessions || 0,
                courseData.format,
                courseData.category,
                courseData.type,
                courseData.price || 0,
                courseData.original_price || 0,
                courseData.description,
                courseData.next_cohort,
                courseData.image_url,
                courseData.status || 'Draft',
                courseData.max_size || 15,
                courseData.location || 'London Center / Online',
                courseData.language || 'English'
            ];
            const courseRes = await client.query(insertCourseQuery, courseValues);
            const newCourse = courseRes.rows[0];

            // Thêm các sessions nếu có
            if (sessionsList && sessionsList.length > 0) {
                const insertSessionQuery = `
                    INSERT INTO course_sessions (course_id, session_number, title, description)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;
                `;
                const createdSessions = [];
                for (let i = 0; i < sessionsList.length; i++) {
                    const sess = sessionsList[i];
                    const sessValues = [
                        newCourse.id,
                        i + 1, // Auto generate session_number based on index
                        sess.title,
                        sess.description || ''
                    ];
                    const sessRes = await client.query(insertSessionQuery, sessValues);
                    createdSessions.push(sessRes.rows[0]);
                }
                newCourse.sessions_list = createdSessions;
            } else {
                newCourse.sessions_list = [];
            }

            await client.query('COMMIT');
            return newCourse;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async getAllCourses() {
        const query = `
            SELECT * FROM courses 
            ORDER BY created_at DESC;
        `;
        const res = await pool.query(query);
        return res.rows;
    }

    static async getCourseById(id: string) {
        const courseQuery = `SELECT * FROM courses WHERE id = $1;`;
        const courseRes = await pool.query(courseQuery, [id]);
        if (courseRes.rows.length === 0) return null;

        const course = courseRes.rows[0];

        const sessionsQuery = `SELECT * FROM course_sessions WHERE course_id = $1 ORDER BY session_number ASC;`;
        const sessionsRes = await pool.query(sessionsQuery, [id]);
        
        course.sessions_list = sessionsRes.rows;

        return course;
    }

    static async deleteCourse(id: string) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            // Check if there are any enrollments in any classes of this course
            const enrollmentsCheck = await client.query(`
                SELECT count(*) as count
                FROM enrollments e
                JOIN classes c ON e.class_id = c.id
                WHERE c.course_id = $1
            `, [id]);
            
            if (parseInt(enrollmentsCheck.rows[0].count) > 0) {
                throw new Error('Cannot delete this course because it has enrolled students.');
            }
            
            // It's safe to delete classes since there are no enrollments (this will also delete class_sessions via CASCADE)
            await client.query('DELETE FROM classes WHERE course_id = $1', [id]);
            
            // Delete the course
            const res = await client.query('DELETE FROM courses WHERE id = $1', [id]);
            
            await client.query('COMMIT');
            return res.rowCount && res.rowCount > 0;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async updateCourse(id: string, courseData: any, sessionsList: any[] = []) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const updateCourseQuery = `
                UPDATE courses SET
                    title = COALESCE($1, title),
                    code = COALESCE($2, code),
                    band = COALESCE($3, band),
                    duration = COALESCE($4, duration),
                    sessions = COALESCE($5, sessions),
                    format = COALESCE($6, format),
                    category = COALESCE($7, category),
                    type = COALESCE($8, type),
                    price = COALESCE($9, price),
                    original_price = COALESCE($10, original_price),
                    description = COALESCE($11, description),
                    next_cohort = COALESCE($12, next_cohort),
                    image_url = COALESCE($13, image_url),
                    status = COALESCE($14, status),
                    max_size = COALESCE($15, max_size),
                    location = COALESCE($16, location),
                    language = COALESCE($17, language),
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $18
                RETURNING *;
            `;
            const courseValues = [
                courseData.title,
                courseData.code,
                courseData.band,
                courseData.duration,
                courseData.sessions,
                courseData.format,
                courseData.category,
                courseData.type,
                courseData.price,
                courseData.original_price,
                courseData.description,
                courseData.next_cohort,
                courseData.image_url,
                courseData.status,
                courseData.max_size,
                courseData.location,
                courseData.language,
                id
            ];
            const courseRes = await client.query(updateCourseQuery, courseValues);
            const updatedCourse = courseRes.rows[0];

            if (sessionsList && sessionsList.length > 0) {
                await client.query('DELETE FROM course_sessions WHERE course_id = $1', [id]);
                const insertSessionQuery = `
                    INSERT INTO course_sessions (course_id, session_number, title, description)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *;
                `;
                const createdSessions = [];
                for (let i = 0; i < sessionsList.length; i++) {
                    const sess = sessionsList[i];
                    const sessValues = [
                        id,
                        i + 1,
                        sess.title,
                        sess.description || ''
                    ];
                    const sessRes = await client.query(insertSessionQuery, sessValues);
                    createdSessions.push(sessRes.rows[0]);
                }
                updatedCourse.sessions_list = createdSessions;
            } else if (sessionsList && sessionsList.length === 0) {
                await client.query('DELETE FROM course_sessions WHERE course_id = $1', [id]);
                updatedCourse.sessions_list = [];
            }

            await client.query('COMMIT');
            return updatedCourse;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}
