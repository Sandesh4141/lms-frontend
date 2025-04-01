"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admin/courses", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data);
    } catch (err) {
      toast.error("Failed to fetch courses ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filtered = courses.filter((course) =>
    `${course.course_name} ${course.department_name} ${course.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Courses</h2>
        <Button onClick={() => navigate("/admin/courses/add-course")}>
          Add Course
        </Button>
      </div>

      <Input
        placeholder="Search by name, department, or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No courses found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((course) => (
            <Dialog key={course.id}>
              <DialogTrigger asChild>
                <Card
                  onClick={() => setSelectedCourse(course)}
                  className="cursor-pointer transition hover:shadow-md border border-muted"
                >
                  <CardHeader>
                    <CardTitle className="text-lg">
                      {course.course_name}
                    </CardTitle>
                    <CardDescription>{course.department_name}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{selectedCourse?.course_name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {selectedCourse?.department_name}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedCourse?.description}
                  </p>

                  <div className="flex justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(`/admin/courses/edit/${selectedCourse.id}`)
                      }
                    >
                      <Pencil size={16} className="mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        try {
                          await axios.delete(
                            `http://localhost:5000/admin/courses/${selectedCourse.id}`,
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          toast.success("Course deleted successfully ✅");
                          fetchCourses();
                        } catch (err) {
                          toast.error("Failed to delete course ❌");
                        }
                      }}
                    >
                      <Trash size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;
