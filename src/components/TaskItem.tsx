import { Trash2, CheckCircle, XCircle, GripVertical } from "lucide-react";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: Task["status"]) => void;
  onDelete: (id: string) => void;
  indexNumber: number;
}

export function TaskItem({
  task,
  onStatusChange,
  onDelete,
  indexNumber,
}: TaskItemProps) {
  return (
    <div className="flex items-center rounded-lg gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors group">
      <div className="text-gray-400 dark:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical size={20} />
      </div>
      <div className="text-white dark:text-gray-400">{indexNumber + 1}</div>
      <div className="flex-1 min-w-0">
        <p
          className={`text-gray-900 dark:text-gray-100 truncate ${
            task.status === "completed"
              ? "line-through text-gray-500 dark:text-gray-400"
              : ""
          }`}
        >
          {task.title}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {new Date(task.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onStatusChange(task.id, "completed")}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
            ${
              task.status === "completed"
                ? "text-green-500 dark:text-green-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
        >
          <CheckCircle size={20} />
        </button>
        <button
          onClick={() => onStatusChange(task.id, "closed")}
          className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
            ${
              task.status === "closed"
                ? "text-red-500 dark:text-red-400"
                : "text-gray-400 dark:text-gray-500"
            }`}
        >
          <XCircle size={20} />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
            text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}
