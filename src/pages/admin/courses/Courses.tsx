"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash } from "lucide-react";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
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
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">📚 Courses</h1>
          <p className="text-muted-foreground text-sm">
            Manage all academic courses by department and description.
          </p>
        </div>
        <Button onClick={() => navigate("/admin/courses/add-course")}>
          Add Course
        </Button>
      </div>

      <Input
        placeholder="Search by course name, department, or description..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md"
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card className="p-6 text-muted-foreground">No courses found.</Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((course) => (
            <Dialog key={course.id}>
              <DialogTrigger asChild>
                <Card
                  onClick={() => setSelectedCourse(course)}
                  className="hover:shadow-lg transition cursor-pointer border-2 border-muted/30 hover:border-primary group"
                >
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-primary">
                        {course.course_name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {course.department_name}
                      </p>
                    </div>
                    <p className="text-sm text-foreground line-clamp-3">
                      {course.description || "No description provided."}
                    </p>
                    <Button variant="outline" className="mt-2 text-sm">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="text-2xl">
                    {selectedCourse?.course_name}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-2 text-sm mt-4">
                  <p>
                    <span className="font-medium">Department:</span>{" "}
                    {selectedCourse?.department_name}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {selectedCourse?.description || "—"}
                  </p>
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/courses/edit/${selectedCourse.id}`)
                    }
                  >
                    <Pencil size={16} className="mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `http://localhost:5000/admin/courses/${selectedCourse.id}`,
                          {
                            headers: { Authorization: `Bearer ${token}` },
                          }
                        );
                        toast.success("Course deleted successfully ✅");
                        fetchCourses();
                      } catch (err) {
                        toast.error("Failed to delete course ❌");
                      }
                    }}
                  >
                    <Trash size={16} className="mr-1" /> Delete
                  </Button>
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
