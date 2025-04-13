import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Landmark, Type, FileText } from "lucide-react";

export default function EditDepartment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [programName, setProgramName] = useState("");
  const [programCode, setProgramCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/admin/departments/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const dept = res.data;
        setProgramName(dept.program_name);
        setProgramCode(dept.program_code);
        setDescription(dept.description || "");
      } catch (err) {
        toast.error("Failed to load department");
      } finally {
        setLoading(false);
      }
    };

    fetchDepartment();
  }, [id, token]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await axios.put(
        `http://localhost:5000/admin/departments/${id}`,
        {
          programName: programName,
          programCode: programCode,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Department updated successfully!");
      navigate("/admin/departments");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
          <Landmark className="w-7 h-7 text-primary" />
          Edit Department
        </h1>
        <p className="text-muted-foreground text-sm">
          Make changes to the department and save.
        </p>
      </div>

      {loading ? (
        <div className="text-muted-foreground flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading department...
        </div>
      ) : (
        <form
          onSubmit={handleUpdate}
          className="space-y-6 bg-card p-6 rounded-2xl shadow-sm border"
        >
          {/* Program Name */}
          <div className="grid gap-2">
            <Label htmlFor="programName" className="flex items-center gap-2">
              <Type className="w-4 h-4 text-muted-foreground" />
              Program Name
            </Label>
            <Input
              id="programName"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              required
            />
          </div>

          {/* Program Code */}
          <div className="grid gap-2">
            <Label htmlFor="programCode" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Program Code
            </Label>
            <Input
              id="programCode"
              value={programCode}
              onChange={(e) => setProgramCode(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description" className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Update Button */}
          <Button type="submit" className="w-full" disabled={updating}>
            {updating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {updating ? "Updating..." : "Save Changes"}
          </Button>
        </form>
      )}
    </div>
  );
}
