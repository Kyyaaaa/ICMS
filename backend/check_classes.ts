import { supabaseAdmin } from './src/configs/supabase';

async function check() {
    const { data, error } = await supabaseAdmin.from('classes').select('id, name, status, course_id').eq('course_id', '1846b5bb-1e85-49a4-9b2f-eaaff1578074');
    if (error) console.error("Error:", error);
    else console.log("Classes:", data);
}
check();
