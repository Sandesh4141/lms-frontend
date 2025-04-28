// src/pages/teacher/SubjectDetails.tsx

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface SubjectType {
  id: number;
  subject_name: string;
  subject_code: string;
  course_name: string;
  credits: number;
}

export default function SubjectDetails() {
  const { id } = useParams();
  const [subject, setSubject] = useState<SubjectType | null>(null);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchSubject = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/teacher/subjects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setSubject(res.data.subject || null);
      } catch (error) {
        console.error("Error fetching subject details:", error);
        toast.error("Failed to fetch subject details");
      } finally {
        setLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6">
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="text-center text-muted-foreground">Subject not found</div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">
        📖 {subject.subject_name}
      </h1>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="overview">📚 Overview</TabsTrigger>
          <TabsTrigger value="materials">📑 Materials</TabsTrigger>
          <TabsTrigger value="assignments">📋 Assignments</TabsTrigger>
          <TabsTrigger value="announcements">📢 Announcements</TabsTrigger>
          <TabsTrigger value="students">🧑‍🎓 Students</TabsTrigger>
          <TabsTrigger value="progress">🎯 Progress</TabsTrigger>

          {/* Locked Future Sections */}
          <Button
            disabled
            variant="outline"
            className="opacity-50 cursor-not-allowed"
          >
            📈 Analytics 🔒
          </Button>
          <Button
            disabled
            variant="outline"
            className="opacity-50 cursor-not-allowed"
          >
            📝 Grades 🔒
          </Button>
          <Button
            disabled
            variant="outline"
            className="opacity-50 cursor-not-allowed"
          >
            🧪 Quiz/Test 🔒
          </Button>
          <Button
            disabled
            variant="outline"
            className="opacity-50 cursor-not-allowed"
          >
            💬 Communication 🔒
          </Button>
          <Button
            disabled
            variant="outline"
            className="opacity-50 cursor-not-allowed"
          >
            📅 Live Classes 🔒
          </Button>
        </TabsList>

        {/* Tabs Content */}
        <div className="mt-6">
          {/* 📚 Overview */}
          <TabsContent value="overview">
            <Card className="p-6 space-y-4">
              <p className="text-muted-foreground">
                🎓 <strong>Course:</strong> {subject.course_name}
              </p>
              <p className="text-muted-foreground">
                🆔 <strong>Subject Code:</strong> {subject.subject_code}
              </p>
              <p className="text-muted-foreground">
                ⭐ <strong>Credits:</strong> {subject.credits}
              </p>
            </Card>
          </TabsContent>

          {/* 📑 Materials */}
          <TabsContent value="materials">
            <div>📑 Materials section coming here...</div>
          </TabsContent>

          {/* 📋 Assignments */}
          <TabsContent value="assignments">
            <div>📋 Assignments section coming here...</div>
          </TabsContent>

          {/* 📢 Announcements */}
          <TabsContent value="announcements">
            <div>📢 Announcements section coming here...</div>
          </TabsContent>

          {/* 🧑‍🎓 Students */}
          <TabsContent value="students">
            <div>🧑‍🎓 Students list coming here...</div>
          </TabsContent>

          {/* 🎯 Progress */}
          <TabsContent value="progress">
            <div>🎯 Progress tracking here...</div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
