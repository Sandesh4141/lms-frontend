import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function AddStudentPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    department: "",
    course: "",
    enrollment_year: "",
    year_of_study: "",
  });

  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [generatedUsername, setGeneratedUsername] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/departments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to load departments", err);
    }
  };

  const fetchCourses = async (departmentId: number) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/departments/${departmentId}/courses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(res.data);
    } catch (err) {
      console.error("Failed to load courses", err);
      setCourses([]);
    }
  };

  const generateUsername = (name: string) => {
    const clean = name.trim().toLowerCase().replace(/\s+/g, ".");
    const rand = Math.floor(100 + Math.random() * 900);
    return `${clean}.${rand}`;
  };

  const generatePassword = () => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!";
    let pwd = "";
    for (let i = 0; i < 10; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const username = generateUsername(form.name);
    const password = generatePassword();

    // Phone number validation
    if (!/^\d{10}$/.test(form.phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/admin/students",
        {
          ...form,
          username,
          password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setGeneratedUsername(username);
      setGeneratedPassword(password);
      setShowModal(true);
    } catch (err) {
      console.error("Error adding student:", err);
      alert("Failed to add student.");
    }
  };

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          Add New Student
        </h2>

        {/* === Personal Info === */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Personal Information
          </h3>
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
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
            <Input
              name="dob"
              type="date"
              placeholder="Date of Birth"
              value={form.dob}
              onChange={handleChange}
            />

            {/* 🔄 Gender Select */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Gender
              </label>
              <Select
                value={form.gender}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, gender: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* === Academic Info === */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Academic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="enrollment_year"
              type="number"
              placeholder="Enrollment Year"
              value={form.enrollment_year}
              onChange={handleChange}
            />
            <Input
              name="year_of_study"
              type="number"
              placeholder="Year of Study"
              value={form.year_of_study}
              onChange={handleChange}
            />

            {/* 🔄 Department Select */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Department
              </label>
              <Select
                value={form.department}
                onValueChange={(value) => {
                  setForm((prev) => ({
                    ...prev,
                    department: value,
                    course: "",
                  }));
                  fetchCourses(parseInt(value));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept: any) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.program_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 🔄 Course Select */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-600 dark:text-gray-300">
                Course
              </label>
              <Select
                value={form.course}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, course: value }))
                }
                disabled={!form.department}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course: any) => (
                    <SelectItem key={course.id} value={String(course.id)}>
                      {course.course_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* === Actions === */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="outline" onClick={() => navigate("/admin/students")}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Student</Button>
        </div>
      </div>

      {/* === Success Modal === */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>🎉 Student Added Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <p>
              <strong>Username:</strong> {generatedUsername}
            </p>
            <p>
              <strong>Password:</strong> {generatedPassword}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => navigate("/admin/students")}>
              Back to List
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddStudentPage;
