import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ViewTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/admin/teachers/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeacher(res.data);
      } catch (err) {
        console.error("Failed to fetch teacher", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="p-6 max-w-4xl mx-auto text-muted-foreground">
        Teacher not found.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">👩‍🏫 Teacher Details</h1>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="text-xl font-semibold">{teacher.name}</div>
          <div className="text-sm text-muted-foreground">{teacher.email}</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <span className="font-medium">Phone:</span> {teacher.phone_number}
            </div>
            <div>
              <span className="font-medium">Department:</span>{" "}
              {teacher.department}
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium">Join Date:</span>{" "}
              {new Date(teacher.join_date).toLocaleDateString()}
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Badge variant="outline">ID: {teacher.id}</Badge>
            <Badge variant="secondary">📧 {teacher.email}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
