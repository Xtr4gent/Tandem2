import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupSupabase() {
  try {
    console.log('Starting Supabase setup...');

    // Check if tasks table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    if (tableCheckError && tableCheckError.code === '42P01') {
      console.log('Tasks table does not exist. Creating table...');
      
      // Create tasks table
      const { error: createTableError } = await supabase
        .from('tasks')
        .insert([
          {
            title: 'Sample Task',
            description: 'This is a sample task',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 86400000).toISOString(),
            completed: false,
            all_day: false
          }
        ]);

      if (createTableError) {
        console.error('Error creating tasks table:', createTableError);
        return;
      }
      
      console.log('Tasks table created successfully.');
    }

    // Check if tasks table has data
    const { data: existingTasks, error: dataCheckError } = await supabase
      .from('tasks')
      .select('id')
      .limit(1);

    if (dataCheckError) {
      console.error('Error checking tasks table data:', dataCheckError);
      return;
    }

    if (!existingTasks || existingTasks.length === 0) {
      console.log('Tasks table is empty. Inserting sample data...');
      
      // Insert sample data
      const { data: insertedData, error: insertError } = await supabase
        .from('tasks')
        .insert([
          { 
            title: 'Complete project', 
            description: 'Finish the Tandem app', 
            start_date: new Date('2024-04-01T00:00:00Z').toISOString(),
            end_date: new Date('2024-04-01T23:59:59Z').toISOString(),
            completed: false,
            all_day: true
          },
          { 
            title: 'Buy groceries', 
            description: 'Get milk, eggs, and bread', 
            start_date: new Date('2024-03-15T10:00:00Z').toISOString(),
            end_date: new Date('2024-03-15T11:00:00Z').toISOString(),
            completed: true,
            all_day: false
          },
          { 
            title: 'Go to the gym', 
            description: 'Cardio and strength training', 
            start_date: new Date('2024-03-20T18:00:00Z').toISOString(),
            end_date: new Date('2024-03-20T19:30:00Z').toISOString(),
            completed: false,
            all_day: false
          },
        ])
        .select();

      if (insertError) {
        console.error('Error inserting sample data:', insertError);
      } else {
        console.log('Sample data inserted successfully:', insertedData);
      }
    } else {
      console.log('Tasks table already contains data. Skipping sample data insertion.');
    }

    console.log('Supabase setup completed.');
  } catch (error) {
    console.error('Unexpected error during Supabase setup:', error);
  }
}

setupSupabase();