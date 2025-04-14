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
  ClipboardList,
  FileText,
  BarChart4,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const reportItems = [
  {
    title: "Student Reports",
    icon: Users,
    description: "Enrollment, academic progress, and course distribution.",
    link: "/admin/reports/students",
  },
  {
    title: "Teacher Reports",
    icon: School,
    description: "Faculty load, subject assignments, and contribution logs.",
    link: "/admin/reports/teachers",
  },
  {
    title: "Course & Department",
    icon: BookOpen,
    description: "Department-level insights & course enrollments.",
    comingSoon: true,
  },
  {
    title: "Timetable Reports",
    icon: CalendarCheck2,
    description: "Scheduled sessions, subject-wise slots, and availability.",
    comingSoon: true,
  },
  {
    title: "Announcements Log",
    icon: Megaphone,
    description: "Notifications sent, audience reach & attachments log.",
    comingSoon: true,
  },
  {
    title: "Subjects Overview",
    icon: FileText,
    description: "Subject count, unassigned subjects, and credits overview.",
    comingSoon: true,
  },
  {
    title: "Assignment Submissions",
    icon: ClipboardList,
    description: "Track uploaded work, student engagement, and delays.",
    comingSoon: true,
  },
  {
    title: "Grade Analytics",
    icon: BarChart4,
    description: "View grade distribution per course and subject.",
    comingSoon: true,
  },
];

export default function ReportsDashboard() {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleClick = (item) => {
    if (item.comingSoon) {
      setSelectedReport(item);
      setOpenModal(true);
    } else {
      navigate(item.link);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          📊 Reports Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Analyze trends across students, staff, academics, performance, and
          scheduling — all from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {reportItems.map((item) => (
          <Card
            key={item.title}
            onClick={() => handleClick(item)}
            className="hover:shadow-lg transition cursor-pointer border-2 border-muted/30 hover:border-primary group"
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition" />
                <h2 className="text-xl font-semibold text-foreground">
                  {item.title}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
              <Button variant="outline" className="mt-2 text-sm">
                {item.comingSoon ? "Coming Soon" : "View Report"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedReport?.title} Report</DialogTitle>
            <DialogDescription>
              This report is under construction and will be available in an
              upcoming release. Stay tuned!
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
