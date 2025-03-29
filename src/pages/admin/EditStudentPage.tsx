import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

function EditStudentPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    studentId: "",
    phone: "",
    dob: "",
    address: "",
    department: "",
    enrollmentYear: "",
  });

  const navigate = useNavigate();
  const { id } = useParams(); // get student ID from URL
  const token = localStorage.getItem("token");

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/admin/students/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setForm(res.data);
      } catch (err) {
        console.error("Failed to load student:", err);
      }
    };

    fetchStudent();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/admin/students/${id}`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Student updated successfully!");
      navigate("/admin/students");
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-2xl font-semibold">Edit Student</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
        <Input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <Input name="studentId" placeholder="Student ID" value={form.studentId} onChange={handleChange} />
        <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
        <Input name="dob" placeholder="Date of Birth" value={form.dob} onChange={handleChange} />
        <Input name="department" placeholder="Department" value={form.department} onChange={handleChange} />
        <Input name="enrollmentYear" placeholder="Enrollment Year" type="number" value={form.enrollmentYear} onChange={handleChange} />
        <Input name="address" placeholder="Address" value={form.address} onChange={handleChange} />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate("/admin/students")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Update</Button>
      </div>
    </div>
  );
}

export default EditStudentPage;
