
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kyutidymyosvzjbdkdjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXRpZHlteW9zdnpqYmRrZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjY4OTIsImV4cCI6MjA4NDg0Mjg5Mn0.LOiyN3fbseQVDyvQEq3XQQMWWOfk-M170y0-Fii94_I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkEverything() {
    console.log('--- FINAL CHECK ---');

    const { data: profiles, error } = await supabase.from('profiles').select('*');
    if (error) {
        console.log('Profiles Error:', error.message);
    } else {
        console.log(`Profiles in DB: ${profiles.length}`);
        profiles.forEach(p => console.log(`- ${p.email} [${p.role}]`));
    }

    const { data: students } = await supabase.from('profiles').select('email').eq('role', 'student');
    console.log(`Students found: ${students?.length || 0}`);

    console.log('--- END CHECK ---');
}

checkEverything();
