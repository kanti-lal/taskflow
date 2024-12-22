import { Task } from '../types';
import { CheckCircle, Clock, XCircle, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const stats = [
    {
      key: 'total',
      label: 'Total Tasks',
      value: tasks.length,
      icon: ListTodo,
      color: 'text-blue-500'
    },
    {
      key: 'pending',
      label: 'Pending',
      value: tasks.filter(t => t.status === 'pending').length,
      icon: Clock,
      color: 'text-yellow-500'
    },
    {
      key: 'completed',
      label: 'Completed',
      value: tasks.filter(t => t.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-500'
    },
    {
      key: 'closed',
      label: 'Closed',
      value: tasks.filter(t => t.status === 'closed').length,
      icon: XCircle,
      color: 'text-red-500'
    }
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map(({ key, label, value, icon: Icon, color }) => (
        <div key={key} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Icon className={`${color}`} size={20} />
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          </div>
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
      ))}
    </div>
  );
}
