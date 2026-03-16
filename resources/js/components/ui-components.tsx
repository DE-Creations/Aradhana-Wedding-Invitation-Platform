import { ReactNode } from "react";
import { X } from "lucide-react";
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

interface StatsCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "primary" | "success" | "warning" | "destructive" | "info";
}

const variantStyles: Record<string, string> = {
  default: "bg-card border-border",
  primary: "bg-card border-primary/20",
  success: "bg-card border-success/20",
  warning: "bg-card border-warning/20",
  destructive: "bg-card border-destructive/20",
  info: "bg-card border-info/20",
};

const iconBgStyles: Record<string, string> = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
  info: "bg-info/10 text-info",
};

export const StatsCard = ({ icon, label, value, subtitle, variant = "default" }: StatsCardProps) => (
  <div className={`rounded-xl border p-5 shadow-card transition-all hover:shadow-wedding ${variantStyles[variant]}`}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${iconBgStyles[variant]}`}>{icon}</div>
    <p className="text-2xl font-display font-bold text-foreground">{value}</p>
    <p className="text-sm text-muted-foreground font-sans mt-0.5">{label}</p>
    {subtitle && <p className="text-xs text-muted-foreground/70 mt-1">{subtitle}</p>}
  </div>
);

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success border-success/20",
  attending: "bg-success/10 text-success border-success/20",
  approved: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  draft: "bg-warning/10 text-warning border-warning/20",
  declined: "bg-destructive/10 text-destructive border-destructive/20",
  rejected: "bg-destructive/10 text-destructive border-destructive/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
  inactive: "bg-muted text-muted-foreground border-border",
  viewed: "bg-info/10 text-info border-info/20",
  completed: "bg-primary/10 text-primary border-primary/20",
};

export const StatusBadge = ({ status, className = "" }: StatusBadgeProps) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${statusColors[status] || statusColors.pending} ${className}`}>
    {status}
  </span>
);

interface SectionCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export const SectionCard = ({ title, description, children, className = "", action }: SectionCardProps) => (
  <div className={`rounded-xl border border-border bg-card shadow-card ${className}`}>
    <div className="p-5 md:p-6 border-b border-border flex items-center justify-between">
      <div>
        <h3 className="font-display text-lg font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {action}
    </div>
    <div className="p-5 md:p-6">{children}</div>
  </div>
);

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  panelClassName?: string;
  bodyClassName?: string;
  headerClassName?: string;
}

export const Modal = ({ open, onClose, title, children, size = "md", panelClassName = "", bodyClassName = "", headerClassName = "" }: ModalProps) => {
  if (!open) return null;
  const sizeMap = { sm: "max-w-md", md: "max-w-lg", lg: "max-w-2xl", xl: "max-w-4xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative ${sizeMap[size]} w-full bg-card rounded-2xl shadow-wedding border border-border max-h-[90vh] overflow-y-auto ${panelClassName}`}>
        <div className={`flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card rounded-t-2xl z-10 ${headerClassName}`}>
          <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className={`p-5 ${bodyClassName}`}>{children}</div>
      </div>
    </div>
  );
};

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "destructive" | "warning";
}

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  variant = "destructive",
}: ConfirmModalProps) => {
  const isDestructive = variant === "destructive";
  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => { onConfirm(); onClose(); }}
            className={isDestructive
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              : "bg-warning text-warning-foreground hover:bg-warning/90"
            }
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4 text-muted-foreground">{icon}</div>
    <h3 className="font-display text-xl font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
);

interface FormFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  hint?: string;
}

export const FormField = ({ label, children, required, hint }: FormFieldProps) => (
  <div className="space-y-1.5">
    <label className="text-sm font-medium text-foreground font-sans">
      {label}{required && <span className="text-destructive ml-0.5">*</span>}
    </label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);
