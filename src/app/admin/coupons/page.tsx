"use client";

import { useState } from "react";
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  Percent,
} from "lucide-react";
import { useNotifications } from "@/components/notifications/notification-provider";

interface Coupon {
  id: string;
  code: string;
  discountPct: number;
  maxRedemptions: number;
  usedCount: number;
  status: "Active" | "Expired";
}

const INITIAL_COUPONS: Coupon[] = [
  { id: "c-1", code: "PLACEMENTS2026", discountPct: 50, maxRedemptions: 500, usedCount: 142, status: "Active" },
  { id: "c-2", code: "TOPINTERN100", discountPct: 100, maxRedemptions: 50, usedCount: 24, status: "Active" },
];

export default function AdminCouponsPage() {
  const { notify } = useNotifications();
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [code, setCode] = useState("");
  const [discountPct, setDiscountPct] = useState(50);
  const [maxRedemptions, setMaxRedemptions] = useState(100);

  function handleCreateCoupon(e: React.FormEvent) {
    e.preventDefault();
    const newC: Coupon = {
      id: `c-${Date.now()}`,
      code: code.toUpperCase(),
      discountPct: Number(discountPct),
      maxRedemptions: Number(maxRedemptions),
      usedCount: 0,
      status: "Active",
    };
    setCoupons([newC, ...coupons]);
    setCode("");
    notify({
      type: "success",
      icon: "🏷️",
      title: "Promo Coupon Published!",
      body: `Coupon "${newC.code}" is now live for ${newC.discountPct}% OFF!`,
      autoDismiss: 3500,
    });
  }

  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header Banner */}
      <div className="surface border border-orange-500/30 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl bg-gradient-to-br from-orange-500/10 via-surface to-surface">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30">
            <Tag className="size-3.5 text-orange-500" /> CareerOS Pro Discount Engine
          </div>
          <h1 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Promo Codes & Coupon Manager
          </h1>
          <p className="text-xs text-secondary">
            Create discount promo codes for CareerOS Pro subscriptions to reward campus ambassadors and top intern rankers.
          </p>
        </div>
      </div>

      {/* Create Coupon Form */}
      <div className="surface border border-border rounded-3xl p-6 space-y-4 shadow-sm max-w-lg">
        <h3 className="font-display text-base font-bold text-primary flex items-center gap-2">
          <Plus className="size-4 text-orange-500" /> Create New Promo Code
        </h3>

        <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-primary">Coupon Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              placeholder="e.g. CAMPUS50"
              className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none uppercase font-mono font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-primary">Discount %</label>
              <input
                type="number"
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value))}
                required
                className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-primary">Max Redemptions</label>
              <input
                type="number"
                value={maxRedemptions}
                onChange={(e) => setMaxRedemptions(Number(e.target.value))}
                required
                className="w-full h-10 px-3.5 rounded-xl surface-2 border border-border text-xs text-primary focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:brightness-110 shadow-md shadow-orange-500/20"
          >
            Publish Coupon Code
          </button>
        </form>
      </div>

      {/* Coupons List */}
      <div className="space-y-3">
        {coupons.map((c) => (
          <div key={c.id} className="surface rounded-3xl p-5 border border-border flex items-center justify-between gap-4 text-xs shadow-sm">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-base text-primary">{c.code}</span>
                <span className="text-[10px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-full border border-teal-500/20">
                  {c.discountPct}% OFF
                </span>
              </div>
              <p className="text-muted">Used {c.usedCount} of {c.maxRedemptions} times</p>
            </div>

            <button
              onClick={() => setCoupons((prev) => prev.filter((x) => x.id !== c.id))}
              className="p-2 rounded-xl surface-2 text-red-400 hover:bg-red-500/10 border border-red-500/20"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
