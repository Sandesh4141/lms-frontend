import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";
import StudentDashboard from "@/pages/student/StudentDashboard";
import DashboardLayout from "@/components/layout/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import Students from "@/pages/admin/students/Students";
import Teachers from "@/pages/admin/teachers/Teachers";
import Courses from "@/pages/admin/courses/Courses";
import EditCourse from "@/pages/admin/courses/EditCourse";
import Announcements from "@/pages/admin/announcements/Announcements";
import CreateAnnouncementPage from "@/pages/admin/announcements/CreateAnnouncement";
import EditAnnouncementPage from "@/pages/admin/announcements/EditAnnouncement";
import Reports from "@/pages/admin/reports/Reports";
import Settings from "@/pages/admin/Setting";
import AddStudentPage from "@/pages/admin/students/AddStudent";
import EditStudentPage from "@/pages/admin/students/EditStudentPage";
import ViewStudent from "@/pages/admin/students/ViewStudent";
import AddTeacherPage from "@/pages/admin/teachers/AddTeacher";
import Departments from "@/pages/admin/departments/DepartmentsList";
import AddDepartment from "@/pages/admin/departments/AddDepartment";

import Subjects from "@/pages/teacher/subjects/Subjects";
import SubjectDetails from "@/pages/teacher/subjects/SubjectDetails";

import Assignments from "@/pages/teacher/assignments/Assignments";
import EditDepartment from "@/pages/admin/departments/EditDepartment";
import StudentReport from "@/pages/admin/reports/StudentReport";
import TeacherReport from "@/pages/admin/reports/TeacherReport";
import EditTeacher from "@/pages/admin/teachers/EditTeacher";
import ViewTeacher from "./pages/admin/teachers/ViewTeacher";
export default function App() {
  return (
    <>
      {/*  This can be placed anywhere outside of <Routes /> */}
      <Toaster richColors position="top-right" />

      {/* Routes go inside a fragment */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route
              path="/admin"
              element={<Navigate to="/admin/dashboard" replace />}
            />
            <Route
              path="/admin/student/add-student"
              element={<AddStudentPage />}
            />
            <Route
              path="/admin/student/edit/:id"
              element={<EditStudentPage />}
            />
            <Route path="/admin/student/view/:id" element={<ViewStudent />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              path="/admin/teachers/add-teacher"
              element={<AddTeacherPage />}
            />
            <Route path="/admin/students" element={<Students />} />
            <Route path="/admin/teachers" element={<Teachers />} />
            <Route path="/admin/teachers/edit/:id" element={<EditTeacher />} />
            <Route path="/admin/teachers/view/:id" element={<ViewTeacher />} />
            <Route path="/admin/courses/edit/:id" element={<EditCourse />} />
            <Route path="/admin/courses" element={<Courses />} />

            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/departments/new" element={<AddDepartment />} />
            <Route
              path="/admin/departments/:id/edit"
              element={<EditDepartment />}
            />
            <Route path="/admin/announcements" element={<Announcements />} />
            <Route
              path="/admin/announcements/new"
              element={<CreateAnnouncementPage />}
            />
            <Route
              path="/admin/announcements/:id/edit"
              element={<EditAnnouncementPage />}
            />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/reports/students" element={<StudentReport />} />
            <Route path="/admin/reports/teachers" element={<TeacherReport />} />
            <Route path="/admin/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Teacher */}
        <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/subjects" element={<Subjects />} />
            <Route path="/teacher/subjects/:id" element={<SubjectDetails />} />
            <Route path="/teacher/assignments" element={<Assignments />} />
          </Route>
        </Route>

        {/* Student */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
