import { useEffect, useState } from "react";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import { Sun, Moon, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const DashboardLayout = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const { username, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 🎯 Role-aware quotes
  const studentTips = [
    "📚 Study hard, nap harder 😴",
    "🎯 You’ve got this, future topper!",
    "💡 One concept at a time. Keep going!",
    "📝 Small steps = big grades!",
    "💪 Revision is power!",
  ];
  const teacherTips = [
    "🧑‍🏫 Inspiring minds, one lesson at a time!",
    "✨ Your impact lasts a lifetime.",
    "📖 Great teaching = great learning!",
    "📌 Every student you teach is a success story.",
    "🚀 Keep delivering knowledge bombs!",
  ];
  const adminTips = [
    "⚙️ Managing success behind the scenes!",
    "📊 You make the LMS magic happen.",
    "🛠️ Powering productivity, one config at a time.",
    "💼 You're the silent hero of the system.",
    "🧠 Systems run smoothly because of you!",
  ];
  const tips =
    role === "student"
      ? studentTips
      : role === "teacher"
      ? teacherTips
      : adminTips;

  const funMessage = tips[quoteIndex % tips.length];

  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => prev + 1);
    }, 6000); // change every 6 seconds
    return () => clearInterval(interval);
  }, [role]);

  // Breadcrumb logic
  const breadcrumbMap: Record<string, string> = {
    admin: "🛠 Admin",
    student: "🎓 Student",
    teacher: "🧑‍🏫 Teacher",
    dashboard: "🏠 Dashboard",
    students: "👥 Students",
    teachers: "🧑‍🏫 Teachers",
    courses: "📚 Courses",
    departments: "🏫 Departments",
    announcements: "📢 Announcements",
    reports: "📊 Reports",
    settings: "⚙️ Settings",
    "add-student": "➕ Add Student",
    "edit-student": "✏️ Edit Student",
    "add-teacher": "➕ Add Teacher",
    edit: "✏️ Edit",
    add: "➕ Add",
    subjects: "📖 Subjects",
    assignments: "📝 Assignments",
  };

  const getBreadcrumbs = () => {
    const segments = location.pathname.split("/").filter(Boolean);
    return segments.map((segment, idx) => {
      const path = "/" + segments.slice(0, idx + 1).join("/");
      return {
        label: breadcrumbMap[segment] || segment,
        path,
        isLast: idx === segments.length - 1,
      };
    });
  };

  // Title in browser tab
  useEffect(() => {
    const last = getBreadcrumbs().slice(-1)[0];
    document.title = last?.label || "Dashboard";
  }, [location]);

  const formatDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-20 border-b border-border px-6 flex items-center justify-between sticky top-0 z-50 bg-background">
          {/* Breadcrumbs */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap text-lg font-semibold">
              {getBreadcrumbs().map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-1">
                  {idx > 0 && <span className="text-muted-foreground">➡️</span>}
                  {crumb.isLast ? (
                    <span>{crumb.label}</span>
                  ) : (
                    <button
                      className="text-muted-foreground hover:underline"
                      onClick={() => navigate(crumb.path)}
                    >
                      {crumb.label}
                    </button>
                  )}
                </span>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">{formatDate()}</p>
          </div>

          {/* Right: quote + icons */}
          <div className="flex items-center gap-6">
            <div
              className="hidden md:block text-sm text-muted-foreground italic transition-opacity duration-500 ease-in-out"
              key={quoteIndex}
            >
              {funMessage}
            </div>

            {/* 🔔 Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-2 rounded-full hover:bg-muted transition">
                  <Bell className="h-5 w-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>No new notifications</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* 🌓 Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Avatar */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full focus:outline-none">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${username}`}
                    />
                    <AvatarFallback>{username?.[0] ?? "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {username} ({role})
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={`/${role}/settings`}>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
