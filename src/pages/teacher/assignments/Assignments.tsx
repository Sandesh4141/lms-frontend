// src/pages/teacher/Assignments.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NotebookPen } from "lucide-react";
import { format } from "date-fns";

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [subjectName, setSubjectName] = useState("");
  const [searchParams] = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  useEffect(() => {
    if (subjectId) {
      axios.get(`/teacher/subjects/${subjectId}/assignments`).then((res) => {
        setAssignments(res.data.assignments || []);
      });

      axios.get(`/teacher/subjects/${subjectId}`).then((res) => {
        setSubjectName(res.data.subject?.name || "Subject");
      });
    }
  }, [subjectId]);

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">
        📝 Assignments for {subjectName || "Subject"}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.length === 0 ? (
          <p className="text-muted-foreground">No assignments found.</p>
        ) : (
          assignments.map((assignment) => (
            <Card
              key={assignment.id}
              className="rounded-2xl shadow hover:shadow-md transition"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <NotebookPen className="w-5 h-5" /> {assignment.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>{assignment.description}</p>
                <p>
                  <strong>Due:</strong>{" "}
                  {format(new Date(assignment.due_date), "PPP")}
                </p>
                {assignment.file_url && (
                  <a
                    href={assignment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    📎 View Attached File
                  </a>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
