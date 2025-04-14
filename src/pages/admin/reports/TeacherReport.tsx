import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, School } from "lucide-react";
import * as XLSX from "xlsx";

export default function TeacherReport() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/teachers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.teachers || [];
      setTeachers(data);
    } catch (err) {
      console.error("Failed to fetch teachers", err);
      setTeachers([]);
    }
  };

  const filtered = Array.isArray(teachers)
    ? teachers.filter((t) =>
        `${t.first_name || t.name || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  const groupedByDepartment = teachers.reduce((acc, teacher) => {
    const dept = teacher.department_name || "Unknown";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(teacher);
    return acc;
  }, {});

  const groupedByCourse = teachers.reduce((acc, teacher) => {
    const course = teacher.course_name || "Unknown";
    if (!acc[course]) acc[course] = [];
    acc[course].push(teacher);
    return acc;
  }, {});

  const exportGroup = (group, name) => {
    const ws = XLSX.utils.json_to_sheet(group);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, `${name}_teachers.xlsx`);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <School className="w-7 h-7 text-primary" /> Teacher Reports
        </h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search teachers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => exportGroup(filtered, "All_Teachers")}>
            <Download className="w-4 h-4 mr-2" /> Export All
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">
          Department-wise Export
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedByDepartment).map(([dept, list]) => (
            <Card key={dept} className="border border-muted/40 hover:shadow-md">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {dept}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {list.length} teacher{list.length !== 1 && "s"}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => exportGroup(list, dept)}>
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">
          Course-wise Export
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedByCourse).map(([course, list]) => (
            <Card
              key={course}
              className="border border-muted/40 hover:shadow-md"
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {course}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {list.length} teacher{list.length !== 1 && "s"}
                    </p>
                  </div>
                  <Button size="sm" onClick={() => exportGroup(list, course)}>
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
