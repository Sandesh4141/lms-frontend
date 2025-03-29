import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

import StatsCard from "@/components/ui/dashboard/StatsCard";
import ActivityCard from "@/components/ui/dashboard/ActivityCard";

import {
  Users,
  BookOpen,
  UserCheck,
  Bell,
  PlusSquare,
  UserPlus,
  BookPlus,
  Upload,
  Settings,
} from "lucide-react";

const AdminDashboard = () => {
  const { username } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/admin/overview", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch overview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const activityItems = stats?.recent?.map((item: string, i: number) => ({
    icon: Upload,
    title: item,
    description: "",
    time: "Recently",
  }));

  return (
    <div className="space-y-8 page-transition">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Students"
          value={stats?.students || "–"}
          icon={Users}
        />
        <StatsCard
          title="Teachers"
          value={stats?.teachers || "–"}
          icon={UserCheck}
        />
        <StatsCard
          title="Active Courses"
          value={stats?.courses || "–"}
          icon={BookOpen}
        />
        <StatsCard
          title="Programs"
          value={stats?.programs || "–"}
          icon={PlusSquare}
        />
      </div>

      {/* Quick Actions + Activity Feed */}
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

        {/* Activity */}
        <div className="lg:col-span-2">
          <ActivityCard items={activityItems || []} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
