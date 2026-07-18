"use client";

import { useState, useTransition } from "react";
import { toggleCompanyTarget } from "@/app/dashboard/companies/actions";
import { Check, Loader2 } from "lucide-react";

export function CompanyChip({
  companyId,
  name,
  initiallyTargeted,
}: {
  companyId: string;
  name: string;
  initiallyTargeted: boolean;
}) {
  const [targeted, setTargeted] = useState(initiallyTargeted);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    const next = !targeted;
    setTargeted(next); // optimistic
    startTransition(async () => {
      const result = await toggleCompanyTarget(companyId, !next);
      if (!result.success) {
        setTargeted(!next); // revert on failure
      }
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full border transition-colors disabled:opacity-60 ${
        targeted
          ? "bg-teal-600 border-teal-600 text-white"
          : "bg-white border-slate-300 text-slate-600 hover:border-slate-400"
      }`}
    >
      {isPending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : targeted ? (
        <Check className="size-3.5" />
      ) : null}
      {name}
    </button>
  );
}
