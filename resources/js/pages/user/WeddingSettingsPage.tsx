import { useState, useRef } from "react";
import { Save, Upload, GripVertical, X, Image as ImageIcon, CalendarIcon, Clock, Trash2 } from "lucide-react";
import { SectionCard, FormField, ConfirmModal } from "@/components/ui-components";
import { invitationTemplates, typographyOptions } from "@/data/invitationConstants";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchableSelect } from "@/components/ui/searchable-select";
import { cn } from "@/lib/utils";
import { router } from "@inertiajs/react";

type WeddingData = {
  id: string;
  bride_name: string;
  groom_name: string;
  bride_parents_names: string;
  groom_parents_names: string;
  wedding_type_id: string;
  wedding_type_name: string;
  rsvp_deadline: string;
  contact_number_1: string;
  contact_number_2: string;
  template_key: string;
  typography_key: string;
  status: "draft" | "active" | "completed";
  main_image_url: string | null;
};

type GalleryImage = {
  id: string;
  image_url: string;
  sort_order: number;
};

type EventDetails = Record<string, string | boolean>;

interface WeddingSettingsPageProps {
  wedding: WeddingData | null;
  galleryImages: GalleryImage[];
  eventDetails: EventDetails | null;
}

const TimePickerField = ({ value, onChange, label }: { value: string; onChange: (val: string) => void; label: string }) => {
  const [open, setOpen] = useState(false);
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));
  const [h, m] = value.split(":");

  return (
    <FormField label={label}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-input bg-background text-sm text-left",
            !value && "text-muted-foreground"
          )}>
            <Clock className="h-4 w-4 text-muted-foreground" />
            {value || "Select time"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-3 pointer-events-auto" align="start">
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Hour</p>
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {hours.map((hr) => (
                  <button key={hr} type="button" onClick={() => onChange(`${hr}:${m || "00"}`)}
                    className={cn("w-full text-left px-2 py-1 rounded text-sm transition-colors", h === hr ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                    {hr}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Min</p>
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {minutes.map((min) => (
                  <button key={min} type="button" onClick={() => { onChange(`${h || "00"}:${min}`); setOpen(false); }}
                    className={cn("w-full text-left px-2 py-1 rounded text-sm transition-colors", m === min ? "bg-primary text-primary-foreground" : "hover:bg-muted")}>
                    {min}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </FormField>
  );
};

const DatePickerField = ({ value, onChange, label }: { value: string; onChange: (val: string) => void; label: string }) => {
  const [open, setOpen] = useState(false);
  const dateValue = value ? (() => { const [y, m, d] = value.split('-').map(Number); return new Date(y, m - 1, d); })() : undefined;

  return (
    <FormField label={label} required>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button type="button" className={cn(
            "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-input bg-background text-sm text-left",
            !value && "text-muted-foreground"
          )}>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {dateValue ? format(dateValue, "PPP") : "Pick a date"}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={dateValue}
            onSelect={(d) => { if (d) { onChange(format(d, "yyyy-MM-dd")); setOpen(false); } }}
            initialFocus
            className={cn("p-3 pointer-events-auto")}
          />
        </PopoverContent>
      </Popover>
    </FormField>
  );
};

export const WeddingSettingsPage = ({ wedding, galleryImages, eventDetails }: WeddingSettingsPageProps) => {
  const [form, setForm] = useState({
    bride_parents_names: wedding?.bride_parents_names ?? "",
    groom_parents_names: wedding?.groom_parents_names ?? "",
    rsvp_deadline: wedding?.rsvp_deadline ?? "",
    contact_number_1: wedding?.contact_number_1 ?? "",
    contact_number_2: wedding?.contact_number_2 ?? "",
    template_key: wedding?.template_key ?? (invitationTemplates[0]?.key ?? ""),
    typography_key: wedding?.typography_key ?? (typographyOptions[0]?.key ?? ""),
    status: (wedding?.status ?? "draft") as "draft" | "active" | "completed",
  });

  const [eventForm, setEventForm] = useState<Record<string, string | boolean>>(() => {
    if (!eventDetails) return {};
    const { type: _type, ...fields } = eventDetails as { type: string } & Record<string, string | boolean>;
    return fields;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingMain, setIsUploadingMain] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [confirmDeleteMain, setConfirmDeleteMain] = useState(false);
  const mainImageRef = useRef<HTMLInputElement>(null);
  const galleryImageRef = useRef<HTMLInputElement>(null);

  const updateField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateEventField = (field: string, value: string | boolean) => {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    router.post("/settings", { ...form, ...eventForm }, {
      preserveScroll: true,
      onFinish: () => setIsSaving(false),
    });
  };

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingMain(true);
    router.post("/settings/main-image", { main_image: file }, {
      preserveScroll: true,
      forceFormData: true,
      onFinish: () => {
        setIsUploadingMain(false);
        if (mainImageRef.current) mainImageRef.current.value = "";
      },
    });
  };

  const handleGalleryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingGallery(true);
    router.post("/settings/gallery", { image: file }, {
      preserveScroll: true,
      forceFormData: true,
      onFinish: () => {
        setIsUploadingGallery(false);
        if (galleryImageRef.current) galleryImageRef.current.value = "";
      },
    });
  };

  const handleRemoveGalleryImage = (id: string) => {
    router.post(`/settings/gallery/${id}/destroy`, {}, { preserveScroll: true });
  };

  const handleDeleteMainImage = () => {
    router.post('/settings/main-image/destroy', {}, { preserveScroll: true });
  };

  if (!wedding) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground text-sm">
        No wedding found for your account. Please contact your administrator.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <ConfirmModal
        open={confirmDeleteMain}
        onClose={() => setConfirmDeleteMain(false)}
        onConfirm={handleDeleteMainImage}
        title="Remove Main Image"
        description="This will permanently delete your main couple photo. You can upload a new one at any time."
        confirmLabel="Remove Image"
        variant="destructive"
      />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">Wedding Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your wedding details</p>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Couple & Family */}
        <SectionCard title="Couple & Family" description="Names and family details">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField label="Bride Name">
              <div className="px-3 py-2 rounded-lg border border-input bg-muted text-sm text-muted-foreground">
                {wedding.bride_name || "—"}
              </div>
            </FormField>
            <FormField label="Groom Name">
              <div className="px-3 py-2 rounded-lg border border-input bg-muted text-sm text-muted-foreground">
                {wedding.groom_name || "—"}
              </div>
            </FormField>
            <FormField label="Bride's Parents">
              <input value={form.bride_parents_names} onChange={(e) => updateField("bride_parents_names", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </FormField>
            <FormField label="Groom's Parents">
              <input value={form.groom_parents_names} onChange={(e) => updateField("groom_parents_names", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </FormField>
          </div>
        </SectionCard>

        {/* Event Details — type-specific */}
        <SectionCard title="Event Details" description="Date, time, and venue information for your ceremony">
          {wedding.wedding_type_id === "1" && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <DatePickerField label="Event Date" value={(eventForm.event_date as string) ?? ""} onChange={(v) => updateEventField("event_date", v)} />
                <DatePickerField label="RSVP Deadline" value={form.rsvp_deadline} onChange={(v) => updateField("rsvp_deadline", v)} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <TimePickerField label="Start Time" value={(eventForm.start_time as string) ?? "09:00"} onChange={(v) => updateEventField("start_time", v)} />
                <TimePickerField label="Poruwa Time" value={(eventForm.poruwa_time as string) ?? "10:30"} onChange={(v) => updateEventField("poruwa_time", v)} />
                <TimePickerField label="End Time" value={(eventForm.end_time as string) ?? "16:00"} onChange={(v) => updateEventField("end_time", v)} />
              </div>
              <FormField label="Venue">
                <input value={(eventForm.venue as string) ?? ""} onChange={(e) => updateEventField("venue", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
              </FormField>
              <FormField label="Google Maps Link">
                <input value={(eventForm.google_maps_link as string) ?? ""} onChange={(e) => updateEventField("google_maps_link", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="https://maps.google.com/..." />
              </FormField>
            </div>
          )}

          {wedding.wedding_type_id === "2" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_church_ceremony" checked={!!(eventForm.is_church_ceremony)} onChange={(e) => updateEventField("is_church_ceremony", e.target.checked)} className="h-4 w-4 rounded border-input" />
                <label htmlFor="is_church_ceremony" className="text-sm font-medium text-foreground">Include Church Ceremony</label>
              </div>
              {eventForm.is_church_ceremony && (
                <div className="grid md:grid-cols-2 gap-4 pl-6 border-l-2 border-border">
                  <DatePickerField label="Church Date" value={(eventForm.church_event_date as string) ?? ""} onChange={(v) => updateEventField("church_event_date", v)} />
                  <TimePickerField label="Ceremony Time" value={(eventForm.ceremony_time as string) ?? "10:00"} onChange={(v) => updateEventField("ceremony_time", v)} />
                  <FormField label="Church Venue">
                    <input value={(eventForm.church_venue as string) ?? ""} onChange={(e) => updateEventField("church_venue", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                  </FormField>
                  <FormField label="Church Google Maps Link">
                    <input value={(eventForm.church_event_google_maps_link as string) ?? ""} onChange={(e) => updateEventField("church_event_google_maps_link", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="https://maps.google.com/..." />
                  </FormField>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_reception" checked={!!(eventForm.is_reception)} onChange={(e) => updateEventField("is_reception", e.target.checked)} className="h-4 w-4 rounded border-input" />
                <label htmlFor="is_reception" className="text-sm font-medium text-foreground">Include Reception</label>
              </div>
              {eventForm.is_reception && (
                <div className="grid md:grid-cols-2 gap-4 pl-6 border-l-2 border-border">
                  <DatePickerField label="Reception Date" value={(eventForm.reception_event_date as string) ?? ""} onChange={(v) => updateEventField("reception_event_date", v)} />
                  <TimePickerField label="Start Time" value={(eventForm.reception_start_time as string) ?? "18:00"} onChange={(v) => updateEventField("reception_start_time", v)} />
                  <TimePickerField label="End Time" value={(eventForm.reception_end_time as string) ?? "22:00"} onChange={(v) => updateEventField("reception_end_time", v)} />
                  <FormField label="Reception Venue">
                    <input value={(eventForm.reception_venue as string) ?? ""} onChange={(e) => updateEventField("reception_venue", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                  </FormField>
                  <FormField label="Reception Google Maps Link">
                    <input value={(eventForm.reception_event_google_maps_link as string) ?? ""} onChange={(e) => updateEventField("reception_event_google_maps_link", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="https://maps.google.com/..." />
                  </FormField>
                </div>
              )}
              <DatePickerField label="RSVP Deadline" value={form.rsvp_deadline} onChange={(v) => updateField("rsvp_deadline", v)} />
            </div>
          )}

          {wedding.wedding_type_id === "3" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_muhurtham" checked={!!(eventForm.is_muhurtham)} onChange={(e) => updateEventField("is_muhurtham", e.target.checked)} className="h-4 w-4 rounded border-input" />
                <label htmlFor="is_muhurtham" className="text-sm font-medium text-foreground">Include Muhurtham Ceremony</label>
              </div>
              {eventForm.is_muhurtham && (
                <div className="grid md:grid-cols-2 gap-4 pl-6 border-l-2 border-border">
                  <DatePickerField label="Muhurtham Date" value={(eventForm.muhurtham_event_date as string) ?? ""} onChange={(v) => updateEventField("muhurtham_event_date", v)} />
                  <TimePickerField label="Start Time" value={(eventForm.muhurtham_start_time as string) ?? "09:00"} onChange={(v) => updateEventField("muhurtham_start_time", v)} />
                  <TimePickerField label="End Time" value={(eventForm.muhurtham_end_time as string) ?? "11:00"} onChange={(v) => updateEventField("muhurtham_end_time", v)} />
                  <FormField label="Venue">
                    <input value={(eventForm.muhurtham_event_venue as string) ?? ""} onChange={(e) => updateEventField("muhurtham_event_venue", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                  </FormField>
                  <FormField label="Muhurtham Google Maps Link">
                    <input value={(eventForm.muhurtham_event_google_maps_link as string) ?? ""} onChange={(e) => updateEventField("muhurtham_event_google_maps_link", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="https://maps.google.com/..." />
                  </FormField>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_reception" checked={!!(eventForm.is_reception)} onChange={(e) => updateEventField("is_reception", e.target.checked)} className="h-4 w-4 rounded border-input" />
                <label htmlFor="is_reception" className="text-sm font-medium text-foreground">Include Reception</label>
              </div>
              {eventForm.is_reception && (
                <div className="grid md:grid-cols-2 gap-4 pl-6 border-l-2 border-border">
                  <DatePickerField label="Reception Date" value={(eventForm.reception_event_date as string) ?? ""} onChange={(v) => updateEventField("reception_event_date", v)} />
                  <TimePickerField label="Start Time" value={(eventForm.reception_start_time as string) ?? "18:00"} onChange={(v) => updateEventField("reception_start_time", v)} />
                  <FormField label="Reception Venue">
                    <input value={(eventForm.reception_venue as string) ?? ""} onChange={(e) => updateEventField("reception_venue", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                  </FormField>
                  <FormField label="Reception Google Maps Link">
                    <input value={(eventForm.reception_event_google_maps_link as string) ?? ""} onChange={(e) => updateEventField("reception_event_google_maps_link", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="https://maps.google.com/..." />
                  </FormField>
                </div>
              )}
              <DatePickerField label="RSVP Deadline" value={form.rsvp_deadline} onChange={(v) => updateField("rsvp_deadline", v)} />
            </div>
          )}

          {wedding.wedding_type_id === "4" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_nikkah" checked={!!(eventForm.is_nikkah)} onChange={(e) => updateEventField("is_nikkah", e.target.checked)} className="h-4 w-4 rounded border-input" />
                <label htmlFor="is_nikkah" className="text-sm font-medium text-foreground">Include Nikkah Ceremony</label>
              </div>
              {eventForm.is_nikkah && (
                <div className="grid md:grid-cols-2 gap-4 pl-6 border-l-2 border-border">
                  <DatePickerField label="Nikkah Date" value={(eventForm.nikkah_event_date as string) ?? ""} onChange={(v) => updateEventField("nikkah_event_date", v)} />
                  <TimePickerField label="Start Time" value={(eventForm.nikkah_start_time as string) ?? "10:00"} onChange={(v) => updateEventField("nikkah_start_time", v)} />
                  <FormField label="Venue">
                    <input value={(eventForm.nikkah_event_venue as string) ?? ""} onChange={(e) => updateEventField("nikkah_event_venue", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                  </FormField>
                  <FormField label="Nikkah Google Maps Link">
                    <input value={(eventForm.nikkah_event_google_maps_link as string) ?? ""} onChange={(e) => updateEventField("nikkah_event_google_maps_link", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="https://maps.google.com/..." />
                  </FormField>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_reception" checked={!!(eventForm.is_reception)} onChange={(e) => updateEventField("is_reception", e.target.checked)} className="h-4 w-4 rounded border-input" />
                <label htmlFor="is_reception" className="text-sm font-medium text-foreground">Include Reception</label>
              </div>
              {eventForm.is_reception && (
                <div className="grid md:grid-cols-2 gap-4 pl-6 border-l-2 border-border">
                  <DatePickerField label="Reception Date" value={(eventForm.reception_event_date as string) ?? ""} onChange={(v) => updateEventField("reception_event_date", v)} />
                  <TimePickerField label="Start Time" value={(eventForm.reception_start_time as string) ?? "18:00"} onChange={(v) => updateEventField("reception_start_time", v)} />
                  <FormField label="Reception Venue">
                    <input value={(eventForm.reception_venue as string) ?? ""} onChange={(e) => updateEventField("reception_venue", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
                  </FormField>
                  <FormField label="Reception Google Maps Link">
                    <input value={(eventForm.reception_event_google_maps_link as string) ?? ""} onChange={(e) => updateEventField("reception_event_google_maps_link", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" placeholder="https://maps.google.com/..." />
                  </FormField>
                </div>
              )}
              <DatePickerField label="RSVP Deadline" value={form.rsvp_deadline} onChange={(v) => updateField("rsvp_deadline", v)} />
            </div>
          )}

          {!["1","2","3","4"].includes(wedding.wedding_type_id) && (
            <p className="text-sm text-muted-foreground">Event details are not configured. Contact your administrator.</p>
          )}
        </SectionCard>

        {/* Contact Numbers */}
        <SectionCard title="Contact Numbers" description="Numbers guests can use to reach you">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField label="Contact Number 1">
              <input value={form.contact_number_1} onChange={(e) => updateField("contact_number_1", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </FormField>
            <FormField label="Contact Number 2">
              <input value={form.contact_number_2} onChange={(e) => updateField("contact_number_2", e.target.value)} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm" />
            </FormField>
          </div>
        </SectionCard>

        {/* Invitation Selection */}
        <SectionCard title="Invitation Selection" description="Choose your invitation template and typography">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField label="Template">
              <SearchableSelect
                value={form.template_key}
                onChange={(v) => updateField("template_key", v)}
                options={invitationTemplates.map((t) => ({ value: t.key, label: t.name }))}
                searchPlaceholder="Search template..."
                searchable={false}
              />
            </FormField>
            <FormField label="Typography">
              <SearchableSelect
                value={form.typography_key}
                onChange={(v) => updateField("typography_key", v)}
                options={typographyOptions.map((t) => ({ value: t.key, label: t.name }))}
                searchPlaceholder="Search typography..."
                searchable={false}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Wedding Status */}
        <SectionCard title="Wedding Status" description="Set your invitation's visibility status">
          <div className="max-w-xs">
            <FormField label="Status">
              <SearchableSelect
                value={form.status}
                onChange={(v) => updateField("status", v as "draft" | "active" | "completed")}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "active", label: "Active" },
                  { value: "completed", label: "Completed" },
                ]}
                searchable={false}
              />
            </FormField>
          </div>
        </SectionCard>

        {/* Main Image */}
        <SectionCard title="Main Image" description="Your primary couple photo for the invitation">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            {wedding.main_image_url && (
              <div className="relative w-40 h-52 rounded-xl overflow-hidden border border-border shrink-0 group">
                <img src={wedding.main_image_url} alt="Couple" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setConfirmDeleteMain(true)}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-card/90 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </button>
              </div>
            )}
            <div className="flex-1">
              <input ref={mainImageRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" className="hidden" onChange={handleMainImageUpload} />
              <button
                type="button"
                onClick={() => mainImageRef.current?.click()}
                disabled={isUploadingMain}
                className="w-full border-2 border-dashed border-input rounded-xl p-8 text-center hover:border-primary/30 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">
                  {isUploadingMain ? "Uploading..." : "Click to upload main image"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP up to 15MB</p>
              </button>
            </div>
          </div>
        </SectionCard>

        {/* Gallery Images */}
        <SectionCard title="Gallery Images" description="Photos shown in the invitation slider">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {galleryImages.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden border border-border aspect-video">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button type="button" className="p-1.5 rounded-md bg-card/90"><GripVertical className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button type="button" onClick={() => handleRemoveGalleryImage(img.id)} className="p-1.5 rounded-md bg-card/90"><X className="h-3.5 w-3.5 text-destructive" /></button>
                  </div>
                </div>
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-card/90 text-muted-foreground">
                  #{img.sort_order}
                </div>
              </div>
            ))}
            <div
              className="border-2 border-dashed border-input rounded-lg aspect-video flex flex-col items-center justify-center hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => galleryImageRef.current?.click()}
            >
              {isUploadingGallery ? (
                <p className="text-xs text-muted-foreground">Uploading...</p>
              ) : (
                <>
                  <ImageIcon className="h-6 w-6 text-muted-foreground mb-1" />
                  <p className="text-xs text-muted-foreground">Add Photo</p>
                </>
              )}
            </div>
          </div>
          <input ref={galleryImageRef} type="file" accept="image/jpg,image/jpeg,image/png,image/webp" className="hidden" onChange={handleGalleryImageUpload} />
        </SectionCard>
      </div>

      {/* Sticky Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border py-4 px-6 flex justify-end z-50">
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2.5 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity shadow-wedding disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};
