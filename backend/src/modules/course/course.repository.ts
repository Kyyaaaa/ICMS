import pool from '../../configs/database';

export class CourseRepository {
    static async createCourse(courseData: any, modules: any[] = []) {
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
                    title, code, band, duration, sessions, format, category, type, price, original_price, description, next_cohort, image_url, status, max_size
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
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
                courseData.max_size || 15
            ];
            const courseRes = await client.query(insertCourseQuery, courseValues);
            const newCourse = courseRes.rows[0];

            // Thêm các học phần (modules) nếu có
            if (modules && modules.length > 0) {
                const insertModuleQuery = `
                    INSERT INTO course_modules (course_id, title, sessions, description, topics)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *;
                `;
                const createdModules = [];
                for (const mod of modules) {
                    const modValues = [
                        newCourse.id,
                        mod.title,
                        mod.sessions,
                        mod.description,
                        JSON.stringify(mod.topics || [])
                    ];
                    const modRes = await client.query(insertModuleQuery, modValues);
                    createdModules.push(modRes.rows[0]);
                }
                newCourse.modules = createdModules;
            } else {
                newCourse.modules = [];
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

        const modulesQuery = `SELECT * FROM course_modules WHERE course_id = $1 ORDER BY id ASC;`;
        const modulesRes = await pool.query(modulesQuery, [id]);
        
        course.modules = modulesRes.rows.map(m => {
            let parsedTopics = m.topics;
            if (typeof m.topics === 'string') {
                try {
                    parsedTopics = JSON.parse(m.topics);
                } catch (e) {
                    parsedTopics = [];
                }
            }
            return {
                ...m,
                topics: parsedTopics
            };
        });

        return course;
    }

    static async deleteCourse(id: string) {
        const res = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
        return res.rowCount && res.rowCount > 0;
    }

    static async updateCourse(id: string, courseData: any, modules: any[] = []) {
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
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $16
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
                id
            ];
            const courseRes = await client.query(updateCourseQuery, courseValues);
            const updatedCourse = courseRes.rows[0];

            if (modules && modules.length > 0) {
                await client.query('DELETE FROM course_modules WHERE course_id = $1', [id]);
                const insertModuleQuery = `
                    INSERT INTO course_modules (course_id, title, sessions, description, topics)
                    VALUES ($1, $2, $3, $4, $5)
                    RETURNING *;
                `;
                const createdModules = [];
                for (const mod of modules) {
                    const modValues = [
                        id,
                        mod.title,
                        mod.sessions,
                        mod.description,
                        JSON.stringify(mod.topics || [])
                    ];
                    const modRes = await client.query(insertModuleQuery, modValues);
                    createdModules.push(modRes.rows[0]);
                }
                updatedCourse.modules = createdModules;
            } else if (modules && modules.length === 0) {
                await client.query('DELETE FROM course_modules WHERE course_id = $1', [id]);
                updatedCourse.modules = [];
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
