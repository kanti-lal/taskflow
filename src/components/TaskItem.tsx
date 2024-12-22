import { Trash2, CheckCircle, XCircle, GripVertical } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: Task['status']) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onStatusChange, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm group">
      <div className="text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={20} />
      </div>
      <div className="flex-1">
        <p className={`text-gray-800 dark:text-gray-200 ${task.status === 'completed' ? 'line-through' : ''}`}>
          {task.title}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onStatusChange(task.id, 'completed')}
          className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
            task.status === 'completed' ? 'text-green-500' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <CheckCircle size={20} />
        </button>
        <button
          onClick={() => onStatusChange(task.id, 'closed')}
          className={`p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
            task.status === 'closed' ? 'text-red-500' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          <XCircle size={20} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-500"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
