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
import { toast } from "sonner";

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admin/teachers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeachers(res.data);
    } catch (err) {
      toast.error("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await axios.delete(`http://localhost:5000/admin/teachers/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      toast.success("Teacher deleted successfully ✅");
      fetchTeachers();
    } catch (err) {
      toast.error("Failed to delete teacher ❌");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const filtered = teachers.filter((t) =>
    `${t.name} ${t.email} ${t.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Teachers</h2>
        <Button onClick={() => navigate("/admin/teachers/add-teacher")}>
          Add Teacher
        </Button>
      </div>

      <Input
        placeholder="Search by name, email, or department..."
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
        <p className="text-muted-foreground">No teachers found.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((teacher) => (
              <TableRow key={teacher.id}>
                <TableCell>{teacher.name}</TableCell>
                <TableCell>{teacher.email}</TableCell>
                <TableCell>{teacher.phone_number}</TableCell>
                <TableCell>{teacher.department}</TableCell>
                <TableCell>
                  {new Date(teacher.join_date).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/admin/teachers/edit/${teacher.id}`)
                    }
                  >
                    <Pencil size={16} />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteId(teacher.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this teacher?
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
      )}
    </div>
  );
}

export default Teachers;
