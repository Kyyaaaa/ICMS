import pool from './src/configs/database';

async function run() {
    const client = await pool.connect();
    try {
        console.log("Thêm khóa ngoại fk_class_course vào bảng class...");
        
        await client.query(`
            ALTER TABLE class 
            ADD CONSTRAINT fk_class_course 
            FOREIGN KEY (course_id) 
            REFERENCES courses(id) 
            ON UPDATE CASCADE 
            ON DELETE RESTRICT;
        `);
        console.log("Thêm khóa ngoại thành công!");

    } catch (e) {
        console.error("Lỗi khi thêm khóa ngoại:", e);
    } finally {
        client.release();
        pool.end();
    }
}

run();
