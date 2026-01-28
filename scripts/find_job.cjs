
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://kyutidymyosvzjbdkdjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt5dXRpZHlteW9zdnpqYmRrZGpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkyNjY4OTIsImV4cCI6MjA4NDg0Mjg5Mn0.LOiyN3fbseQVDyvQEq3XQQMWWOfk-M170y0-Fii94_I';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkJob() {
    console.log('Searching for "Job" in profiles...');
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .ilike('name', '%Job%');

    if (error) {
        console.error('Error:', error.message);
        return;
    }

    if (data.length === 0) {
        console.log('No profile found for "Job".');
    } else {
        console.log('Found profile:', JSON.stringify(data[0], null, 2));
    }
}

checkJob();
