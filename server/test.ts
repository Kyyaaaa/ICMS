import { supabaseAdmin } from './src/configs/supabase';

async function createTutor() {
  console.log("Creating Tutor account...");
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: 'ak47shadow3300@gmail.com',
    password: '10062006As@',
    email_confirm: true,
    user_metadata: {
      role: 'TUTOR',
      full_name: 'Tutor Test User'
    }
  });

  if (error) {
    console.error("ERROR creating user:", error);
  } else {
    console.log("User created successfully:", data.user.id);
  }
}

createTutor();
