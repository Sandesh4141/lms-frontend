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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash, Pencil, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Students() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const token = localStorage.getItem("token");

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admin/students", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStudents(res.data?.students || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:5000/admin/students/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      toast.success("Student deleted successfully ✅");
      fetchStudents();
    } catch (err) {
      console.error("Failed to delete student", err);
      toast.error("Failed to delete student ❌");
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
    <div className="p-2 md:p-5 max-w-8xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold tracking-tight">🎓 Students</h2>
        <Button onClick={() => navigate("/admin/student/add-student")}>
          Add Student
        </Button>
      </div>

      <Input
        placeholder="Search by name, email, or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-md"
      />

      {loading ? (
        <Card className="p-2 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-6">
          <p className="text-muted-foreground">No students found.</p>
        </Card>
      ) : (
        <Card className="border shadow-sm">
          <CardContent className="p-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[25%]">Name</TableHead>
                  <TableHead className="w-[30%]">Email</TableHead>
                  <TableHead className="w-[25%]">Course</TableHead>
                  <TableHead className="text-right w-[20%]">Actions</TableHead>
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
                          navigate(`/admin/student/view/${student.id}`)
                        }
                      >
                        <Eye size={16} className="mr-1" />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() =>
                          navigate(`/admin/student/edit/${student.id}`)
                        }
                      >
                        <Pencil size={16} className="mr-1" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeleteId(student.id)}
                          >
                            <Trash size={16} className="mr-1" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this student?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmDelete}>
                              Yes, Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
