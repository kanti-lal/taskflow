import { useState } from "react";
import { Edit2, Sun, Coffee, Sunset, Moon } from "lucide-react";

interface GreetingProps {
  hour: number;
}

export function Greeting({ hour }: GreetingProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(
    () => localStorage.getItem("userName") || ""
  );
  const [tempName, setTempName] = useState(name);

  const getGreetingInfo = () => {
    if (hour >= 5 && hour < 12)
      return { text: "Good Morning", icon: Sun, color: "text-yellow-500" };
    if (hour >= 12 && hour < 17)
      return { text: "Good Afternoon", icon: Coffee, color: "text-orange-500" };
    if (hour >= 17 && hour < 22)
      return { text: "Good Evening", icon: Sunset, color: "text-pink-500" };
    return { text: "Good Night", icon: Moon, color: "text-blue-500" };
  };

  const { text, icon: Icon, color } = getGreetingInfo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = tempName.trim();
    if (trimmedName) {
      setName(trimmedName);
      localStorage.setItem("userName", trimmedName);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form onSubmit={handleSubmit} className="inline-flex items-center">
        <input
          type="text"
          value={tempName}
          onChange={(e) => setTempName(e.target.value)}
          className="px-2 py-1 text-sm border rounded dark:border-gray-700 text-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your name"
          autoFocus
        />
        <button
          type="submit"
          className="ml-2 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400"
        >
          Save
        </button>
      </form>
    );
  }

  return (
    <span
      className="text-gray-600 dark:text-gray-300 group flex items-center gap-2 cursor-pointer"
      onClick={() => setIsEditing(true)}
    >
      <Icon size={18} className={color} />
      {text}
      {name && `, ${name}`}
      <Edit2
        size={14}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
      />
    </span>
  );
}
