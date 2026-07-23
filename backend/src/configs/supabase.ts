import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';

dotenv.config();

// Polyfill WebSocket cho Node.js < 22
if (typeof (globalThis as any).WebSocket === 'undefined') {
  (globalThis as any).WebSocket = ws;
}

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
