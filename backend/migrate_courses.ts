import pool from './src/configs/database';

async function run() {
    const client = await pool.connect();
    try {
        console.log("Creating tables...");
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS courses (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                title VARCHAR(255) NOT NULL,
                code VARCHAR(50) UNIQUE NOT NULL,
                band VARCHAR(50) NOT NULL,
                duration VARCHAR(50),
                sessions INT,
                format VARCHAR(50),
                category VARCHAR(100),
                type VARCHAR(50),
                price INT,
                original_price INT,
                description TEXT,
                next_cohort VARCHAR(50),
                image_url TEXT,
                status VARCHAR(20) DEFAULT 'Draft',
                max_size INT DEFAULT 15,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Created table 'courses'");

        await client.query(`
            CREATE TABLE IF NOT EXISTS course_modules (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                sessions VARCHAR(50),
                description TEXT,
                topics JSONB
            );
        `);
        console.log("Created table 'course_modules'");

    } catch (e) {
        console.error("Error creating tables:", e);
    } finally {
        client.release();
        pool.end();
    }
}

run();
