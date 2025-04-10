import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, School } from "lucide-react";

export default function DepartmentList() {
  const [departments, setDepartments] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  useEffect(() => {
    fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDepartments(res.data);
    } catch (err) {
      toast.error("Failed to fetch departments");
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/departments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Department deleted");
      setDepartments(departments.filter((d) => d.id !== id));
      setDeletingId(null);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <School className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Manage Departments
          </h1>
        </div>
        <Button onClick={() => navigate("new")} className="flex gap-2">
          <Plus className="w-4 h-4" />
          Add Department
        </Button>
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.length === 0 ? (
          <p className="text-muted-foreground">No departments found.</p>
        ) : (
          departments.map((dept) => (
            <div
              key={dept.id}
              className="rounded-2xl border p-5 shadow-sm hover:shadow-md transition duration-200 bg-white dark:bg-muted/40 flex flex-col justify-between h-full"
            >
              {/* Info */}
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {dept.program_name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {dept.program_code}
                </p>
                {dept.description && (
                  <p className="text-sm text-muted-foreground">
                    {dept.description}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => navigate(`${dept.id}`)}
                >
                  <Eye className="w-4 h-4" />
                  View
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => navigate(`${dept.id}/edit`)}
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>

                <AlertDialog
                  open={deletingId === dept.id}
                  onOpenChange={(open) => !open && setDeletingId(null)}
                >
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => setDeletingId(dept.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete{" "}
                        <span className="font-bold">{dept.program_name}</span>?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. It will permanently delete
                        this department.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => deleteDepartment(dept.id)}
                      >
                        Yes, Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
