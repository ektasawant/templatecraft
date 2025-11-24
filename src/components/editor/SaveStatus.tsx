"use client";

interface Props {
  status: "idle" | "saving" | "saved";
}

export default function SaveStatus({ status }: Props) {
  let label = "Idle";
  let color = "text-foreground/60";

  if (status === "saving") {
    label = "Saving…";
    color = "text-amber-500";
  } else if (status === "saved") {
    label = "Saved";
    color = "text-emerald-500";
  }

  return <span className={`text-xs font-medium ${color}`}>{label}</span>;
}
