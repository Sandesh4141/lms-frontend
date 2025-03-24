import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  User,
  BookOpen,
  Bell,
  BarChart4,
  FileText,
  Calendar,
  Folder,
  Award,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

const navigationItems = {
  admin: [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Students", path: "/admin/students", icon: Users },
    { name: "Teachers", path: "/admin/teachers", icon: User },
    { name: "Courses", path: "/admin/courses", icon: BookOpen },
    { name: "Announcements", path: "/admin/announcements", icon: Bell },
    { name: "Reports", path: "/admin/reports", icon: BarChart4 },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ],
  teacher: [
    { name: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "Subjects", path: "/teacher/subjects", icon: BookOpen },
    { name: "Assignments", path: "/teacher/assignments", icon: FileText },
    { name: "Submissions", path: "/teacher/submissions", icon: Folder },
    { name: "Calendar", path: "/teacher/calendar", icon: Calendar },
    { name: "Messages", path: "/teacher/messages", icon: MessageSquare },
    { name: "Reports", path: "/teacher/reports", icon: BarChart4 },
  ],
  student: [
    { name: "Dashboard", path: "/student/dashboard", icon: LayoutDashboard },
    { name: "Courses", path: "/student/courses", icon: BookOpen },
    { name: "Assignments", path: "/student/assignments", icon: FileText },
    { name: "Timetable", path: "/student/timetable", icon: Calendar },
    { name: "Grades", path: "/student/grades", icon: Award },
    { name: "Materials", path: "/student/materials", icon: Folder },
    { name: "Messages", path: "/student/messages", icon: MessageSquare },
    { name: "Notifications", path: "/student/notifications", icon: Bell },
  ],
};

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { role, username, logout } = useAuth() as {
    role: keyof typeof navigationItems;
    username: string;
    logout: () => void;
  };
  const location = useLocation();

  if (!role || !navigationItems[role]) return null;

  const navItems = navigationItems[role];

  return (
    <div
      className={` relative h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-background rounded-full p-1 border shadow z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* App title */}
      <div className="p-4 border-b border-border text-center font-bold text-lg">
        {collapsed ? "LMS" : "Moodle LMS"}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm transition ${
                    isActive
                      ? "bg-muted text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-border text-sm">
        {!collapsed && (
          <div className="mb-2">
            <p className="font-medium">{username}</p>
            <p className="text-muted-foreground capitalize">{role}</p>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-2 text-muted-foreground hover:text-destructive transition text-sm"
        >
          <LogOut size={16} />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
}
