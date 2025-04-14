import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function EditStudentPage() {
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentId, setStudentId] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      address: "",
      department: "",
      course: "",
      enrollmentYear: "",
    },
  });

  const { watch, reset, handleSubmit } = form;
  const selectedDepartmentId = watch("department");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentRes = await axios.get(
          `http://localhost:5000/admin/students/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const student = studentRes.data;
        setStudentId(student.studentId);
        reset({
          name: student.name,
          email: student.email,
          phone: student.phone,
          dob: student.dob.split("T")[0],
          gender: student.gender,
          address: student.address,
          department: student.department?.toString() || "",
          course: student.course_id?.toString() || "",
          enrollmentYear: student.enrollment_year?.toString() || "2023",
        });

        const deptRes = await axios.get(
          "http://localhost:5000/admin/departments",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDepartments(deptRes.data);
      } catch (err) {
        toast.error("Failed to load student or departments.");
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    if (!selectedDepartmentId) return;
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/admin/courses?departmentId=${selectedDepartmentId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCourses(res.data);
      } catch {
        toast.error("Failed to fetch courses.");
      }
    };
    fetchCourses();
  }, [selectedDepartmentId]);

  const onSubmit = async (data) => {
    if (!data.enrollmentYear) {
      toast.error("Enrollment Year is required.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:5000/admin/students/${id}`,
        { ...data, studentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Student updated successfully!");
      navigate("/admin/students");
    } catch {
      toast.error("Failed to update student.");
    }
  };

  const fillDemoData = () => {
    if (!departments.length) return;
    reset({
      name: "Demo Student",
      email: "demo@example.com",
      phone: "1234567890",
      dob: "2001-01-01",
      gender: "female",
      address: "Demo Street 123",
      department: departments[0]?.id.toString(),
      course: "",
      enrollmentYear: "2023",
    });
    toast("Demo data filled!");
  };

  return (
    <div className="min-h-screen w-full px-4 md:px-8 py-10 bg-background">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Edit Student</h1>
          <Button variant="secondary" onClick={fillDemoData}>
            Fill Demo Data
          </Button>
        </div>

        <FormProvider {...form}>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel>Student ID</FormLabel>
                  <Input value={studentId} disabled />
                </div>
                <FormField
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {departments.map((dept) => (
                              <SelectItem
                                key={dept.id}
                                value={dept.id.toString()}
                              >
                                {dept.program_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select Course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem
                                key={course.id}
                                value={course.id.toString()}
                              >
                                {course.course_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="enrollmentYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enrollment Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => navigate("/admin/students")}
                >
                  Cancel
                </Button>
                <Button type="submit">Update Student</Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </div>
    </div>
  );
}

export default EditStudentPage;
