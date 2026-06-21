import { supabaseAdmin } from './src/configs/supabase';

async function run() {
    try {
        console.log("Testing classes query...");
        const { data, error } = await supabaseAdmin
            .from('classes')
            .select('id, course_id, courses(name)')
            .limit(1);
        
        if (error) {
            console.error("Classes Query Error:", error);
        } else {
            console.log("Classes Query Success:", data);
        }

        console.log("Testing account query...");
        const { data: accData, error: accError } = await supabaseAdmin
            .from('account')
            .select('id, full_name')
            .limit(1);
        
        if (accError) {
            console.error("Account Query Error:", accError);
        } else {
            console.log("Account Query Success:", accData);
        }

    } catch (err) {
        console.error("Exception:", err);
    }
}

run();
