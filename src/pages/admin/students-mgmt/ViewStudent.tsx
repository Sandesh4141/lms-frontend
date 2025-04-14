import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewStudent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/admin/students/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudent(res.data);
      } catch (err) {
        console.error("Failed to fetch student", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-muted-foreground">
        Student not found.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">👤 Student Details</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-xl font-semibold">{student.name}</div>
          <div className="text-sm text-muted-foreground">{student.email}</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <span className="font-medium">Username:</span> {student.username}
            </div>
            <div>
              <span className="font-medium">Phone:</span> {student.phone}
            </div>
            <div>
              <span className="font-medium">DOB:</span>{" "}
              {new Date(student.dob).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Gender:</span> {student.gender}
            </div>
            <div>
              <span className="font-medium">Enrollment Year:</span>{" "}
              {student.enrollment_year}
            </div>
            <div>
              <span className="font-medium">Year of Study:</span>{" "}
              {student.year_of_study}
            </div>
            <div>
              <span className="font-medium">Course:</span> {student.course_name}
            </div>
            <div>
              <span className="font-medium">Department:</span>{" "}
              {student.department_name}
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium">Address:</span> {student.address}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-4">
            <Badge variant="outline">ID: {student.id}</Badge>
            <Badge variant="secondary">{student.gender}</Badge>
            <Badge variant="default">🎓 {student.year_of_study} Year</Badge>
          </div>

          <div className="text-xs text-muted-foreground pt-4">
            Created: {new Date(student.created_at).toLocaleString()} | Updated:{" "}
            {new Date(student.updated_at).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
