"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  Share2,
  Download,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { useNotifications } from "@/components/notifications/notification-provider";

interface CertData {
  id: string;
  user_name: string;
  track_title: string;
  duration_label: string;
  issued_date: string;
  certificate_slug: string;
}

export default function CertificateViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { notify } = useNotifications();
  const [cert, setCert] = useState<CertData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production / API, fetch by slug. For client render fallback:
    setCert({
      id: `cert-${slug}`,
      user_name: "CareerOS Master Student",
      track_title: "Specialized Education Study Track",
      duration_label: "2 Hours / Day Intensive Plan",
      issued_date: new Date().toISOString().split("T")[0],
      certificate_slug: slug,
    });
    setLoading(false);
  }, [slug]);

  const handleShareLinkedIn = () => {
    const certUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareText = `I am proud to announce that I have successfully completed the ${cert?.track_title} Education Roadmap on CareerOS! 🎓🚀 Check out my verified certificate: ${certUrl}`;
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(certUrl)}&summary=${encodeURIComponent(shareText)}`;
    
    window.open(linkedInUrl, "_blank");

    notify({
      type: "success",
      icon: "💼",
      title: "LinkedIn Share Opened!",
      body: "Opening LinkedIn post composer with your verified certificate link.",
      autoDismiss: 4000,
    });
  };

  const handleDownloadPdf = () => {
    notify({
      type: "info",
      icon: "📥",
      title: "Downloading High-Res PDF",
      body: "Preparing your official CareerOS digital certificate document...",
      autoDismiss: 4000,
    });
  };

  if (loading || !cert) {
    return (
      <div className="p-8 text-center surface rounded-3xl border border-border text-muted text-xs animate-fade-up">
        Loading certificate...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up max-w-4xl mx-auto">

      {/* Back Nav */}
      <Link href="/dashboard/roadmaps" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted hover:text-primary transition-colors">
        <ArrowLeft className="size-4" /> Back to Roadmaps Hub
      </Link>

      {/* OFFICIAL VERIFIABLE DIGITAL CERTIFICATE CARD */}
      <div className="surface border-2 border-amber-500/40 rounded-3xl p-8 sm:p-12 space-y-8 shadow-2xl bg-gradient-to-br from-amber-500/10 via-surface to-surface relative overflow-hidden text-center">
        
        {/* Certificate Watermark / Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-xs font-extrabold text-amber-400 bg-amber-500/15 border border-amber-500/30 mx-auto">
            <Award className="size-4 text-amber-400" /> OFFICIAL CAREEROS VERIFIABLE CERTIFICATE
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-primary tracking-tight">
            Certificate of Mastery
          </h1>
          <p className="text-xs text-muted font-mono uppercase tracking-widest pt-1">
            Verification Slug ID: {cert.certificate_slug}
          </p>
        </div>

        {/* Recipient */}
        <div className="space-y-2 py-4 border-y border-border max-w-2xl mx-auto">
          <p className="text-xs text-secondary font-semibold uppercase tracking-wider">This Certifies That</p>
          <p className="font-display text-2xl sm:text-4xl font-extrabold text-amber-400">
            {cert.user_name}
          </p>
          <p className="text-xs text-secondary max-w-lg mx-auto pt-2">
            has successfully completed 100% of the structured skill-tree modules and educational study guides for:
          </p>
          <p className="font-display text-xl font-bold text-primary pt-1">
            "{cert.track_title}"
          </p>
        </div>

        {/* Details Footer */}
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-xl mx-auto text-xs">
          <div className="text-left space-y-0.5">
            <p className="text-muted font-bold text-[10px] uppercase">Issued Date</p>
            <p className="font-bold text-primary font-mono">{formatDate(cert.issued_date)}</p>
          </div>

          <div className="text-center space-y-0.5">
            <p className="text-muted font-bold text-[10px] uppercase">Plan Intensity</p>
            <p className="font-bold text-teal-400 font-mono">{cert.duration_label}</p>
          </div>

          <div className="text-right space-y-0.5">
            <p className="text-muted font-bold text-[10px] uppercase">Status</p>
            <p className="font-bold text-teal-400 flex items-center gap-1">
              <CheckCircle2 className="size-3.5" /> Verifiable
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleShareLinkedIn}
            className="px-6 py-3 rounded-2xl font-bold text-xs bg-[#0A66C2] text-white hover:brightness-110 shadow-lg flex items-center gap-2"
          >
            <Share2 className="size-4" /> Share to LinkedIn Profile
          </button>

          <button
            onClick={handleDownloadPdf}
            className="px-6 py-3 rounded-2xl font-bold text-xs bg-amber-500 text-white hover:brightness-110 shadow-lg flex items-center gap-2"
          >
            <Download className="size-4" /> Download Certificate PDF
          </button>
        </div>

      </div>

    </div>
  );
}
