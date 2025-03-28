import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

function AddStudentPage() {
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

  //   const { toast } = useToast();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:5000/admin/students", form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //   toast({
      //     title: "Student added",
      //     description: `Student ${form.name} has been added successfully.`,
      //   });

      navigate("/admin/students"); // go back to students list
    } catch (err) {
      console.error("Error adding student:", err);
      //   toast({
      //     variant: "destructive",
      //     title: "Failed to add student",
      //     description: "Please check the form and try again.",
      //   });
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
      <h2 className="text-2xl font-semibold">Add New Student</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
        />
        <Input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <Input
          name="studentId"
          placeholder="Student ID"
          value={form.studentId}
          onChange={handleChange}
        />
        <Input
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
        />
        <Input
          name="dob"
          placeholder="Date of Birth"
          type="date"
          value={form.dob}
          onChange={handleChange}
        />
        <Input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
        />
        <Input
          name="enrollmentYear"
          placeholder="Enrollment Year"
          type="number"
          value={form.enrollmentYear}
          onChange={handleChange}
        />
        <Input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate("/admin/students")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
    </div>
  );
}

export default AddStudentPage;
