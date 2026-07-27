"use client";

import { useState, useTransition } from "react";
import { toggleCompanyTarget } from "./actions";
import { Button } from "@/components/ui/button";
import { Target, Check, Loader2 } from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

export function TargetButton({
  companyId,
  companyName = "Company",
  initiallyTargeted,
}: {
  companyId: string;
  companyName?: string;
  initiallyTargeted: boolean;
}) {
  const [targeted, setTargeted]      = useState(initiallyTargeted);
  const [isPending, startTransition] = useTransition();
  const [error, setError]            = useState("");
  const { notify }                   = useNotifications();

  function handleClick() {
    setError("");
    const next = !targeted;
    setTargeted(next);

    startTransition(async () => {
      const result = await toggleCompanyTarget(companyId, !next);
      if (!result.success) {
        setTargeted(!next);
        setError(result.error ?? "Something went wrong.");
      } else {
        if (next) {
          notify({
            type: "success",
            icon: "🎯",
            title: `Targeted ${companyName}!`,
            body: `DSA topics and PYQ practice roadmap updated for ${companyName}.`,
            action: { label: "Practice DSA", href: "/dashboard/prep" },
            autoDismiss: 5000,
          });
        } else {
          notify({
            type: "info",
            icon: "ℹ️",
            title: `Removed ${companyName}`,
            body: `Updated your target companies list.`,
            autoDismiss: 3000,
          });
        }
      }
    });
  }

  return (
    <div>
      <Button
        variant={targeted ? "primary" : "outline"}
        onClick={handleClick}
        disabled={isPending}
        size="sm"
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : targeted ? (
          <Check className="size-3.5" />
        ) : (
          <Target className="size-3.5" />
        )}
        {targeted ? "Targeted" : "Target Company"}
      </Button>
      {error && (
        <p className="text-xs mt-2" style={{ color: "var(--red)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
