import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Repeat, Tag } from 'lucide-react';
import { Task } from '../types/Task';
import { useTheme } from '../contexts/ThemeContext';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'user_id'>) => void;
  onEditTask: (task: Task) => void;
  editingTask: Task | null;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ isOpen, onClose, onAddTask, onEditTask, editingTask }) => {
  const [task, setTask] = useState<Omit<Task, 'id' | 'completed' | 'user_id'>>({
    title: '',
    description: '',
    start_date: new Date().toISOString().slice(0, 16),
    end_date: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    all_day: false,
    visibility: 'personal',
    priority: 'medium',
  });
  const [isRecurring, setIsRecurring] = useState(false);
  const { colors } = useTheme();

  useEffect(() => {
    if (editingTask) {
      setTask({
        title: editingTask.title,
        description: editingTask.description,
        start_date: editingTask.start_date,
        end_date: editingTask.end_date,
        all_day: editingTask.all_day,
        visibility: editingTask.visibility,
        recurrence: editingTask.recurrence,
        priority: editingTask.priority,
      });
      setIsRecurring(!!editingTask.recurrence);
    } else {
      resetForm();
    }
  }, [editingTask]);

  const resetForm = () => {
    const now = new Date();
    const startDate = now.toISOString().slice(0, 16);
    const endDate = new Date(now.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16);
    setTask({
      title: '',
      description: '',
      start_date: startDate,
      end_date: endDate,
      all_day: false,
      visibility: 'personal',
      priority: 'medium',
    });
    setIsRecurring(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedTask = {
      ...task,
      recurrence: isRecurring ? task.recurrence : undefined,
    };
    if (editingTask) {
      onEditTask({ ...editingTask, ...submittedTask });
    } else {
      onAddTask(submittedTask);
    }
    onClose();
    resetForm();
  };

  const handleAllDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isAllDay = e.target.checked;
    setTask(prevTask => {
      const newTask = { ...prevTask, all_day: isAllDay };
      if (isAllDay) {
        const startDate = new Date(prevTask.start_date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(23, 59, 59, 999);
        newTask.start_date = startDate.toISOString().slice(0, 10);
        newTask.end_date = endDate.toISOString().slice(0, 10);
      }
      return newTask;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="ios-card p-6 rounded-lg shadow-xl w-full max-w-md" style={{ backgroundColor: colors.cardBackground, color: colors.text }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold" style={{ color: colors.primary }}>
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={onClose} style={{ color: colors.text }}>
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Task title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            className="ios-input w-full"
            style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.borderColor }}
            required
          />
          
          <textarea
            placeholder="Description (optional)"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            className="ios-input w-full h-24"
            style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.borderColor }}
          />

          <div className="flex items-center space-x-2">
            <Calendar size={20} style={{ color: colors.primary }} />
            <input
              type="date"
              value={task.start_date.split('T')[0]}
              onChange={(e) => setTask({ ...task, start_date: `${e.target.value}T${task.start_date.split('T')[1]}` })}
              className="ios-input flex-grow"
              style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.borderColor }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Clock size={20} style={{ color: colors.primary }} />
            <input
              type="time"
              value={task.start_date.split('T')[1] || ''}
              onChange={(e) => setTask({ ...task, start_date: `${task.start_date.split('T')[0]}T${e.target.value}` })}
              className="ios-input flex-grow"
              style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.borderColor }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={task.all_day}
              onChange={handleAllDayChange}
              id="all-day"
              className="ios-checkbox"
            />
            <label htmlFor="all-day" className="text-sm" style={{ color: colors.text }}>All day</label>
          </div>

          <div className="flex items-center space-x-2">
            <Tag size={20} style={{ color: colors.primary }} />
            <select
              value={task.visibility}
              onChange={(e) => setTask({ ...task, visibility: e.target.value as 'personal' | 'shared' })}
              className="ios-input flex-grow"
              style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.borderColor }}
            >
              <option value="personal">Personal</option>
              <option value="shared">Shared</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Repeat size={20} style={{ color: colors.primary }} />
            <select
              value={isRecurring ? (task.recurrence?.frequency || 'daily') : 'none'}
              onChange={(e) => {
                const value = e.target.value;
                if (value === 'none') {
                  setIsRecurring(false);
                  setTask({ ...task, recurrence: undefined });
                } else {
                  setIsRecurring(true);
                  setTask({ 
                    ...task, 
                    recurrence: { 
                      ...task.recurrence, 
                      frequency: value as 'daily' | 'weekly' | 'monthly' | 'yearly',
                      interval: 1
                    } 
                  });
                }
              }}
              className="ios-input flex-grow"
              style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.borderColor }}
            >
              <option value="none">No Repeat</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {isRecurring && (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={task.recurrence?.interval || 1}
                onChange={(e) => setTask({ 
                  ...task, 
                  recurrence: { 
                    ...task.recurrence, 
                    interval: parseInt(e.target.value) || 1
                  } 
                })}
                min="1"
                className="ios-input w-16"
                style={{ backgroundColor: colors.cardBackground, color: colors.text, borderColor: colors.borderColor }}
              />
              <span className="text-sm" style={{ color: colors.text }}>
                {task.recurrence?.frequency === 'daily' && 'day(s)'}
                {task.recurrence?.frequency === 'weekly' && 'week(s)'}
                {task.recurrence?.frequency === 'monthly' && 'month(s)'}
                {task.recurrence?.frequency === 'yearly' && 'year(s)'}
              </span>
            </div>
          )}

          <button
            type="submit"
            className="ios-btn w-full"
            style={{ backgroundColor: colors.primary, color: colors.cardBackground }}
          >
            {editingTask ? 'Update Task' : 'Add Task'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;