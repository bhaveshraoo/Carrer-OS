import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { NotificationProvider } from "@/components/notifications/notification-provider";
import { NotificationToastStack } from "@/components/notifications/notification-toast";

export const metadata: Metadata = {
  title: "CareerOS — The AI Career Operating System",
  description:
    "One AI-native platform for resume intelligence, company prep, and DSA readiness — built for India's campus placement season.",
  keywords: ["career", "resume", "ATS", "DSA prep", "campus placement", "India", "placements"],
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "CareerOS — The AI Career Operating System",
    description: "Resume intelligence, company prep, and DSA readiness in one platform.",
    type: "website",
  },
};

import { Suspense } from "react";
import { NavigationLoader } from "@/components/navigation-loader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      {/* Inline script to prevent theme flash before hydration */}
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('careeros-theme')||'light';document.documentElement.setAttribute('data-theme',t);})()`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans" style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
        <Suspense fallback={null}>
          <NavigationLoader />
        </Suspense>
        <NotificationProvider>
          <ThemeProvider>
            {children}
            <NotificationToastStack />
          </ThemeProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}
