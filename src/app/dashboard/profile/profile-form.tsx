"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateProfile } from "./actions";
import { CheckCircle2 } from "lucide-react";

export function ProfileForm({
  initialFullName,
  initialUsername,
}: {
  initialFullName: string;
  initialUsername: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [username, setUsername] = useState(initialUsername);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);

    const formData = new FormData();
    formData.set("fullName", fullName);
    formData.set("username", username);

    startTransition(async () => {
      const result = await updateProfile(formData);
      if (!result.success) {
        setError(result.error ?? "Something went wrong.");
      } else {
        setSaved(true);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Not set"
        />
        <p className="text-xs text-slate-400">3-20 characters: letters, numbers, underscores.</p>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {saved && (
        <p className="text-sm text-teal-700 flex items-center gap-1.5">
          <CheckCircle2 className="size-4" /> Saved
        </p>
      )}

      <Button type="submit" variant="primary" disabled={isPending}>
        {isPending ? "Saving..." : "Save changes"}
      </Button>
    </form>
  );
}
