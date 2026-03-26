import { useState } from "react";
import { Plus, Search, Edit, Trash2, Power, Users as UsersIcon, CalendarIcon, Eye, EyeOff, Pencil } from "lucide-react";
import { StatsCard, StatusBadge, SectionCard, FormField, EmptyState } from "@/components/ui-components";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "deactive" | "expired";
  expire_date: string;
  created_at: string;
  updated_at: string;
  table_management: boolean;
  share_memory: boolean;
  image_count: number;
};
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchableSelect, type SelectOption } from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";
import { router, usePage } from "@inertiajs/react";

type WeddingSummary = {
    id: string;
    bride_name: string;
    groom_name: string;
    wedding_type_id: string;
    wedding_type_name: string;
    event_token: string;
    status: string;
};

type CreateUserFormState = {
    name: string;
    email: string;
    password: string;
    phone: string;
    status: "active" | "deactive" | "expired";
    expire_date: string;
    bride_name: string;
    groom_name: string;
    wedding_type_id: string;
    table_management: boolean;
    share_memory: boolean;
    image_count: 20 | 30;
};

type EditUserFormState = {
    id: string;
    name: string;
    email: string;
    password: string;
    phone: string;
    status: "active" | "deactive" | "expired";
    expire_date: string;
    bride_name: string;
    groom_name: string;
    wedding_type_id: string;
    table_management: boolean;
    share_memory: boolean;
    image_count: 20 | 30;
};

