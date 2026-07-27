"use client";

import { useState, useTransition } from "react";
import { toggleCompanyTarget } from "@/app/dashboard/companies/actions";
import { Check, Loader2 } from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

export function CompanyChip({
  companyId,
  name,
  initiallyTargeted,
}: {
  companyId: string;
  name: string;
  initiallyTargeted: boolean;
}) {
  const [targeted, setTargeted]      = useState(initiallyTargeted);
  const [isPending, startTransition] = useTransition();
  const { notify }                   = useNotifications();

  function handleClick() {
    const next = !targeted;
    setTargeted(next);

    startTransition(async () => {
      const result = await toggleCompanyTarget(companyId, !next);
      if (!result.success) {
        setTargeted(!next);
      } else {
        if (next) {
          notify({
            type: "success",
            icon: "🎯",
            title: `Targeted ${name}!`,
            body: `Recommended DSA practice topics updated for ${name}.`,
            action: { label: "View Practice Topics", href: "/dashboard/prep" },
            autoDismiss: 4000,
          });
        }
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 disabled:opacity-60 active:scale-95 cursor-pointer"
      style={
        targeted
          ? {
              background: "linear-gradient(135deg, var(--orange) 0%, #fb923c 100%)",
              color: "#fff",
              border: "1px solid transparent",
              boxShadow: "0 2px 8px rgba(249,115,22,0.30)",
            }
          : {
              background: "var(--bg-surface-2)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-strong)",
            }
      }
    >
      {isPending ? (
        <Loader2 className="size-3 animate-spin" />
      ) : targeted ? (
        <Check className="size-3" />
      ) : null}
      {name}
    </button>
  );
}
