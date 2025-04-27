import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface Subject {
  id: number;
  subject_name: string;
  subject_code: string;
  course_name: string;
  credits: number;
}

export default function Subjects() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/teacher/subjects",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubjects(response.data.subjects || []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleUpload = async () => {
    if (!file || !selectedSubject || !fileName) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", fileName);
      formData.append("description", description);

      await axios.post(
        `/teacher/upload-subject-material/${selectedSubject.id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("🎉 Material uploaded successfully!");
      setFile(null);
      setFileName("");
      setDescription("");
    } catch (err) {
      toast.error("❌ Failed to upload material!");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <Skeleton key={idx} className="h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-8 px-4 sm:px-8 w-full max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-primary mb-2 flex items-center justify-center gap-2">
            📚 Your Subjects
          </h2>
          <p className="text-muted-foreground">
            Explore and manage your teaching journey ✨
          </p>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center text-muted-foreground text-lg mt-10">
            😔 No subjects assigned yet. Please check back later!
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
            {subjects.map((subject) => (
              <Card
                key={subject.id}
                className="flex flex-col justify-between p-6 rounded-2xl bg-card shadow-md hover:shadow-lg transition hover:scale-[1.01]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      {subject.subject_name}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">
                    🎓 <span className="font-semibold">Course:</span>{" "}
                    {subject.course_name}
                  </p>
                  <p className="text-muted-foreground text-sm mb-1">
                    🆔 <span className="font-semibold">Subject Code:</span>{" "}
                    {subject.subject_code || "N/A"}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    ⭐ <span className="font-semibold">Credits:</span>{" "}
                    {subject.credits}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-6 w-full">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2 w-full sm:w-auto"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        📤 Upload
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Upload Material for {selectedSubject?.subject_name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 pt-4">
                        <Label htmlFor="customFileName">File Name</Label>
                        <Input
                          id="customFileName"
                          type="text"
                          placeholder="Enter file name"
                          value={fileName}
                          onChange={(e) => setFileName(e.target.value)}
                        />
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          type="text"
                          placeholder="Optional description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                        <Label htmlFor="file">Select File</Label>
                        <Input
                          id="file"
                          type="file"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <Button
                          onClick={handleUpload}
                          disabled={uploading}
                          className="w-full"
                        >
                          {uploading ? "Uploading..." : "📤 Upload Material"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      navigate(`/teacher/subject/${subject.id}/progress`)
                    }
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    🎯 Progress
                  </Button>
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => navigate(`/teacher/subject/${subject.id}`)}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    📖 Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
