// src/pages/teacher/Subjects.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { toast } from "sonner";

export default function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [file, setFile] = useState<File | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/teacher/subjects").then((res) => {
      setSubjects(res.data.subjects || []);
    });
  }, []);

  const handleUpload = async () => {
    if (!file || !selectedSubject) return;
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `/teacher/subjects/${selectedSubject.id}/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("Material uploaded successfully");
      setFile(null);
    } catch (err) {
      toast.error("Failed to upload material");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">📘 Your Subjects</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.length === 0 ? (
          <p className="text-muted-foreground">No subjects assigned.</p>
        ) : (
          subjects.map((subject) => (
            <Card
              key={subject.id}
              className="shadow hover:shadow-md transition rounded-2xl"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BookOpen className="w-5 h-5" /> {subject.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Subject Code: <strong>{subject.code}</strong>
                </p>
                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedSubject(subject)}
                      >
                        📁 Upload Material
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>
                          Upload Material for {selectedSubject?.name}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Label htmlFor="file">Select File</Label>
                        <Input
                          type="file"
                          id="file"
                          onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                        <Button onClick={handleUpload} disabled={uploading}>
                          {uploading ? "Uploading..." : "Upload"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() =>
                      navigate(`/teacher/assignments?subjectId=${subject.id}`)
                    }
                  >
                    📋 View Assignments
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
