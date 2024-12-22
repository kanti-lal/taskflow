import { Link, Outlet, useLocation } from 'react-router-dom';
import { CheckSquare, FileText, Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Greeting } from './Greeting';

export function Layout() {
  const location = useLocation();
  const [isDark, setIsDark] = useState(() => 
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  const tabs = [
    { path: '/', icon: CheckSquare, label: 'Tasks' },
    { path: '/notes', icon: FileText, label: 'Notes' },
  ];

  const toggleDarkMode = () => setIsDark(!isDark);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {tabs.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-3 flex items-center gap-2 border-b-2 ${
                    location.pathname === path
                      ? 'border-blue-500 text-blue-500 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}
              <div className="px-4 py-3">
                <Greeting hour={dateTime.getHours()} />
              </div>
            </div>
            <div className="flex items-center gap-4 px-4">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div>{dateTime.toLocaleDateString()}</div>
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

      <Outlet />
    </div>
  );
}
