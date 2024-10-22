import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { xano } from '../xano';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Task } from '../types/Task';
import AddTaskModal from '../components/AddTaskModal';

moment.locale('en-GB');
const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

const Calendar: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const { userId } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const data = await xano.from('tasks').select();
      setTasks(data.filter((task: Task) => task.user_id === userId || task.visibility === 'shared'));
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks for calendar:', error);
      setError('Failed to fetch tasks. Please try again later.');
    }
  };

  const handleAddTask = async (newTask: Omit<Task, 'id' | 'completed' | 'user_id'>) => {
    try {
      const data = await xano.from('tasks').insert({ ...newTask, completed: false, user_id: userId });
      setTasks(prevTasks => [...prevTasks, data]);
      setIsAddModalOpen(false);
      setError(null);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Failed to add task. Please try again.');
    }
  };

  const handleEditTask = async (updatedTask: Task) => {
    try {
      const taskToUpdate = {
        id: updatedTask.id,
        title: updatedTask.title,
        description: updatedTask.description,
        start_date: updatedTask.start_date,
        end_date: updatedTask.end_date,
        all_day: updatedTask.all_day,
        visibility: updatedTask.visibility,
        priority: updatedTask.priority,
        recurrence: updatedTask.recurrence ? JSON.parse(JSON.stringify(updatedTask.recurrence)) : null,
        user_id: updatedTask.user_id,
        completed: updatedTask.completed
      };

      await xano.from('tasks').update(taskToUpdate.id, taskToUpdate);
      setTasks(prevTasks => prevTasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setEditingTask(null);
      setError(null);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const onEventDrop = async ({ event, start, end, allDay }: any) => {
    const updatedTask = {
      ...tasks.find(t => t.id === event.id),
      start_date: start.toISOString(),
      end_date: end.toISOString(),
      all_day: allDay,
    };

    try {
      await handleEditTask(updatedTask as Task);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const onEventResize = async ({ event, start, end }: any) => {
    const updatedTask = {
      ...tasks.find(t => t.id === event.id),
      start_date: start.toISOString(),
      end_date: end.toISOString(),
    };

    try {
      await handleEditTask(updatedTask as Task);
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
    }
  };

  const events = tasks.map(task => ({
    id: task.id,
    title: task.title,
    start: new Date(task.start_date),
    end: new Date(task.end_date),
    allDay: task.all_day,
  }));

  return (
    <div className="p-6 h-full" style={{ backgroundColor: colors.background, color: colors.text }}>
      <h1 className="text-3xl font-bold mb-6" style={{ color: colors.primary }}>Calendar</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="h-[calc(100vh-200px)]">
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ 
            height: '100%',
            backgroundColor: colors.cardBackground,
          }}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          selectable
          onSelectSlot={(slotInfo) => {
            setEditingTask({
              id: '',
              title: '',
              description: '',
              start_date: slotInfo.start.toISOString(),
              end_date: slotInfo.end.toISOString(),
              completed: false,
              all_day: slotInfo.slots.length === 1,
              visibility: 'personal',
              user_id: userId || '',
              priority: 'medium',
            });
            setIsAddModalOpen(true);
          }}
          onDoubleClickEvent={(event) => {
            const task = tasks.find(t => t.id === event.id);
            if (task) {
              setEditingTask(task);
              setIsAddModalOpen(true);
            }
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: colors.primary,
              color: colors.cardBackground,
            },
          })}
        />
      </div>
      <AddTaskModal
        isOpen={isAddModalOpen}
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

export default Calendar;