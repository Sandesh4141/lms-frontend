import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  FileBarChart2,
  Users,
  School,
  BookOpen,
  CalendarCheck2,
  Megaphone,
} from "lucide-react";

const reportItems = [
  {
    title: "Student Reports",
    icon: Users,
    description:
      "View enrollment, academic, and activity reports for all students.",
    link: "/admin/reports/students",
  },
  {
    title: "Teacher Reports",
    icon: School,
    description: "Access teaching allocation and faculty contribution reports.",
    link: "/admin/reports/teachers",
  },
  {
    title: "Course & Department",
    icon: BookOpen,
    description:
      "Get summaries and analytics for all departments and their courses.",
    link: "/admin/reports/courses",
  },
  {
    title: "Timetable Reports",
    icon: CalendarCheck2,
    description: "Generate printable or filtered class schedules.",
    link: "/admin/reports/timetables",
  },
  {
    title: "Announcements Log",
    icon: Megaphone,
    description: "Audit all admin announcements including attachments.",
    link: "/admin/reports/announcements",
  },
];

export default function ReportsDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          📊 Reports Center
        </h1>
        <p className="text-muted-foreground">
          Access detailed reports and analytics for students, faculty,
          academics, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportItems.map((item) => (
          <Card
            key={item.title}
            onClick={() => navigate(item.link)}
            className="hover:shadow-md transition cursor-pointer border-2 border-muted/30 hover:border-primary"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <item.icon className="w-8 h-8 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <Button variant="outline" className="mt-2 w-fit text-sm">
                View Report
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
