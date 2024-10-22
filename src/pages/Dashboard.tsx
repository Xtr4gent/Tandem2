import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { xano } from '../xano';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../types/Task';

interface DashboardCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    background: string;
    text: string;
    cardBackground: string;
    borderColor: string;
  };
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, colors }) => {
  return (
    <div className="ios-card p-4" style={{ backgroundColor: colors.cardBackground }}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold" style={{ color: colors.text }}>{title}</h3>
        {icon}
      </div>
      <p className="text-3xl font-bold" style={{ color: colors.primary }}>{value}</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { colors } = useTheme();
  const { userId } = useAuth();
  const [tasksCompleted, setTasksCompleted] = useState(0);
  const [upcomingTasks, setUpcomingTasks] = useState(0);
  const [overdueTasks, setOverdueTasks] = useState(0);

  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())); // Start of week (Sunday)
    
    try {
      const tasksData = await xano.from('tasks').select();
      const userTasks = tasksData.filter((task: Task) => task.user_id === userId || task.visibility === 'shared');

      // Tasks completed this month
      const completedThisMonth = userTasks.filter(
        (task: Task) => task.completed && new Date(task.end_date) >= startOfMonth
      ).length;
      setTasksCompleted(completedThisMonth);

      // Upcoming tasks for this week
      const upcoming = userTasks.filter(
        (task: Task) => !task.completed && new Date(task.start_date) >= startOfWeek && new Date(task.start_date) <= now
      ).length;
      setUpcomingTasks(upcoming);

      // Overdue tasks
      const overdue = userTasks.filter(
        (task: Task) => !task.completed && new Date(task.end_date) < now
      ).length;
      setOverdueTasks(overdue);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="p-6" style={{ backgroundColor: colors.background, color: colors.text }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Tasks Completed This Month"
          value={tasksCompleted.toString()}
          icon={<CheckCircle className="text-green-500" size={24} />}
          colors={colors}
        />
        <DashboardCard
          title="Upcoming Tasks This Week"
          value={upcomingTasks.toString()}
          icon={<Clock className="text-blue-500" size={24} />}
          colors={colors}
        />
        <DashboardCard
          title="Overdue Tasks"
          value={overdueTasks.toString()}
          icon={<AlertCircle className="text-red-500" size={24} />}
          colors={colors}
        />
      </div>
    </div>
  );
};

export default Dashboard;