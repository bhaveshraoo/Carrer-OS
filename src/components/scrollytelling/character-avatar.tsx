"use client";

import React from "react";

export type CharacterMood =
  | "worried"     // Step 1: Low ATS score, red alert
  | "happy"       // Step 2: Rewritten, green high score
  | "curious"     // Step 3: Inspecting company details
  | "coding"      // Step 4: Solving DSA & PYQs
  | "working"     // Step 5: Internship project builder
  | "celebrating"; // Step 6: Offer letter & Placed!

interface CharacterProps {
  mood: CharacterMood;
  className?: string;
}

export function CharacterAvatar({ mood, className = "w-48 h-48" }: CharacterProps) {
  return (
    <div className={`relative flex items-center justify-center transition-all duration-500 ${className}`}>
      {/* Glow aura background based on mood */}
      <div
        className="absolute inset-0 rounded-full blur-2xl transition-all duration-700 opacity-40 scale-110"
        style={{
          background:
            mood === "worried"
              ? "radial-gradient(circle, #EF4444 0%, transparent 70%)"
              : mood === "happy" || mood === "celebrating"
              ? "radial-gradient(circle, #0D9488 0%, transparent 70%)"
              : "radial-gradient(circle, #F97316 0%, transparent 70%)",
        }}
      />

      {/* SVG Character */}
      <svg
        viewBox="0 0 200 220"
        className="w-full h-full relative z-10 drop-shadow-xl transition-transform duration-500"
      >
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>
          <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id="hoodieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
        </defs>

        {/* Shadow */}
        <ellipse cx="100" cy="205" rx="60" ry="10" fill="rgba(0,0,0,0.3)" />

        {/* Body / Hoodie */}
        <path
          d="M 50 160 Q 100 145 150 160 L 165 210 Q 100 215 35 210 Z"
          fill="url(#hoodieGrad)"
        />
        {/* Hoodie Collar Details */}
        <path d="M 80 155 L 100 180 L 120 155" fill="none" stroke="#C2410C" strokeWidth="4" strokeLinecap="round" />
        <circle cx="100" cy="180" r="4" fill="#FFF" />

        {/* Head */}
        <rect x="60" y="60" width="80" height="90" rx="35" fill="url(#skinGrad)" />

        {/* Hair */}
        <path
          d="M 55 75 Q 60 40 100 38 Q 140 40 145 75 Q 130 50 100 52 Q 70 50 55 75 Z"
          fill="url(#hairGrad)"
        />
        {/* Front Hair Tuft */}
        <path d="M 90 40 Q 105 25 115 42 Q 100 44 90 40 Z" fill="url(#hairGrad)" />

        {/* Ears */}
        <circle cx="58" cy="105" r="9" fill="url(#skinGrad)" />
        <circle cx="142" cy="105" r="9" fill="url(#skinGrad)" />

        {/* Glasses (Stylish Developer Glasses) */}
        <rect x="68" y="88" width="28" height="20" rx="6" fill="none" stroke="#0F172A" strokeWidth="3.5" />
        <rect x="104" y="88" width="28" height="20" rx="6" fill="none" stroke="#0F172A" strokeWidth="3.5" />
        <line x1="96" y1="96" x2="104" y2="96" stroke="#0F172A" strokeWidth="3.5" />
        <line x1="58" y1="96" x2="68" y2="96" stroke="#0F172A" strokeWidth="3.5" />
        <line x1="132" y1="96" x2="142" y2="96" stroke="#0F172A" strokeWidth="3.5" />

        {/* Eyes (Vary by mood) */}
        {mood === "worried" ? (
          <>
            <circle cx="82" cy="99" r="4" fill="#0F172A" />
            <circle cx="118" cy="99" r="4" fill="#0F172A" />
            <path d="M 148 85 Q 153 92 148 97 Q 143 92 148 85 Z" fill="#38BDF8" />
          </>
        ) : mood === "coding" || mood === "working" ? (
          <>
            <circle cx="80" cy="97" r="4" fill="#0F172A" />
            <circle cx="116" cy="97" r="4" fill="#0F172A" />
            <path d="M 72 91 L 86 91" stroke="#38BDF8" strokeWidth="2" opacity="0.8" />
            <path d="M 108 91 L 122 91" stroke="#38BDF8" strokeWidth="2" opacity="0.8" />
          </>
        ) : mood === "celebrating" ? (
          <>
            <path d="M 76 99 Q 82 91 88 99" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 112 99 Q 118 91 124 99" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="82" cy="97" r="4.5" fill="#0F172A" />
            <circle cx="118" cy="97" r="4.5" fill="#0F172A" />
            <circle cx="84" cy="95" r="1.5" fill="#FFF" />
            <circle cx="120" cy="95" r="1.5" fill="#FFF" />
          </>
        )}

        {/* Eyebrows */}
        {mood === "worried" ? (
          <>
            <path d="M 70 82 Q 82 86 92 82" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 108 82 Q 118 86 130 82" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : mood === "celebrating" || mood === "happy" ? (
          <>
            <path d="M 70 82 Q 80 77 90 82" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            <path d="M 110 82 Q 120 77 130 82" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d="M 72 83 L 88 83" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 112 83 L 128 81" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          </>
        )}

        {/* Mouth */}
        {mood === "worried" ? (
          <path d="M 85 130 Q 100 120 115 130" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        ) : mood === "celebrating" || mood === "happy" ? (
          <path d="M 80 122 Q 100 142 120 122 Z" fill="#EF4444" />
        ) : mood === "coding" || mood === "working" ? (
          <path d="M 88 126 Q 100 130 112 126" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        ) : (
          <path d="M 84 124 Q 100 134 116 124" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        )}

        {/* Cheeks */}
        {(mood === "happy" || mood === "celebrating") && (
          <>
            <circle cx="68" cy="116" r="7" fill="#F87171" opacity="0.5" />
            <circle cx="132" cy="116" r="7" fill="#F87171" opacity="0.5" />
          </>
        )}

        {/* Party Hat for Placed / Celebrating */}
        {mood === "celebrating" && (
          <g transform="translate(80, 5) rotate(10)">
            <polygon points="20,0 0,40 40,40" fill="#F59E0B" />
            <circle cx="20" cy="0" r="5" fill="#EF4444" />
            <line x1="5" y1="20" x2="35" y2="20" stroke="#38BDF8" strokeWidth="3" />
          </g>
        )}
      </svg>
    </div>
  );
}
