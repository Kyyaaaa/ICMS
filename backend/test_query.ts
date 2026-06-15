import { supabase } from './src/configs/supabase';

async function test() {
    const { data, error } = await supabase
        .from('classes')
        .select(`
            *,
            courses(id, title, code),
            tutor:account!tutor_id(id, full_name, email),
            classroom:classroom!classroom_id(id, room_name)
        `)
        .limit(1);
    
    if (error) console.error("Query Error:", error.message);
    else console.log("Success:", data);
}

test();
