import { useState, useRef } from "react";
import { router } from "@inertiajs/react";
import { Plus, Search, Edit, Trash2, Copy, Users, AlertTriangle, ArrowUpDown, FileSpreadsheet, Download, Upload, X as XIcon } from "lucide-react";
import { SectionCard, StatusBadge, FormField, EmptyState } from "@/components/ui-components";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";

interface Guest {
  id: string;
  guest_name: string;
  phone: string;
  max_attendees: number;
  rsvp_status: string;
  attending_count: number;
  invitation_opened_at: string | null;
  rsvp_clicked_at: string | null;
  responded_at: string | null;
  table_id: string | null;
  table_name: string | null;
  guest_token: string;
}

interface TableOption {
  id: string;
  table_name: string;
}

interface GuestManagementPageProps {
  guests: Guest[];
  tables: TableOption[];
  event_token: string;
  bride_name: string;
  groom_name: string;
}

export const GuestManagementPage = ({ guests, tables, event_token, bride_name, groom_name }: GuestManagementPageProps) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortAZ, setSortAZ] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);
  const [editGuest, setEditGuest] = useState<Guest | null>(null);
  const [deleteGuest, setDeleteGuest] = useState<Guest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Add form state
  const [addForm, setAddForm] = useState({ guest_name: "", phone: "", max_attendees: 2 });
  // Edit form state
  const [editForm, setEditForm] = useState({ guest_name: "", phone: "", max_attendees: 2 });

  let filtered = guests.filter((g) => {
    const matchSearch = g.guest_name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || g.rsvp_status === filter;
    return matchSearch && matchFilter;
  });
  if (sortAZ) filtered = [...filtered].sort((a, b) => a.guest_name.localeCompare(b.guest_name));

  const handleDownloadTemplate = () => {
    const bom = "\uFEFF";
    const header = "Guest Name,Phone,Max Attendees\n";
    const example = "Nimal & Family,+94 71 234 5678,4\nKumari Perera,+94 77 987 6543,2\n";
    const blob = new Blob([bom + header + example], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "guest_import_template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    if (!importFile) return;
    setIsImporting(true);
    router.post("/guests/import", { csv_file: importFile }, {
      forceFormData: true,
      onSuccess: () => {
        setShowImport(false);
        setImportFile(null);
        if (importFileRef.current) importFileRef.current.value = "";
      },
      onFinish: () => setIsImporting(false),
    });
  };

  const handleCopyLink = (guest: Guest) => {
    const link = `${window.location.origin}/invitation/${event_token}?guest=${guest.guest_token}`;
    const message = `Dear ${guest.guest_name},\n\nWe are delighted to invite you to celebrate our wedding with us. Your presence on this special day would mean so much to us as we begin this beautiful new chapter together.\n\nPlease join us for the celebration and kindly confirm your attendance through the invitation link below.\n\nInvitation Link: ${link}\n\nWe look forward to sharing this joyful occasion with you.\n\nWith love,\n${bride_name} & ${groom_name}`;
    navigator.clipboard.writeText(message);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAdd = () => {
    router.post("/guests", addForm, {
      onSuccess: () => { setShowAdd(false); setAddForm({ guest_name: "", phone: "", max_attendees: 2 }); },
    });
  };

  const handleEdit = () => {
    if (!editGuest) return;
    router.post(`/guests/${editGuest.id}`, editForm, {
      onSuccess: () => setEditGuest(null),
    });
  };

  const handleDelete = (id: string) => {
    router.post(`/guests/${id}/destroy`, {}, {
      onSuccess: () => setDeleteGuest(null),
    });
  };

  const openEdit = (guest: Guest) => {
    setEditGuest(guest);
    setEditForm({ guest_name: guest.guest_name, phone: guest.phone, max_attendees: guest.max_attendees });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Guest Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{guests.length} guests total</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5">
            <FileSpreadsheet className="h-3.5 w-3.5" /> Import
          </button>
          <button
            onClick={() => { window.location.href = '/guests/export'; }}
            className="px-3 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button onClick={() => setShowAdd(true)} className="px-3 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity">
            <Plus className="h-3.5 w-3.5" /> Add Guest
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search guests..." className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-ring/20" />
        </div>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-input bg-card text-sm">
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="attending">Attending</option>
          <option value="declined">Declined</option>
          <option value="viewed">Viewed</option>
        </select>
        <button onClick={() => setSortAZ(!sortAZ)} className={`px-3 py-2 rounded-lg border text-sm flex items-center gap-1.5 transition-colors ${sortAZ ? "border-primary bg-primary/5 text-primary" : "border-input hover:bg-muted"}`}>
          <ArrowUpDown className="h-3.5 w-3.5" /> A-Z
        </button>
      </div>

      {/* Guest Table */}
      <SectionCard title="Guests" description={`${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}>
        {filtered.length === 0 ? (
          <EmptyState icon={<Users className="h-8 w-8" />} title="No guests found" description="Try adjusting your search or filter." />
        ) : (
          <div className="overflow-x-auto -mx-5 md:-mx-6">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-border">
                  {["Guest Name", "Phone", "Max", "RSVP", "Attending", "Opened", "Clicked", "Responded", "Table", "Link", "Actions"].map((h) => (
                    <th key={h} className="text-left py-3 px-3 font-medium text-muted-foreground font-body text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((guest, i) => {
                  const isOverLimit = guest.attending_count > guest.max_attendees;
                  return (
                    <motion.tr
                      key={guest.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`border-b border-border/50 transition-colors ${isOverLimit ? "bg-destructive/5" : "hover:bg-muted/30"}`}
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{guest.guest_name}</span>
                          {isOverLimit && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20">
                              <AlertTriangle className="h-2.5 w-2.5" /> Over Limit
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">{guest.phone}</td>
                      <td className="py-3 px-3 text-muted-foreground">{guest.max_attendees}</td>
                      <td className="py-3 px-3"><StatusBadge status={guest.rsvp_status} /></td>
                      <td className="py-3 px-3 text-muted-foreground">{guest.attending_count}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">{guest.invitation_opened_at?.split(" ")[0] || "—"}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">{guest.rsvp_clicked_at?.split(" ")[0] || "—"}</td>
                      <td className="py-3 px-3 text-muted-foreground text-xs">{guest.responded_at?.split(" ")[0] || "—"}</td>
                      <td className="py-3 px-3 text-muted-foreground">{guest.table_name || "—"}</td>
                      <td className="py-3 px-3">
                        <button onClick={() => handleCopyLink(guest)} className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                          <Copy className="h-3 w-3" /> {copiedId === guest.id ? "Copied!" : "Copy"}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(guest)} className="p-1.5 rounded-md hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                          <button onClick={() => setDeleteGuest(guest)} className="p-1.5 rounded-md hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Import Dialog */}
      <AlertDialog open={showImport} onOpenChange={(v) => { if (!v) { setShowImport(false); setImportFile(null); } }}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Import Guests from CSV</AlertDialogTitle>
            <AlertDialogDescription>Upload a CSV file with columns: Guest Name, Phone, Max Attendees.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            {/* Template download */}
            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/40 border border-border">
              <FileSpreadsheet className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">CSV Format</p>
                <p className="text-xs text-muted-foreground mt-0.5">Columns: <span className="font-mono">Guest Name, Phone, Max Attendees</span></p>
              </div>
              <button
                onClick={handleDownloadTemplate}
                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-muted transition-colors"
              >
                <Download className="h-3.5 w-3.5" /> Template
              </button>
            </div>

            {/* File drop zone */}
            <div>
              <input
                ref={importFileRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => setImportFile(e.target.files?.[0] ?? null)}
              />
              <button
                type="button"
                onClick={() => importFileRef.current?.click()}
                className="w-full border-2 border-dashed border-input rounded-xl p-8 text-center hover:border-primary/40 transition-colors"
              >
                <Upload className="h-7 w-7 text-muted-foreground mx-auto mb-2" />
                {importFile ? (
                  <p className="text-sm font-medium text-foreground">{importFile.name}</p>
                ) : (
                  <p className="text-sm font-medium text-muted-foreground">Click to select a CSV file</p>
                )}
              </button>
              {importFile && (
                <button
                  onClick={() => { setImportFile(null); if (importFileRef.current) importFileRef.current.value = ""; }}
                  className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                >
                  <XIcon className="h-3 w-3" /> Remove file
                </button>
              )}
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => { setShowImport(false); setImportFile(null); }}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleImport}
              disabled={!importFile || isImporting}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
            >
              <Upload className="h-3.5 w-3.5" />
              {isImporting ? "Importing..." : "Import Guests"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Guest Dialog */}
      <AlertDialog open={showAdd} onOpenChange={(v) => !v && setShowAdd(false)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Add Guest</AlertDialogTitle>
            <AlertDialogDescription>Fill in the details below to add a new guest to your list.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Guest Name" required><input value={addForm.guest_name} onChange={(e) => setAddForm((f) => ({ ...f, guest_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="e.g. Nimal & Family" /></FormField>
            <FormField label="Phone"><input value={addForm.phone} onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))} maxLength={10} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="+94 7X XXX XXXX" /></FormField>
            <FormField label="Max Attendees" required><input type="number" min={1} value={addForm.max_attendees} onChange={(e) => setAddForm((f) => ({ ...f, max_attendees: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" /></FormField>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAdd(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAdd}
              className="bg-gradient-gold text-primary-foreground hover:opacity-90"
            >
              Add Guest
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Guest Dialog */}
      <AlertDialog open={!!editGuest} onOpenChange={(v) => !v && setEditGuest(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Guest</AlertDialogTitle>
            <AlertDialogDescription>Update the guest details below.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <FormField label="Guest Name"><input value={editForm.guest_name} onChange={(e) => setEditForm((f) => ({ ...f, guest_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" /></FormField>
            <FormField label="Phone"><input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} maxLength={10} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" /></FormField>
            <FormField label="Max Attendees"><input type="number" value={editForm.max_attendees} onChange={(e) => setEditForm((f) => ({ ...f, max_attendees: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" /></FormField>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditGuest(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEdit} className="bg-gradient-gold text-primary-foreground hover:opacity-90">Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteGuest} onOpenChange={(v) => !v && setDeleteGuest(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Guest</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteGuest?.guest_name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteGuest(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteGuest && handleDelete(deleteGuest.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
