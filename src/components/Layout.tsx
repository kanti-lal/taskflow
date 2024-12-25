import { Link, Outlet, useLocation } from "react-router-dom";
import { CheckSquare, FileText, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { Greeting } from "./Greeting";

export function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(
    () =>
      localStorage.getItem("darkMode") === "true" ||
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", isDark.toString());
  }, [isDark]);

  const tabs = [
    { path: "/", icon: CheckSquare, label: "Tasks" },
    { path: "/notes", icon: FileText, label: "Notes" },
  ];

  const toggleDarkMode = () => setIsDark(!isDark);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <nav className="fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-8xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
              {tabs.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 flex items-center gap-2 rounded-md ${
                    location.pathname === path
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <Greeting hour={dateTime.getHours()} />

              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div>
                  {dateTime.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </div>
                <div>{dateTime.toLocaleTimeString()}</div>
              </div>

              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 overflow-auto mt-16 w-[100%] mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
