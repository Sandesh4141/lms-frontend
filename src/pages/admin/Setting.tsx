import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";

export default function AdminSettings() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [notifyDashboard, setNotifyDashboard] = useState(true);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:5000/admin/admin-settings/profile",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setFullName(res.data.name);
      setPhoneNumber(res.data.phone_number || "");
      setEmail(res.data.username);
      if (res.data.profile_image) {
        setPreviewUrl(`http://localhost:5000${res.data.profile_image}`);
      }
    } catch (err) {
      toast.error("Failed to load admin profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("full_name", fullName);
      formData.append("phone_number", phoneNumber);
      if (profileImage) formData.append("profile_image", profileImage);

      const res = await axios.put(
        "http://localhost:5000/admin/admin-settings/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success(res.data.message || "Profile updated ✅");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed ❌");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match ❌");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/admin/admin-settings/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(res.data.message || "Password updated ✅");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Password update failed ❌");
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold mb-4">⚙️ Admin Settings</h1>

      {/* Admin Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>👤 Admin Profile</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Username</label>
            <Input
              value={email}
              readOnly
              className="opacity-70 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone Number</label>
            <Input
              placeholder="Enter phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Profile Picture</label>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 w-32 h-32 rounded-full object-cover border"
              />
            )}
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Change Password</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Input
                  placeholder="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button className="w-full" onClick={handleChangePassword}>
                  Update Password
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <div className="pt-4">
            <Button className="w-full" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* System Preferences Section (Temporarily Inaccessible) */}
      <Card className="opacity-60 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" /> Under Development
        </div>
        <CardHeader>
          <CardTitle>⚙️ System Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pointer-events-none select-none">
          <div>
            <label className="block text-sm mb-1">Default Language</label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm mb-1">Date Format</label>
            <Select value={dateFormat} onValueChange={setDateFormat}>
              <SelectTrigger>
                <SelectValue placeholder="Select Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm mb-1">
              Notification Preferences
            </label>
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <Switch checked={notifyEmail} onCheckedChange={setNotifyEmail} />
            </div>
            <div className="flex items-center justify-between">
              <span>SMS Notifications</span>
              <Switch checked={notifySMS} onCheckedChange={setNotifySMS} />
            </div>
            <div className="flex items-center justify-between">
              <span>Dashboard Alerts</span>
              <Switch
                checked={notifyDashboard}
                onCheckedChange={setNotifyDashboard}
              />
            </div>
          </div>

          <div className="pt-4">
            <Button className="w-full" disabled>
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="opacity-60 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" /> Under Development
        </div>
        <CardHeader>
          <CardTitle>🏫 Institute Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pointer-events-none select-none">
          <Input placeholder="Institute Name" disabled />
          <Input type="file" disabled />
          <Input placeholder="Contact Email" disabled />
          <Input placeholder="Phone Number" disabled />
          <Input placeholder="Address" disabled />
          <div className="flex gap-4">
            <Input placeholder="Academic Year Start" type="date" disabled />
            <Input placeholder="Academic Year End" type="date" disabled />
          </div>
          <Input
            placeholder="Default Semesters per Course"
            type="number"
            disabled
          />
          <div>
            <label className="block text-sm mb-1">Working Days & Hours</label>
            <Input placeholder="e.g. Mon–Fri 9am–4pm" disabled />
          </div>
        </CardContent>
      </Card>
      <Card className="opacity-60 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" /> Under Development
        </div>
        <CardHeader>
          <CardTitle>🔐 Security & Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pointer-events-none select-none">
          <Input
            placeholder="Password Policy (e.g., min 8 chars, special char)"
            disabled
          />
          <Input
            placeholder="View Activity Logs (Login IP, Time, Device)"
            disabled
          />
          <Input placeholder="Manage Admins & Roles" disabled />
          <div className="flex justify-between items-center">
            <span>Allow Student Self-Registration</span>
            <Switch disabled checked />
          </div>
        </CardContent>
      </Card>

      {/* Backup & Data Management */}
      <Card className="opacity-60 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" /> Under Development
        </div>
        <CardHeader>
          <CardTitle>💾 Backup & Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pointer-events-none select-none">
          <Button className="w-full" disabled>
            Export All Data
          </Button>
          <Button className="w-full" disabled>
            Manual DB Backup
          </Button>
          <Button className="w-full" disabled>
            Reset Demo/Test Data
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="opacity-60 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" /> Under Development
        </div>
        <CardHeader>
          <CardTitle>🔔 Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pointer-events-none select-none">
          <Input placeholder="Announcement Email Template" disabled />
          <Input placeholder="SMTP/Twilio Config" disabled />
          <div className="flex justify-between items-center">
            <span>Student Reminders</span>
            <Switch disabled checked />
          </div>
        </CardContent>
      </Card>

      {/* Feature Toggles */}
      <Card className="opacity-60 relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Lock className="w-4 h-4" /> Under Development
        </div>
        <CardHeader>
          <CardTitle>🧪 Feature Toggles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pointer-events-none select-none">
          <div className="flex justify-between items-center">
            <span>Enable Grading Module</span>
            <Switch disabled checked />
          </div>
          <div className="flex justify-between items-center">
            <span>Enable Certificate Generation</span>
            <Switch disabled checked />
          </div>
          <div className="flex justify-between items-center">
            <span>Enable Subject-wise Attendance</span>
            <Switch disabled checked />
          </div>
          <div className="flex justify-between items-center">
            <span>Enable Course Feedback Form</span>
            <Switch disabled checked />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
