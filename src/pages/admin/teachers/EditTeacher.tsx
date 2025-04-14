import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function EditTeacher() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone_number: "",
    department: "",
  });

  const token = localStorage.getItem("token");

  const fetchTeacher = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/admin/teachers/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setForm(res.data);
    } catch (err) {
      toast.error("Failed to fetch teacher data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/admin/teachers/${id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Teacher updated successfully ✅");
      navigate("/admin/teachers");
    } catch (err) {
      toast.error("Failed to update teacher ❌");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">✏️ Edit Teacher</h2>

      <Card>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="phone_number"
              placeholder="Phone Number"
              value={form.phone_number}
              onChange={handleChange}
              required
            />
            <Input
              name="department"
              placeholder="Department"
              value={form.department}
              onChange={handleChange}
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
