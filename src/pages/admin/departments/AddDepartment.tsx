import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Type, Landmark, FileText } from "lucide-react";

export default function AddDepartment() {
  const [programName, setProgramName] = useState("");
  const [programCode, setProgramCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "http://localhost:5000/admin/departments",
        {
          program_name: programName,
          program_code: programCode,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Department created successfully!");
      setProgramName("");
      setProgramCode("");
      setDescription("");
      navigate("/admin/departments");
    } catch (err) {
      toast.error("Failed to create department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1 flex items-center gap-2">
          <Landmark className="w-7 h-7 text-primary" />
          Add Department
        </h1>
        <p className="text-muted-foreground text-sm">
          Fill in the details to add a new department to the system.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
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
            placeholder="e.g., Bachelor of Science"
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
            placeholder="e.g., BSC-IT"
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
            placeholder="Optional. Short overview of the department..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {loading ? "Creating..." : "Add Department"}
        </Button>
      </form>
    </div>
  );
}
