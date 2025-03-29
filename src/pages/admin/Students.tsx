import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

interface Student {
  id: number;
  name: string;
  email: string;
  course_name: string;
}

function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admin/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(res.data?.students || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/admin/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStudents(); // refresh list
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter((s) =>
    `${s.name} ${s.email} ${s.course_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Students</h2>
        <Button onClick={() => navigate("/admin/student/add-student")}>
          Add Student
        </Button>
      </div>

      <Input
        placeholder="Search by name, email, or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="text-muted-foreground">No students found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Course</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.course_name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/student/edit/${student.id}`)
                    }
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteStudent(student.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Students;
