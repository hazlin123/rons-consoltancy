
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kyutidymyosvzjbdkdjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXRpZHlteW9zdnpqYmRrZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjY4OTIsImV4cCI6MjA4NDg0Mjg5Mn0.LOiyN3fbseQVDyvQEq3XQQMWWOfk-M170y0-Fii94_I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runDiagnostic() {
    console.log('--- START DIAGNOSTIC ---');

    // 1. Check Profiles
    const { data: profiles, error: pError } = await supabase.from('profiles').select('*');
    if (pError) console.error('Profiles Error:', pError.message);
    else console.log(`Profiles found: ${profiles.length}`, profiles.map(p => ({ email: p.email, role: p.role })));

    // 2. Check Student Journeys
    const { data: journeys, error: jError } = await supabase.from('student_journeys').select('*');
    if (jError) console.error('Journeys Error:', jError.message);
    else console.log(`Journeys found: ${journeys.length}`);

    // 3. Check for specific student role
    const { data: students, error: sError } = await supabase.from('profiles').select('*').eq('role', 'student');
    console.log(`Students (role='student') found: ${students?.length || 0}`);

    console.log('--- END DIAGNOSTIC ---');
}

runDiagnostic();
