import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { Task } from "../types";
import { TaskList } from "../components/TaskList";
import { TaskStats } from "../components/TaskStats";
import { format, subDays, isToday, isYesterday } from "date-fns";

export function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd")
  );

  // Clean up tasks older than 30 days
  useEffect(() => {
    const thirtyDaysAgo = subDays(new Date(), 30).getTime();
    setTasks((prev) =>
      prev.filter((task) => new Date(task.createdAt).getTime() > thirtyDaysAgo)
    );
  }, []);

  // Group tasks by date
  const tasksByDate = tasks.reduce((acc, task) => {
    const date = format(new Date(task.createdAt), "yyyy-MM-dd");
    if (!acc[date]) acc[date] = [];
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setTasks([task, ...tasks]);
    setNewTask("");
  };

  const handleStatusChange = (id: string, status: Task["status"]) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Filter tasks for selected date
  const selectedDateTasks = tasksByDate[selectedDate] || [];

  const getDateLabel = (date: string) => {
    const dateObj = new Date(date);
    if (isToday(dateObj)) return "Today's Tasks";
    if (isYesterday(dateObj)) return "Yesterday's Tasks";
    return `Tasks for ${format(dateObj, "MMMM d, yyyy")}`;
  };

  return (
    <div className="h-[calc(100vh-64px)]">
      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-80 fixed top-16 bottom-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="p-4 h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              Task History
            </h2>
            <div className="space-y-2">
              {Object.entries(tasksByDate)
                .sort(
                  (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime()
                )
                .map(([date, dateTasks]) => (
                  <div
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 rounded-lg transition-colors cursor-pointer ${
                      selectedDate === date
                        ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-500/50"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    <p
                      className={`font-medium ${
                        isToday(new Date(date))
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-gray-900 dark:text-white"
                      }`}
                    >
                      {format(new Date(date), "MMM dd, yyyy")}
                      {isToday(new Date(date)) && (
                        <span className="ml-2 text-sm font-normal text-blue-600 dark:text-blue-400">
                          (Today)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {dateTasks.length} task{dateTasks.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 ml-80">
          <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">
              {getDateLabel(selectedDate)}
            </h1>

            <TaskStats tasks={selectedDateTasks} />

            {/* Only show add task form for today */}
            {isToday(new Date(selectedDate)) && (
              <form onSubmit={handleAddTask} className="mb-8">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                      placeholder-gray-500 dark:placeholder-gray-400"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg
                      flex items-center gap-2 transition-colors font-medium"
                  >
                    <PlusCircle size={20} />
                    Add Task
                  </button>
                </div>
              </form>
            )}

            <div className="">
              <TaskList
                tasks={selectedDateTasks}
                onTasksReorder={(newTasks) => {
                  setTasks((prevTasks) => {
                    const otherTasks = prevTasks.filter(
                      (task) =>
                        format(new Date(task.createdAt), "yyyy-MM-dd") !==
                        selectedDate
                    );
                    return [...newTasks, ...otherTasks];
                  });
                }}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
