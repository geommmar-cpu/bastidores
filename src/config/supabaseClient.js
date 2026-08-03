import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ssjijxmoqibavcbhxaao.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNzamlqeG1vcWliYXZjYmh4YWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNzIxNDcsImV4cCI6MjEwMDc0ODE0N30.quWoNDy4cLJedeHkEdzjyrGEAdSyTkDY77Xoxg3Nmqk';

export const supabase = createClient(supabaseUrl, supabaseKey);
