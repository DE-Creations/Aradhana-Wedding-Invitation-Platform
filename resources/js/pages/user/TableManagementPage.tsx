import { useState } from "react";
import { router } from "@inertiajs/react";
import { Plus, Edit, Trash2, Users, UserPlus, AlertTriangle, X } from "lucide-react";
import { SectionCard, StatusBadge, Modal, FormField, EmptyState } from "@/components/ui-components";
import { motion } from "framer-motion";

interface TableGuest {
  id: string;
  guest_name: string;
  attending_count: number;
  rsvp_status: string;
  assigned_count: number;
  assignment_id: string;
}

interface WeddingTable {
  id: string;
  table_name: string;
  seat_count: number;
  created_at: string | null;
  guests: TableGuest[];
  assigned_count: number;
}

interface AllGuest {
  id: string;
  guest_name: string;
  max_attendees: number;
  rsvp_status: string;
  table_id: string | null;
  attending_count: number;
}

interface TableManagementPageProps {
  tables: WeddingTable[];
  guests: AllGuest[];
}

export const TableManagementPage = ({ tables, guests }: TableManagementPageProps) => {
  const [showAdd, setShowAdd] = useState(false);
  const [editTable, setEditTable] = useState<WeddingTable | null>(null);
  const [assignTable, setAssignTable] = useState<WeddingTable | null>(null);
  const [deleteTable, setDeleteTable] = useState<WeddingTable | null>(null);
  const [assignSearch, setAssignSearch] = useState("");

  const [addForm, setAddForm] = useState({ table_name: "", seat_count: 8 });
  const [editForm, setEditForm] = useState({ table_name: "", seat_count: 8 });

  const unassignedGuests = guests.filter((g) => !g.table_id && g.rsvp_status !== "declined");
  const totalSeats = tables.reduce((s, t) => s + t.seat_count, 0);
  const totalAssigned = tables.reduce((s, t) => s + t.assigned_count, 0);

  const handleAddTable = () => {
    router.post("/tables", addForm, {
      onSuccess: () => { setShowAdd(false); setAddForm({ table_name: "", seat_count: 8 }); },
    });
  };

  const openEdit = (table: WeddingTable) => {
    setEditTable(table);
    setEditForm({ table_name: table.table_name, seat_count: table.seat_count });
  };

  const handleEditTable = () => {
    if (!editTable) return;
    router.post(`/tables/${editTable.id}`, editForm, {
      onSuccess: () => setEditTable(null),
    });
  };

  const handleDeleteTable = (id: string) => {
    router.post(`/tables/${id}/destroy`, {}, {
      onSuccess: () => setDeleteTable(null),
    });
  };

  const handleAssign = (guestId: string) => {
    if (!assignTable) return;
    router.post(`/tables/${assignTable.id}/assign`, { guest_id: guestId }, { preserveState: true });
  };

  const handleUnassign = (tableId: string, guestId: string) => {
    router.post(`/tables/${tableId}/unassign`, { guest_id: guestId }, { preserveState: true });
  };

  const filteredAssignGuests = unassignedGuests.filter((g) =>
    g.guest_name.toLowerCase().includes(assignSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Table Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{tables.length} tables · {totalSeats} seats · {totalAssigned} assigned</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 self-start">
          <Plus className="h-4 w-4" /> Add Table
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-display font-bold text-foreground">{tables.length}</p>
          <p className="text-sm text-muted-foreground">Tables</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-display font-bold text-foreground">{totalSeats}</p>
          <p className="text-sm text-muted-foreground">Total Seats</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-display font-bold text-success">{totalAssigned}</p>
          <p className="text-sm text-muted-foreground">Assigned</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4 shadow-card">
          <p className="text-2xl font-display font-bold text-warning">{unassignedGuests.length}</p>
          <p className="text-sm text-muted-foreground">Unassigned Guests</p>
        </div>
      </div>

      {/* Table Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table, i) => {
          const assigned = table.assigned_count;
          const remaining = table.seat_count - assigned;
          const isOverflow = assigned > table.seat_count;
          const progress = Math.min(100, (assigned / table.seat_count) * 100);

          return (
            <motion.div
              key={table.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border bg-card shadow-card p-5 ${isOverflow ? "border-destructive/30" : "border-border"}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground">{table.table_name}</h3>
                  <p className="text-xs text-muted-foreground">{table.seat_count} seats</p>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setAssignTable(table)} className="p-1.5 rounded-md hover:bg-muted"><UserPlus className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button onClick={() => openEdit(table)} className="p-1.5 rounded-md hover:bg-muted"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                  <button onClick={() => setDeleteTable(table)} className="p-1.5 rounded-md hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-2">
                <div className={`h-full rounded-full transition-all ${isOverflow ? "bg-destructive" : "bg-success"}`} style={{ width: `${progress}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{assigned}/{table.seat_count} seats filled</span>
                {isOverflow ? (
                  <span className="text-destructive flex items-center gap-0.5"><AlertTriangle className="h-3 w-3" /> Overflow</span>
                ) : (
                  <span className="text-success">{remaining} remaining</span>
                )}
              </div>

              {/* Assigned guests */}
              {table.guests.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border space-y-1">
                  {table.guests.map((g) => (
                    <div key={g.id} className="flex items-center justify-between py-1">
                      <span className="text-xs text-foreground">{g.guest_name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{g.attending_count} pax</span>
                        <button onClick={() => handleUnassign(table.id, g.id)} className="p-0.5 rounded hover:bg-destructive/10"><X className="h-3 w-3 text-destructive" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Unassigned Guests */}
      {unassignedGuests.length > 0 && (
        <SectionCard title="Unassigned Guests" description={`${unassignedGuests.length} guests need table assignment`}>
          <div className="grid md:grid-cols-2 gap-2">
            {unassignedGuests.map((g) => (
              <div key={g.id} className="flex items-center justify-between py-2 px-3 rounded-lg border border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">{g.guest_name}</p>
                  <p className="text-xs text-muted-foreground">Max {g.max_attendees} attendees</p>
                </div>
                <StatusBadge status={g.rsvp_status} />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* Add Table Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Table">
        <div className="space-y-4">
          <FormField label="Table Name" required><input value={addForm.table_name} onChange={(e) => setAddForm((f) => ({ ...f, table_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="e.g. Head Table" /></FormField>
          <FormField label="Seat Count" required><input type="number" min={1} value={addForm.seat_count} onChange={(e) => setAddForm((f) => ({ ...f, seat_count: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" /></FormField>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancel</button>
            <button onClick={handleAddTable} className="px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium hover:opacity-90">Add Table</button>
          </div>
        </div>
      </Modal>

      {/* Edit/Assign/Delete modals */}
      <Modal open={!!editTable} onClose={() => setEditTable(null)} title="Edit Table">
        {editTable && (
          <div className="space-y-4">
            <FormField label="Table Name"><input value={editForm.table_name} onChange={(e) => setEditForm((f) => ({ ...f, table_name: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" /></FormField>
            <FormField label="Seat Count"><input type="number" value={editForm.seat_count} onChange={(e) => setEditForm((f) => ({ ...f, seat_count: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" /></FormField>
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <button onClick={() => setEditTable(null)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted">Cancel</button>
              <button onClick={handleEditTable} className="px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium hover:opacity-90">Save</button>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!assignTable} onClose={() => { setAssignTable(null); setAssignSearch(""); }} title={`Assign Guests to ${assignTable?.table_name || ""}`} size="lg">
        <div className="space-y-3">
          <input value={assignSearch} onChange={(e) => setAssignSearch(e.target.value)} placeholder="Search guests..." className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
          {filteredAssignGuests.map((g) => (
            <div key={g.id} className="flex items-center justify-between py-2 px-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
              <div>
                <p className="text-sm font-medium text-foreground">{g.guest_name}</p>
                <p className="text-xs text-muted-foreground">{g.attending_count} attendees · {g.rsvp_status}</p>
              </div>
              <button onClick={() => handleAssign(g.id)} className="px-3 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium hover:bg-primary/20 transition-colors">Assign</button>
            </div>
          ))}
          {filteredAssignGuests.length === 0 && <p className="text-sm text-muted-foreground text-center py-6">All guests are assigned!</p>}
        </div>
      </Modal>

      <Modal open={!!deleteTable} onClose={() => setDeleteTable(null)} title="Delete Table" size="sm">
        {deleteTable && (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">Delete <strong className="text-foreground">{deleteTable.table_name}</strong>?</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteTable(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
              <button onClick={() => handleDeleteTable(deleteTable.id)} className="px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm hover:opacity-90">Delete</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
