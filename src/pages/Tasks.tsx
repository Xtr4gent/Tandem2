import React, { useState, useEffect, useCallback } from 'react';
import { xano } from '../xano';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import AddTaskModal from '../components/AddTaskModal';
import { Task } from '../types/Task';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const { userId } = useAuth();

  const fetchTasks = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await xano.from('tasks').select();
      setTasks(data.filter((task: Task) => task.user_id === userId || task.visibility === 'shared'));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'completed' | 'user_id'>) => {
    try {
      const data = await xano.from('tasks').insert({ ...newTask, completed: false, user_id: userId });
      setTasks(prevTasks => [...prevTasks, data]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      await xano.from('tasks').update(updatedTask.id, updatedTask);
      setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await xano.from('tasks').delete(taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
    }
  };

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6" style={{ backgroundColor: colors.background, color: colors.text }}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: colors.primary }}>Tasks</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="ios-btn flex items-center"
          style={{ backgroundColor: colors.primary, color: colors.cardBackground }}
        >
          <Plus size={20} className="mr-1" /> Add Task
        </button>
      </div>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="ios-card p-4 flex items-center justify-between"
            style={{ backgroundColor: colors.cardBackground }}
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleEditTask({ ...task, completed: !task.completed })}
                className="mr-3"
              />
              <div>
                <h3 className={`font-semibold ${task.completed ? 'line-through' : ''}`} style={{ color: colors.primary }}>
                  {task.title}
                </h3>
                <p className="text-sm" style={{ color: colors.text }}>{task.description}</p>
                <p className="text-xs" style={{ color: colors.text }}>
                  {task.all_day ? 'All day' : `${new Date(task.start_date).toLocaleString()} - ${new Date(task.end_date).toLocaleString()}`}
                </p>
                <p className="text-xs" style={{ color: colors.text }}>Visibility: {task.visibility}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button onClick={() => setEditingTask(task)} style={{ color: colors.primary }}>
                <Edit2 size={20} />
              </button>
              <button onClick={() => handleDeleteTask(task.id)} style={{ color: colors.text }}>
                <Trash2 size={20} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <AddTaskModal
        isOpen={isAddModalOpen || !!editingTask}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTask(null);
        }}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        editingTask={editingTask}
      />
    </div>
  );
};

export default Tasks;