import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash, Pencil } from "lucide-react";

function Students() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/students");
      setStudents(res.data?.students || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteStudent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      fetchStudents(); // Refresh list
    } catch (err) {
      console.error("Failed to delete student", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter(
    (s: any) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
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
      ) : filtered.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Student ID</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((student: any) => (
              <tr key={student.id} className="border-t">
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2">{student.studentId}</td>
                <td className="p-2 space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => alert("Edit form for " + student.name)}
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
