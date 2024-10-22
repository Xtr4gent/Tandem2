export interface Task {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  completed: boolean;
  all_day: boolean;
  visibility: 'personal' | 'shared';
  user_id: string;
  priority: 'low' | 'medium' | 'high';
  recurrence?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    end_date?: string;
  };
}

export interface TaskActivity {
  id: string;
  task_id: string;
  user_id: string;
  action: 'add' | 'edit' | 'complete';
  created_at: string;
  task: Task;
}