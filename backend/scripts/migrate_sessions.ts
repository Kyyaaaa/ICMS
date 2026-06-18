import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function run() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        console.log('Creating course_sessions table...');
        await client.query(`
            CREATE TABLE IF NOT EXISTS course_sessions (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
                session_number INT NOT NULL,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        console.log('Migrating data from course_modules to course_sessions...');
        const { rows: courseModules } = await client.query('SELECT * FROM course_modules');
        
        for (const mod of courseModules) {
            let sessionCnt = 1;
            if (mod.sessions) {
                const parsed = parseInt(mod.sessions.toString().replace(/[^0-9]/g, ''));
                if (!isNaN(parsed) && parsed > 0) {
                    sessionCnt = parsed;
                }
            }
            
            for (let i = 1; i <= sessionCnt; i++) {
                // Determine session number (count existing for this course)
                const { rows } = await client.query('SELECT COUNT(*) FROM course_sessions WHERE course_id = $1', [mod.course_id]);
                const nextNum = parseInt(rows[0].count) + 1;
                
                await client.query(`
                    INSERT INTO course_sessions (course_id, session_number, title, description)
                    VALUES ($1, $2, $3, $4)
                `, [mod.course_id, nextNum, `${mod.title} - Part ${i}`, mod.description]);
            }
        }
        
        console.log('Migration completed.');
        
        await client.query('COMMIT');
        console.log('Success!');
    } catch (e) {
        await client.query('ROLLBACK');
        console.error('Error:', e);
    } finally {
        client.release();
        await pool.end();
    }
}

run();
