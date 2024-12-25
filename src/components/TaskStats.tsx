import { Task } from "../types";
import { CheckCircle, Clock, XCircle, ListTodo, Target } from "lucide-react";

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const completionPercentage =
    tasks.length === 0 ? 0 : Math.round((completedTasks / tasks.length) * 100);

  const stats = [
    {
      key: "total",
      label: "Total Tasks",
      value: tasks.length,
      icon: ListTodo,
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      textColor: "text-white",
    },
    {
      key: "pending",
      label: "Pending",
      value: tasks.filter((t) => t.status === "pending").length,
      icon: Clock,
      gradient: "from-yellow-400 via-orange-400 to-orange-500",
      textColor: "text-white",
    },
    {
      key: "completed",
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle,
      gradient: "from-green-400 via-green-500 to-green-600",
      textColor: "text-white",
    },
    {
      key: "closed",
      label: "Closed",
      value: tasks.filter((t) => t.status === "closed").length,
      icon: XCircle,
      gradient: "from-red-400 via-red-500 to-red-600",
      textColor: "text-white",
    },
    {
      key: "target",
      label: "Progress",
      value: completionPercentage,
      suffix: "%",
      icon: Target,
      gradient: "from-purple-400 via-purple-500 to-purple-600",
      textColor: "text-white",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map(
        ({
          key,
          label,
          value,
          suffix = "",
          icon: Icon,
          gradient,
          textColor,
        }) => (
          <div
            key={key}
            className={`bg-gradient-to-br ${gradient} p-3 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-200 hover:shadow-xl relative overflow-hidden`}
          >
            {/* Background Icon */}
            <div className="absolute -right-2 -bottom-2 opacity-15">
              <Icon size={72} className={textColor} />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <Icon className={`${textColor}`} size={24} />
                <p
                  className={`text-md font-semibold tracking-wide ${textColor}`}
                >
                  {label}
                </p>
              </div>
              <p className={`text-2xl font-bold text-center ${textColor} mt-1`}>
                {value.toLocaleString()}
                {suffix}
              </p>
            </div>
          </div>
        )
      )}
    </div>
  );
}