const DatePickerField = ({
    value,
    onChange,
    label,
    required = false,
}: {
    value: string;
    onChange: (val: string) => void;
    label: string;
    required?: boolean;
}) => {
    const dateValue = value ? new Date(value) : undefined;

    return (
        <FormField label={label} required={required}>
            <Popover>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        className={cn(
                            "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-input bg-background text-sm text-left",
                            !value && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        {dateValue ? format(dateValue, "PPP") : "Pick a date"}
                    </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={dateValue}
                        onSelect={(d) => d && onChange(format(d, "yyyy-MM-dd"))}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                    />
                </PopoverContent>
            </Popover>
        </FormField>
    );
};

export const AdminUsersPage = ({
    users: initialUsers = [],
    weddingsByUserId = {},
    weddingTypes = [],
}: {
    users: User[];
    weddingsByUserId: Record<string, WeddingSummary>;
    weddingTypes: { id: string; name: string }[];
}) => {
    const { errors } = usePage<{ errors: Record<string, string> }>().props;
    const users = initialUsers;
    const [search, setSearch] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [isSubmittingCreate, setIsSubmittingCreate] = useState(false);
    const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const [changeEditPassword, setChangeEditPassword] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [togglingUserId, setTogglingUserId] = useState<string | null>(null);
    const [createForm, setCreateForm] = useState<CreateUserFormState>({
        name: "",
        email: "",
        password: "",
        phone: "",
        status: "active",
        expire_date: "",
        bride_name: "",
        groom_name: "",
        wedding_type_id: "",
        table_management: false,
        share_memory: false,
        image_count: 20,
    });
    const [editForm, setEditForm] = useState<EditUserFormState | null>(null);

    const filtered = users.filter((u) => {
        const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === "all" || u.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const handleDelete = (id: string) => {
        const userId = String(id ?? "").trim();

        if (!userId) {
            return;
        }

        router.post(`/admin/users/${encodeURIComponent(userId)}/destroy`, { user_id: userId }, {
            preserveState: false,
            preserveScroll: true,
            onStart: () => {
                setDeletingUserId(userId);
            },
            onFinish: () => {
                setDeletingUserId(null);
                setDeleteUser(null);
            },
        });
    };

    const toggleStatus = (id: string) => {
        router.post(`/admin/users/${id}/status`, {}, {
            preserveState: false,
            preserveScroll: true,
            onStart: () => {
                setTogglingUserId(id);
            },
            onFinish: () => {
                setTogglingUserId(null);
            },
        });
    };

    const openEditModal = (user: User) => {
        const wedding = weddingsByUserId[user.id];

        setEditUser(user);
        setEditForm({
            id: user.id,
            name: user.name,
            email: user.email,
            password: "",
            phone: user.phone,
            status: user.status,
            expire_date: user.expire_date || "",
            bride_name: wedding?.bride_name ?? "",
            groom_name: wedding?.groom_name ?? "",
            wedding_type_id: wedding?.wedding_type_id ?? "",
            table_management: user.table_management ?? false,
            share_memory: user.share_memory ?? false,
            image_count: (user.image_count === 30 ? 30 : 20) as 20 | 30,
        });
    };

    const closeEditModal = () => {
        setEditUser(null);
        setEditForm(null);
        setShowEditPassword(false);
        setChangeEditPassword(false);
    };

    const updateEditField = <K extends keyof EditUserFormState>(field: K, value: EditUserFormState[K]) => {
        setEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    };

    const handleUpdateUser = () => {
        if (!editForm || !editUser || !editForm.id) {
            return;
        }

        setIsSubmittingEdit(true);

        router.post(`/admin/users/${editForm.id}`, { ...editForm }, {
            preserveState: false,
            onSuccess: () => {
                closeEditModal();
            },
            onFinish: () => {
                setIsSubmittingEdit(false);
            },
        });
    };

    const updateCreateField = <K extends keyof CreateUserFormState>(field: K, value: CreateUserFormState[K]) => {
        setCreateForm((prev) => ({ ...prev, [field]: value }));
    };

    const resetCreateForm = () => {
        setCreateForm({
            name: "",
            email: "",
            password: "",
            phone: "",
            status: "active",
            expire_date: "",
            bride_name: "",
            groom_name: "",
            wedding_type_id: "",
            table_management: false,
            share_memory: false,
            image_count: 20,
        });
        setShowCreatePassword(false);
    };

    const handleCreateUser = () => {
        setIsSubmittingCreate(true);
        router.post("/admin/users", createForm, {
            preserveState: false,
            forceFormData: true,
            onSuccess: () => {
                resetCreateForm();
                setShowCreateModal(false);
            },
            onFinish: () => {
                setIsSubmittingCreate(false);
            },
        });
    };

    const statusOptions: SelectOption[] = [
        { value: "active", label: "Active" },
        { value: "deactive", label: "Inactive" },
        { value: "expired", label: "Expired" },
    ];

    const filterStatusOptions: SelectOption[] = [
        { value: "all", label: "All Status" },
        ...statusOptions,
    ];

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Users Management</h1>
                    <p className="text-sm text-muted-foreground mt-1">Manage wedding account holders</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity self-start"
                >
                    <Plus className="h-4 w-4" />
                    Create User
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        autoComplete="off"
                        className="w-full pl-9 pr-4 py-2 rounded-lg border border-input bg-card text-sm outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary"
                    />
                </div>
                <SearchableSelect
                    value={filterStatus}
                    onChange={setFilterStatus}
                    options={filterStatusOptions}
                    searchable={false}
                    triggerClassName="sm:w-48 bg-card"
                />
            </div>

            {/* Table */}
            <SectionCard title="Users" description={`${filtered.length} user${filtered.length !== 1 ? "s" : ""} found`}>
                {filtered.length === 0 ? (
                    <EmptyState icon={<UsersIcon className="h-8 w-8" />} title="No users found" description="Try adjusting your search or filter criteria." />
                ) : (
                    <div className="overflow-x-auto -mx-5 md:-mx-6">
                        <table className="w-full text-sm min-w-[800px]">
                            <thead>
                                <tr className="border-b border-border">
                                    {["Name", "Email", "Phone", "Status", "Expire Date", "Bride & Groom", "Wedding Type", "Event Token", "Actions"].map((h) => (
                                        <th key={h} className="text-left py-3 px-3 font-medium text-muted-foreground font-body text-xs uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((user, i) => {
                                    const wedding = weddingsByUserId[user.id];
                                    return (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.03 }}
                                            className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="py-3 px-3 font-medium text-foreground">{user.name}</td>
                                            <td className="py-3 px-3 text-muted-foreground">{user.email}</td>
                                            <td className="py-3 px-3 text-muted-foreground">{user.phone}</td>
                                            <td className="py-3 px-3"><StatusBadge status={user.status} /></td>
                                            <td className="py-3 px-3 text-muted-foreground">{user.expire_date}</td>
                                            <td className="py-3 px-3 text-muted-foreground">{wedding ? `${wedding.bride_name} & ${wedding.groom_name}` : "—"}</td>
                                            <td className="py-3 px-3 text-muted-foreground">{wedding?.wedding_type_name || "—"}</td>
                                            <td className="py-3 px-3 text-muted-foreground font-mono text-xs">{wedding?.event_token || "—"}</td>
                                            <td className="py-3 px-3">
                                                <div className="flex items-center gap-1">
                                                    <button onClick={() => openEditModal(user)} className="p-1.5 rounded-md hover:bg-muted transition-colors" title="Edit">
                                                        <Edit className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </button>
                                                    <button
                                                        onClick={() => toggleStatus(user.id)}
                                                        disabled={togglingUserId === user.id || deletingUserId === user.id}
                                                        className="p-1.5 rounded-md hover:bg-muted transition-colors disabled:opacity-50"
                                                        title="Toggle Status"
                                                    >
                                                        <Power className="h-3.5 w-3.5 text-muted-foreground" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteUser(user)}
                                                        disabled={deletingUserId === user.id || togglingUserId === user.id}
                                                        className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                                    </button>
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

            {/* Create User Modal */}
            <Dialog open={showCreateModal} onOpenChange={(v) => !v && setShowCreateModal(false)}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
                <DialogHeader>
                  <DialogTitle>Create User</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                    {/* User Account */}
                    <div className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-5">
                        <h4 className="font-display text-base font-semibold text-foreground border-b border-border pb-2">User Account Details</h4>
                        <FormField label="Name" required>
                            <input
                                value={createForm.name}
                                onChange={(e) => updateCreateField("name", e.target.value)}
                                autoComplete="off"
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                placeholder="Full name"
                            />
                            {errors?.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                        </FormField>
                        <FormField label="Email" required>
                            <input
                                type="email"
                                value={createForm.email}
                                onChange={(e) => updateCreateField("email", e.target.value)}
                                autoComplete="off"
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                placeholder="email@example.com"
                            />
                            {errors?.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                        </FormField>
                        <FormField label="Password" required>
                            <div className="relative">
                                <input
                                    type={showCreatePassword ? "text" : "password"}
                                    value={createForm.password}
                                    onChange={(e) => updateCreateField("password", e.target.value)}
                                    autoComplete="new-password"
                                    className="w-full px-3 py-2 pr-10 rounded-lg border border-input bg-background text-sm"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCreatePassword((prev) => !prev)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                                    title={showCreatePassword ? "Hide password" : "Show password"}
                                >
                                    {showCreatePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {(errors?.password || (createForm.password.length > 0 && createForm.password.length < 8)) && (
                                <p className="text-xs text-destructive mt-1">{errors?.password ?? "Password must be at least 8 characters."}</p>
                            )}
                        </FormField>
                        <FormField label="Phone" required>
                            <input
                                value={createForm.phone}
                                onChange={(e) => updateCreateField("phone", e.target.value)}
                                maxLength={10}
                                autoComplete="off"
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                placeholder="+94 7X XXX XXXX"
                            />
                            {errors?.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                        </FormField>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Status">
                                <SearchableSelect
                                    value={createForm.status}
                                    onChange={(v) => updateCreateField("status", v as CreateUserFormState["status"])}
                                    searchPlaceholder="Search status..."
                                    options={statusOptions.filter((s) => s.value !== "expired")}
                                    searchable={false}
                                />
                            </FormField>
                            <DatePickerField
                                label="Expire Date"
                                value={createForm.expire_date}
                                onChange={(v) => updateCreateField("expire_date", v)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Table Management">
                                <div className="flex gap-2">
                                    {([true, false] as const).map((val) => (
                                        <button
                                            key={String(val)}
                                            type="button"
                                            onClick={() => updateCreateField("table_management", val)}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                                                createForm.table_management === val
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-input bg-background text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            {val ? "Yes" : "No"}
                                        </button>
                                    ))}
                                </div>
                            </FormField>
                            <FormField label="Share Memory">
                                <div className="flex gap-2">
                                    {([true, false] as const).map((val) => (
                                        <button
                                            key={String(val)}
                                            type="button"
                                            onClick={() => updateCreateField("share_memory", val)}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                                                createForm.share_memory === val
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-input bg-background text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            {val ? "Yes" : "No"}
                                        </button>
                                    ))}
                                </div>
                            </FormField>
                        </div>
                        {createForm.share_memory && (
                            <FormField label="Image Count">
                                <div className="flex gap-2">
                                    {([20, 30] as const).map((val) => (
                                        <button
                                            key={val}
                                            type="button"
                                            onClick={() => updateCreateField("image_count", val)}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                                                createForm.image_count === val
                                                    ? "border-primary bg-primary text-primary-foreground"
                                                    : "border-input bg-background text-muted-foreground hover:bg-muted"
                                            )}
                                        >
                                            {val}
                                        </button>
                                    ))}
                                </div>
                            </FormField>
                        )}
                    </div>

                    {/* Wedding Setup */}
                    <div className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-5">
                        <h4 className="font-display text-base font-semibold text-foreground border-b border-border pb-2">Wedding Setup</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <FormField label="Bride Name">
                                <input
                                    value={createForm.bride_name}
                                    onChange={(e) => updateCreateField("bride_name", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                />
                                {errors?.bride_name && <p className="text-xs text-destructive mt-1">{errors.bride_name}</p>}
                            </FormField>
                            <FormField label="Groom Name">
                                <input
                                    value={createForm.groom_name}
                                    onChange={(e) => updateCreateField("groom_name", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                />
                                {errors?.groom_name && <p className="text-xs text-destructive mt-1">{errors.groom_name}</p>}
                            </FormField>
                        </div>
                        <FormField label="Wedding Type">
                            <SearchableSelect
                                value={createForm.wedding_type_id}
                                onChange={(v) => updateCreateField("wedding_type_id", v)}
                                searchPlaceholder="Search type..."
                                options={weddingTypes.map((wt) => ({ value: wt.id, label: wt.name }))}
                                searchable={false}
                            />
                            {errors?.wedding_type_id && <p className="text-xs text-destructive mt-1">{errors.wedding_type_id}</p>}
                        </FormField>
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
                    <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                    <button
                        onClick={handleCreateUser}
                        disabled={isSubmittingCreate}
                        className="px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                    >
                        {isSubmittingCreate ? "Creating..." : "Create User"}
                    </button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit User Modal */}
            <Dialog open={!!editUser} onOpenChange={(v) => !v && closeEditModal()}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
                <DialogHeader>
                  <DialogTitle>Edit User — {editUser?.name ?? ""}</DialogTitle>
                </DialogHeader>
                {editForm && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* User Account */}
                        <div className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-5">
                            <h4 className="font-display text-base font-semibold text-foreground border-b border-border pb-2">User Account Details</h4>
                            <FormField label="Name" required>
                                <input
                                    value={editForm.name}
                                    onChange={(e) => updateEditField("name", e.target.value)}
                                    autoComplete="off"
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                    placeholder="Full name"
                                />
                                {errors?.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                            </FormField>
                            <FormField label="Email" required>
                                <input
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => updateEditField("email", e.target.value)}
                                    autoComplete="off"
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                    placeholder="email@example.com"
                                />
                                {errors?.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                            </FormField>
                            <FormField label="Password">
                                {changeEditPassword ? (
                                    <div className="space-y-1.5">
                                        <div className="relative">
                                            <input
                                                type={showEditPassword ? "text" : "password"}
                                                value={editForm.password}
                                                onChange={(e) => updateEditField("password", e.target.value)}
                                                autoComplete="new-password"
                                                className="w-full px-3 py-2 pr-10 rounded-lg border border-input bg-background text-sm"
                                                placeholder="Enter new password"
                                                autoFocus
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowEditPassword((prev) => !prev)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground"
                                                title={showEditPassword ? "Hide password" : "Show password"}
                                            >
                                                {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { setChangeEditPassword(false); updateEditField("password", ""); setShowEditPassword(false); }}
                                            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            ✕ Cancel password change
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between px-3 py-2 rounded-lg border border-input bg-muted/40">
                                        <span className="text-sm text-muted-foreground tracking-widest select-none">••••••••</span>
                                        <button
                                            type="button"
                                            onClick={() => setChangeEditPassword(true)}
                                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                            title="Set new password"
                                        >
                                            <Pencil className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                )}
                                {(errors?.password || (changeEditPassword && editForm.password.length > 0 && editForm.password.length < 8)) && (
                                    <p className="text-xs text-destructive mt-1">{errors?.password ?? "Password must be at least 8 characters."}</p>
                                )}
                            </FormField>
                            <FormField label="Phone" required>
                                <input
                                    value={editForm.phone}
                                    onChange={(e) => updateEditField("phone", e.target.value)}
                                    maxLength={10}
                                    autoComplete="off"
                                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                    placeholder="+94 7X XXX XXXX"
                                />
                                {errors?.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                            </FormField>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Status">
                                    <SearchableSelect
                                        value={editForm.status}
                                        onChange={(v) => updateEditField("status", v as EditUserFormState["status"])}
                                        searchPlaceholder="Search status..."
                                        options={statusOptions}
                                        searchable={false}
                                    />
                                </FormField>
                                <DatePickerField
                                    label="Expire Date"
                                    value={editForm.expire_date}
                                    onChange={(v) => updateEditField("expire_date", v)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Table Management">
                                    <div className="flex gap-2">
                                        {([true, false] as const).map((val) => (
                                            <button
                                                key={String(val)}
                                                type="button"
                                                onClick={() => updateEditField("table_management", val)}
                                                className={cn(
                                                    "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                                                    editForm.table_management === val
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                {val ? "Yes" : "No"}
                                            </button>
                                        ))}
                                    </div>
                                </FormField>
                                <FormField label="Share Memory">
                                    <div className="flex gap-2">
                                        {([true, false] as const).map((val) => (
                                            <button
                                                key={String(val)}
                                                type="button"
                                                onClick={() => updateEditField("share_memory", val)}
                                                className={cn(
                                                    "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                                                    editForm.share_memory === val
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                {val ? "Yes" : "No"}
                                            </button>
                                        ))}
                                    </div>
                                </FormField>
                            </div>
                            {editForm.share_memory && (
                                <FormField label="Image Count">
                                    <div className="flex gap-2">
                                        {([20, 30] as const).map((val) => (
                                            <button
                                                key={val}
                                                type="button"
                                                onClick={() => updateEditField("image_count", val)}
                                                className={cn(
                                                    "flex-1 py-2 rounded-lg border text-sm font-medium transition-colors",
                                                    editForm.image_count === val
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-input bg-background text-muted-foreground hover:bg-muted"
                                                )}
                                            >
                                                {val}
                                            </button>
                                        ))}
                                    </div>
                                </FormField>
                            )}
                        </div>

                        {/* Wedding Setup */}
                        <div className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-5">
                            <h4 className="font-display text-base font-semibold text-foreground border-b border-border pb-2">Wedding Setup</h4>
                            <div className="grid grid-cols-2 gap-3">
                                <FormField label="Bride Name">
                                    <input
                                        value={editForm.bride_name}
                                        onChange={(e) => updateEditField("bride_name", e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                    />
                                    {errors?.bride_name && <p className="text-xs text-destructive mt-1">{errors.bride_name}</p>}
                                </FormField>
                                <FormField label="Groom Name">
                                    <input
                                        value={editForm.groom_name}
                                        onChange={(e) => updateEditField("groom_name", e.target.value)}
                                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
                                    />
                                    {errors?.groom_name && <p className="text-xs text-destructive mt-1">{errors.groom_name}</p>}
                                </FormField>
                            </div>
                            <FormField label="Wedding Type">
                                <SearchableSelect
                                    value={editForm.wedding_type_id}
                                    onChange={(v) => updateEditField("wedding_type_id", v)}
                                    searchPlaceholder="Search type..."
                                    options={weddingTypes.map((wt) => ({ value: wt.id, label: wt.name }))}
                                    searchable={false}
                                />
                                {errors?.wedding_type_id && <p className="text-xs text-destructive mt-1">{errors.wedding_type_id}</p>}
                            </FormField>
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-border">
                            <button
                                type="button"
                                onClick={closeEditModal}
                                className="px-4 py-2 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleUpdateUser}
                                disabled={isSubmittingEdit}
                                className="px-4 py-2 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
                            >
                                {isSubmittingEdit ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                )}
              </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <AlertDialog open={!!deleteUser} onOpenChange={(v) => !v && setDeleteUser(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deleteUser?.name}</strong>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteUser(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => deleteUser && handleDelete(deleteUser.id)}
                            disabled={deletingUserId === deleteUser?.id}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-60"
                        >
                            {deletingUserId === deleteUser?.id ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};
