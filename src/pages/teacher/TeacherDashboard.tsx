// src/pages/teacher/TeacherDashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { format } from "date-fns";
import {
  CalendarDays,
  BookOpenCheck,
  NotebookText,
  Presentation,
  ArrowRight,
  Users,
  NotebookPen,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeacherDashboard() {
  const { username } = useAuth();
  const today = format(new Date(), "eeee, MMMM d");

  const [studentsCount, setStudentsCount] = useState(0);
  const [subjectsCount, setSubjectsCount] = useState(0);
  const [assignmentsCount, setAssignmentsCount] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const courseRes = await axios.get("/teacher/course");
        const courseId = courseRes.data.course?.course_id;

        if (courseId) {
          const studentsRes = await axios.get(
            `/teacher/course/${courseId}/enrolled-students`
          );
          setStudentsCount(studentsRes.data.students?.length || 0);
        }

        const subjectsRes = await axios.get("/teacher/subjects");
        setSubjectsCount(subjectsRes.data.subjects?.length || 0);

        if (subjectsRes.data.subjects && subjectsRes.data.subjects.length > 0) {
          let totalAssignments = 0;
          for (const subject of subjectsRes.data.subjects) {
            const assignRes = await axios.get(
              `/teacher/subjects/${subject.id}/assignments`
            );
            totalAssignments += assignRes.data.assignments?.length || 0;
          }
          setAssignmentsCount(totalAssignments);
        }
      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    }

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning 🌞";
    if (hour < 18) return "Good Afternoon ☀️";
    return "Good Evening 🌙";
  };

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="rounded-xl bg-muted p-6 shadow-md space-y-1">
        <h2 className="text-3xl font-bold">
          {getGreeting()}, Professor{" "}
          <span className="capitalize">{username}</span> 👩‍🏫
        </h2>
        <p className="text-muted-foreground">
          Here's what’s lined up for you today — {today}
        </p>
        <p className="text-sm italic text-muted-foreground mt-2">
          “A good teacher can inspire hope, ignite the imagination, and instill
          a love of learning.” — Brad Henry
        </p>
      </div>

      {/* Teaching Summary Metrics */}
      <Card className="shadow hover:shadow-md transition">
        <CardContent className="flex flex-wrap justify-between gap-6 p-6 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            Students:{" "}
            <span className="font-medium text-foreground">{studentsCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-4 h-4 text-primary" />
            Subjects:{" "}
            <span className="font-medium text-foreground">{subjectsCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <NotebookText className="w-4 h-4 text-primary" />
            Reviews Pending:{" "}
            <span className="font-medium text-foreground">
              {assignmentsCount}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-primary" />
            Teaching Hours This Week:{" "}
            <span className="font-medium text-foreground">12</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today's Schedule */}
        <Card className="shadow hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <CalendarDays className="w-5 h-5" /> Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              You have 2 lectures scheduled today.
            </p>
            <Button
              variant="link"
              className="p-0 text-blue-600 dark:text-blue-400"
            >
              View Timetable <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Subjects Overview */}
        <Card className="shadow hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-600">
              <BookOpenCheck className="w-5 h-5" /> Your Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              You’re currently teaching {subjectsCount} subjects.
            </p>
            <Button variant="secondary" size="sm">
              View Subjects
            </Button>
          </CardContent>
        </Card>

        {/* Review Submissions */}
        <Card className="shadow hover:shadow-md transition">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-600">
              <NotebookText className="w-5 h-5" /> Review Submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-2">
              You have {assignmentsCount} student submissions to review.
            </p>
            <Button variant="secondary" size="sm">
              Go to Reviews
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Teaching Toolkit */}
      <Card className="shadow hover:shadow-md transition">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-600">
            🛠️ Teaching Toolkit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start">
            📢 Make Announcement
          </Button>
          <Button variant="outline" className="w-full justify-start">
            📝 Create Assignment
          </Button>
          <Button variant="outline" className="w-full justify-start">
            🗓️ View Class Schedule
          </Button>
          <Button variant="outline" className="w-full justify-start">
            📊 View Attendance Report
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
