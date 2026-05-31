import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_ANON_KEY trong file .env');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

const serviceRoleKey = process.env.SERVICE_ROLE_KEY || '';
if (!serviceRoleKey) {
  console.warn('CẢNH BÁO: Thiếu biến SERVICE_ROLE_KEY trong file .env. Các chức năng Admin API sẽ không hoạt động.');
}
export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
