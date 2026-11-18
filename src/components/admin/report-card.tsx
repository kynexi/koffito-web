
import { Badge, type BadgeVariant, Card, type IconName, Text } from "@/components/ui";
import { formatDate } from "@/lib/date";
import type { Report, ReportStatus } from "@/types/koffito";

export type ReportCardProps = {
  report: Report;
  onClick?: () => void;
  animateIn?: boolean | number;
};

export const reportStatusConfig: Record<ReportStatus, { label: string; variant: BadgeVariant; icon: IconName }> = {
  open: { label: "Open", variant: "warning", icon: "alert-circle-outline" },
  reviewing: { label: "In review", variant: "primary", icon: "eye-outline" },
  resolved: { label: "Resolved", variant: "success", icon: "checkmark-circle-outline" },
};

export function ReportCard({ report, onClick, animateIn }: ReportCardProps) {
  const status = reportStatusConfig[report.status];

  return (
    <Card onClick={onClick} animateIn={animateIn} className="gap-2">
      <div className="flex-row items-center justify-between gap-3">
        <Text variant="heading">Report #{report.id.slice(0, 6).toUpperCase()}</Text>
        <Badge label={status.label} variant={status.variant} icon={status.icon} />
      </div>
      <Text variant="label">{report.reason}</Text>
      <Text tone="muted" numberOfLines={2}>
        {report.details}
      </Text>
      <Text variant="caption" tone="muted">
        {formatDate(report.date)} · by {report.reportedBy}
      </Text>
    </Card>
  );
}
