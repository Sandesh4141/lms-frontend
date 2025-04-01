"use client";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState<any>({
    course_name: "",
    description: "",
    department_id: "",
  });
  const [departments, setDepartments] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);
  const [linkedSubjects, setLinkedSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [creatingSubject, setCreatingSubject] = useState(false);

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/admin/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const fallback = {
        course_name: "",
        description: "",
        department_id: "",
      };
      setCourse({ ...fallback, ...res.data });
    } catch (error) {
      toast.error("Failed to load course info ❌");
    }
  };

  const fetchDepartments = async () => {
    const res = await axios.get("http://localhost:5000/admin/departments", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDepartments(res.data);
  };

  const fetchExtras = async () => {
    const [subRes, stuRes, instRes, allSubRes] = await Promise.all([
      axios.get(`http://localhost:5000/admin/courses/${id}/subjects`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`http://localhost:5000/admin/courses/${id}/students`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`http://localhost:5000/admin/courses/${id}/instructors`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("http://localhost:5000/admin/subjects", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);
    const linked = subRes.data.map((s: any) => s.id);
    setLinkedSubjects(linked);
    setSelectedSubjects(linked);
    setAllSubjects(allSubRes.data);
    setStudents(stuRes.data);
    setInstructors(instRes.data);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();

    if (!course.course_name?.trim()) {
      toast.error("Course name is required");
      return;
    }

    if (!course.department_id) {
      toast.error("Please select a department");
      return;
    }

    setUpdating(true);
    try {
      await axios.put(
        `http://localhost:5000/admin/courses/${id}`,
        {
          course_name: course.course_name,
          description: course.description,
          department_id: course.department_id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.put(
        `http://localhost:5000/admin/courses/${id}/subjects`,
        { subjectIds: selectedSubjects },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Course updated successfully ✅");
      navigate("/admin/courses");
    } catch (err) {
      toast.error("Failed to update course ❌");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    Promise.all([fetchCourse(), fetchDepartments(), fetchExtras()])
      .catch(() => toast.error("Failed to load course details ❌"))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !course) {
    return (
      <div className="space-y-3 p-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Edit Course</h2>
        <Button variant="outline" onClick={() => navigate("/admin/courses")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
        </Button>
      </div>

      <form onSubmit={handleUpdate} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Course Name</Label>
            <Input
              value={course.course_name}
              onChange={(e) =>
                setCourse({ ...course, course_name: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={course.department_id?.toString()}
              onValueChange={(value) =>
                setCourse({ ...course, department_id: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.program_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={course.description}
            onChange={(e) =>
              setCourse({ ...course, description: e.target.value })
            }
          />
        </div>

        {/* Subject Selection */}
        <div className="space-y-2">
          <Label>Subjects under this course</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allSubjects.map((subject) => {
              const isLinked = linkedSubjects.includes(subject.id);
              const isSelected = selectedSubjects.includes(subject.id);
              return (
                <div
                  key={subject.id}
                  className={`rounded border p-3 text-sm cursor-pointer transition duration-150 shadow-sm flex items-center justify-between ${
                    isSelected
                      ? "bg-blue-100 border-blue-500"
                      : "bg-muted hover:bg-muted/70"
                  }`}
                  onClick={() => {
                    setSelectedSubjects((prev) =>
                      isSelected
                        ? prev.filter((id) => id !== subject.id)
                        : [...prev, subject.id]
                    );
                  }}
                >
                  <span>{subject.subject_name}</span>
                  {isLinked && (
                    <Badge variant="outline">Previously Linked</Badge>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-4">
            <Input
              placeholder="Add new subject"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
            />
            <Button
              type="button"
              disabled={creatingSubject || !newSubjectName.trim()}
              onClick={async () => {
                setCreatingSubject(true);
                try {
                  const res = await axios.post(
                    "http://localhost:5000/admin/subjects",
                    { subject_name: newSubjectName },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  toast.success("Subject created ✅");
                  setAllSubjects((prev) => [...prev, res.data]);
                  setSelectedSubjects((prev) => [...prev, res.data.id]);
                  setNewSubjectName("");
                } catch (err) {
                  toast.error("Failed to create subject ❌");
                } finally {
                  setCreatingSubject(false);
                }
              }}
            >
              Add
            </Button>
          </div>
        </div>

        <Button type="submit" disabled={updating} className="w-full">
          {updating ? "Updating..." : "Update Course"}
        </Button>
      </form>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
        <Card>
          <CardHeader>
            <CardTitle>Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{linkedSubjects.length}</p>
            <p className="text-muted-foreground text-sm">
              Originally linked subjects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{students.length}</p>
            <p className="text-muted-foreground text-sm">Enrolled students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Instructors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            {instructors.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                No instructors assigned.
              </p>
            ) : (
              instructors.map((i) => <Badge key={i.id}>{i.name}</Badge>)
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default EditCourse;
