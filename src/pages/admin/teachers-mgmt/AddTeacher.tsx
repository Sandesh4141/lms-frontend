import { useEffect, useState } from "react";
import axios from "axios";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function AddTeacherPage() {
  const [departments, setDepartments] = useState([]);
  const [credentials, setCredentials] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone_number: "",
      gender: "",
      department: "",
      join_date: "",
    },
  });

  const { handleSubmit, reset, setValue, getValues } = form;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/departments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDepartments(res.data);
      } catch {
        toast.error("Failed to fetch departments");
      }
    };
    fetchDepartments();
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      username: data.email.split("@")[0],
      password: `${data.name.split(" ")[0]}@123`,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/admin/teachers",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCredentials({
        username: payload.username,
        password: payload.password,
      });
      toast.success("Teacher added successfully ✅");
      setShowModal(true);
      reset();
      setTimeout(() => navigate("/admin/teachers"), 2000);
    } catch {
      toast.error("Failed to add teacher");
    }
  };

  const getRandomName = () => {
    const names = [
      "Ava Thompson",
      "Liam Jackson",
      "Olivia Reed",
      "Noah Patel",
      "Emma Brooks",
    ];
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomEmail = (name) => {
    const id = Math.floor(1000 + Math.random() * 9000);
    return `${name.split(" ")[0].toLowerCase()}${id}@example.com`;
  };

  const fillDemoData = () => {
    const name = getRandomName();
    const email = getRandomEmail(name);
    const defaultDept = departments[0]?.program_name || "";

    reset({
      name,
      email,
      phone_number: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
      gender: "female",
      department: defaultDept,
      join_date: new Date().toISOString().split("T")[0],
    });
    toast("Demo data filled!");
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 md:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">Add Teacher</h2>
        <Button variant="outline" onClick={fillDemoData}>
          Fill Demo Data
        </Button>
      </div>

      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                name="phone_number"
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
                            <SelectItem key={dept.id} value={dept.program_name}>
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
                name="join_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Join Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate("/admin/teachers")}
              >
                Cancel
              </Button>
              <Button type="submit">Add Teacher</Button>
            </div>
          </form>
        </Form>
      </FormProvider>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Teacher Created</DialogTitle>
            <DialogDescription className="space-y-2">
              <p>Here are the login credentials:</p>
              <p>
                <strong>Username:</strong> {credentials?.username}
              </p>
              <p>
                <strong>Password:</strong> {credentials?.password}
              </p>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddTeacherPage;
