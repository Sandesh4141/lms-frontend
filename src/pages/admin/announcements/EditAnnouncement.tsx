import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import axios from "axios";

export default function EditAnnouncementPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [departmentId, setDepartmentId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [file, setFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchAnnouncement();
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (departmentId) fetchCourses(departmentId);
    else setCourses([]);
  }, [departmentId]);

  const fetchAnnouncement = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/announcements/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = res.data;
      setTitle(data.title);
      setMessage(data.message);
      setAudience(data.audience_type);
      setDepartmentId(data.department_id?.toString() || "");
      setCourseId(data.course_id?.toString() || "");
    } catch (err) {
      toast.error("Failed to load announcement");
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/departments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDepartments(res.data);
    } catch (err) {
      toast.error("Failed to load departments");
    }
  };

  const fetchCourses = async (deptId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/departments/${deptId}/courses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCourses(res.data);
    } catch (err) {
      toast.error("Failed to load courses");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("message", message);
    formData.append("audience_type", audience);
    if (audience === "targeted") {
      if (departmentId) formData.append("department_id", departmentId);
      if (courseId) formData.append("course_id", courseId);
    }
    if (file) formData.append("attachment", file);

    try {
      await axios.put(
        `http://localhost:5000/admin/announcements/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Announcement updated");
      navigate("/admin/announcements");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl">✏️ Edit Announcement</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <form onSubmit={handleUpdate} className="space-y-5">
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Message</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students & Teachers</SelectItem>
                  <SelectItem value="targeted">Target Specific</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {audience === "targeted" && (
              <>
                <div className="grid gap-2">
                  <Label>Department</Label>
                  <Select value={departmentId} onValueChange={setDepartmentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => (
                        <SelectItem key={d.id} value={d.id.toString()}>
                          {d.program_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>Course</Label>
                  <Select value={courseId} onValueChange={setCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          {c.course_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <div className="grid gap-2">
              <Label>Replace Attachment (optional)</Label>
              <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
              {file && (
                <p className="text-sm text-muted-foreground mt-1">
                  Selected: <span className="font-medium">{file.name}</span>
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              🔄 Update Announcement
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
