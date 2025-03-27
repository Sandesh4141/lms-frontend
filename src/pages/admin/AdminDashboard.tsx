
import { useAuth } from "../../context/AuthContext";

import StatsCard from "@/components/ui/dashboard/StatsCard";
import ActivityCard from "@/components/ui/dashboard/ActivityCard";

import {
  Users,
  BookOpen,
  UserCheck,
  Bell,
  Settings,
  UserPlus,
  BookPlus,
  Upload,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const AdminDashboard = () => {
  const { user } = useAuth();

  // Dummy data for demonstration
  const activityItems = [
    {
      icon: UserPlus,
      title: "New Teacher Registered",
      description: "Emma Wilson - Physics Department",
      time: "1 hour ago",
    },
    {
      icon: BookPlus,
      title: "New Course Added",
      description: "Advanced Biology for Seniors",
      time: "3 hours ago",
    },
    {
      icon: UserCheck,
      title: "User Role Updated",
      description: "John Smith - Changed from Student to Teacher",
      time: "1 day ago",
    },
    {
      icon: Upload,
      title: "System Update Completed",
      description: "Version 2.4.0 deployed successfully",
      time: "2 days ago",
    },
  ];

  // Chart data
  const enrollmentData = [
    { name: "Mathematics", students: 120 },
    { name: "Physics", students: 98 },
    { name: "Chemistry", students: 86 },
    { name: "Biology", students: 99 },
    { name: "Literature", students: 85 },
    { name: "History", students: 65 },
  ];

  return (
    <div className="space-y-8 page-transition">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || "Admin"}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of the system.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value="548"
          icon={Users}
          description="3.2% increase this month"
        />
        <StatsCard
          title="Teachers"
          value="42"
          icon={UserCheck}
          trend={1.8}
          description="1.8% increase this month"
        />
        <StatsCard title="Active Courses" value="36" icon={BookOpen} />
        <StatsCard
          title="New Announcements"
          value="12"
          icon={Bell}
          trend={-8}
          description="8% decrease from last week"
        />
      </div>

      {/* Enrollment Chart */}
      <div className="glass-card rounded-xl p-6 hover-lift card-transition">
        <h2 className="text-xl font-semibold mb-6">Course Enrollment</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={enrollmentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  border: "none",
                }}
              />
              <Bar
                dataKey="students"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="glass-card rounded-xl p-6 hover-lift card-transition">
          <h3 className="text-lg font-medium mb-4">Quick Actions</h3>

          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center gap-2 w-full p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
              <UserPlus className="h-5 w-5" />
              <span>Add New User</span>
            </button>

            <button className="flex items-center gap-2 w-full p-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors">
              <BookPlus className="h-5 w-5" />
              <span>Create New Course</span>
            </button>

            <button className="flex items-center gap-2 w-full p-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors">
              <Bell className="h-5 w-5" />
              <span>Send Announcement</span>
            </button>

            <button className="flex items-center gap-2 w-full p-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors">
              <Settings className="h-5 w-5" />
              <span>System Settings</span>
            </button>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <ActivityCard items={activityItems} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
