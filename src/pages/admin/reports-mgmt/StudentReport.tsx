import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Users } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import * as XLSX from "xlsx";

export default function StudentReport() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/students", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.students || [];
      setStudents(data);
    } catch (err) {
      console.error("Failed to fetch students", err);
      setStudents([]);
    }
  };

  const filtered = Array.isArray(students)
    ? students.filter((s) =>
        `${s.first_name} ${s.last_name}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    : [];

  const courseData = Object.entries(
    students.reduce((acc, s) => {
      acc[s.course_name] = (acc[s.course_name] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  const departmentData = Object.entries(
    students.reduce((acc, s) => {
      acc[s.department_name] = (acc[s.department_name] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const groupedByCourse = students.reduce((acc, student) => {
    const course = student.course_name || "Unknown";
    if (!acc[course]) acc[course] = [];
    acc[course].push(student);
    return acc;
  }, {});

  const groupedByDepartment = students.reduce((acc, student) => {
    const dept = student.department_name || "Unknown";
    if (!acc[dept]) acc[dept] = [];
    acc[dept].push(student);
    return acc;
  }, {});

  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7f50",
    "#8dd1e1",
    "#d0ed57",
  ];

  const exportGroup = (group, name) => {
    const ws = XLSX.utils.json_to_sheet(group);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    XLSX.writeFile(wb, `${name}_students.xlsx`);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Users className="w-7 h-7 text-primary" /> Student Reports
        </h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => exportGroup(filtered, "All_Students")}>
            Export All
          </Button>
        </div>
      </div>

      {/* Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            📊 Course-wise Enrollment
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={courseData}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">
            🏫 Department Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {departmentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Department Export Cards */}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-foreground">
          Department-wise Export
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedByDepartment).map(([dept, list]) => (
            <Card
              key={dept}
              className="border border-primary/30 hover:shadow-md"
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-primary">
                      {dept}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {list.length} student{list.length !== 1 && "s"}
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

      {/* Course Export Cards */}
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
                      {list.length} student{list.length !== 1 && "s"}
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
