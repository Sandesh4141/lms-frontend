import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Pencil } from "lucide-react";

interface Student {
  id: number;
  name: string;
  email: string;
  studentId: string;
}

function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch all students
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

  // Delete a student
  const deleteStudent = async (id: number) => {
    const confirmed = confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5000/admin/students/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchStudents(); // Refresh the list
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter based on search
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(search.toLowerCase()) ||
      student.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Students</h2>
        <Button onClick={() => alert("Open Add Student Modal")}>
          Add Student
        </Button>
      </div>

      <Input
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="w-full text-sm border rounded-md overflow-hidden">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Student ID</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.id} className="border-t">
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2">{student.studentId}</td>
                <td className="p-2 space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      alert("Edit form for student: " + student.name)
                    }
                  >
                    <Pencil size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteStudent(student.id)}
                  >
                    <Trash size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;
