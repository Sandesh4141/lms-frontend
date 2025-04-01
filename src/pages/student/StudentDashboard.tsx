import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import {
  CalendarDays,
  Megaphone,
  BookOpenCheck,
  ArrowRight,
  NotebookPen,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function StudentDashboard() {
  const { username } = useAuth();
  const today = format(new Date(), "eeee, MMMM d");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 🌞";
    if (hour < 18) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Greeting Banner */}
      <div className="rounded-xl bg-muted p-6 shadow-md">
        <h2 className="text-3xl font-bold">
          {getGreeting()}, <span className="capitalize">{username}</span>! 👋
        </h2>
        <p className="text-muted-foreground">
          Hope you're having a productive day — {today}
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Upcoming Classes */}
        <Card className="bg-card text-card-foreground shadow hover:shadow-md transition">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              Upcoming Classes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              You’re all caught up today 🎉
            </p>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-blue-600 dark:text-blue-400"
            >
              View Timetable <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Announcements */}
        <Card className="bg-card text-card-foreground shadow hover:shadow-md transition">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-yellow-600" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              No new announcements.
            </p>
            <Button
              variant="link"
              size="sm"
              className="p-0 text-yellow-700 dark:text-yellow-400"
            >
              View All <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card className="bg-card text-card-foreground shadow hover:shadow-md transition">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <BookOpenCheck className="w-5 h-5 text-green-600" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              3 out of 6 subjects completed ✅
            </p>
            <Progress
              value={50}
              className="h-2 bg-green-200 dark:bg-green-900"
            />
            <p className="text-xs text-green-700 dark:text-green-400 mt-2">
              50% completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-card text-card-foreground shadow hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-purple-600">
              <NotebookPen className="w-5 h-5" />
              Assignments & Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              No assignments due today.
            </p>
            <Button variant="secondary" size="sm">
              Go to Assignments
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground shadow hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-600">
              📚 Subjects Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              View your enrolled subjects and material.
            </p>
            <Button variant="secondary" size="sm">
              View Subjects
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
