import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Plus, FileText, Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function AnnouncementListPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/announcements", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAnnouncements(res.data);
    } catch (err) {
      toast.error("Failed to fetch announcements");
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/admin/announcements/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Announcement deleted");
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
      setDeletingId(null);
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filteredAnnouncements = announcements.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary" /> Announcements
        </h1>
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64"
          />
          <Button onClick={() => navigate("new")}>
            <Plus className="w-4 h-4 mr-2" /> New
          </Button>
        </div>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <p className="text-muted-foreground text-center">
          No announcements found.
        </p>
      ) : (
        <div className="border rounded-md divide-y bg-white dark:bg-muted/40 overflow-hidden">
          {filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className="p-4 flex justify-between items-start hover:bg-muted/30 transition"
            >
              <div className="space-y-1">
                <h2 className="text-base font-medium text-foreground">
                  {item.title}
                </h2>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {item.message}
                </p>
                {item.file_path && (
                  <a
                    href={`/uploads/${item.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View Attachment
                  </a>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 text-right">
                <p className="text-xs text-muted-foreground">
                  {new Date(item.created_at).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`${item.id}/edit`)}
                    className="gap-1"
                  >
                    <Pencil className="w-4 h-4" /> Edit
                  </Button>
                  <AlertDialog
                    open={deletingId === item.id}
                    onOpenChange={(open) => !open && setDeletingId(null)}
                  >
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeletingId(item.id)}
                        className="gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete "{item.title}"?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteAnnouncement(item.id)}
                        >
                          Yes, Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
