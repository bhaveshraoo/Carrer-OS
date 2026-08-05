"use client";

import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function BrandLogo({ href = "/dashboard", className = "", size = "md" }: BrandLogoProps) {
  const sizeClasses = {
    sm: "text-xl sm:text-2xl",
    md: "text-2xl sm:text-3xl font-black",
    lg: "text-3xl sm:text-4xl font-black",
  };

  const logoContent = (
    <span className={`font-display tracking-tight inline-flex items-center select-none ${sizeClasses[size]}`}>
      <span className="brand-career-text transition-colors duration-200">
        Career
      </span>
      <span className="brand-os-text transition-colors duration-200">
        OS
      </span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`inline-flex items-center transition-opacity hover:opacity-85 ${className}`}
      >
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
