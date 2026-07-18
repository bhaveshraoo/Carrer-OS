"use client";

import { useState, useTransition } from "react";
import { toggleCompanyTarget } from "./actions";
import { Button } from "@/components/ui/button";
import { Target, Check, Loader2 } from "lucide-react";

export function TargetButton({
  companyId,
  initiallyTargeted,
}: {
  companyId: string;
  initiallyTargeted: boolean;
}) {
  const [targeted, setTargeted] = useState(initiallyTargeted);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    setError("");
    const next = !targeted;
    setTargeted(next); // optimistic
    startTransition(async () => {
      const result = await toggleCompanyTarget(companyId, !next);
      if (!result.success) {
        setTargeted(!next); // revert
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  return (
    <div>
      <Button
        variant={targeted ? "primary" : "outline"}
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : targeted ? (
          <Check className="size-4" />
        ) : (
          <Target className="size-4" />
        )}
        {targeted ? "Targeting this company" : "Target this company"}
      </Button>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}
