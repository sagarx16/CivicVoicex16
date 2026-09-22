import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#FAF9F7",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "CivicVoice — Your voice, your city, your impact",
    template: "%s | CivicVoice",
  },
  description:
    "Join thousands of citizens actively shaping your community. Report local issues, participate in vital polls, and connect with neighborhood initiatives.",
  keywords: [
    "civic",
    "community",
    "city reporting",
    "local government",
    "polls",
    "neighborhood",
  ],
  authors: [{ name: "CivicVoice Team" }],
  creator: "CivicVoice",
  openGraph: {
    title: "CivicVoice — Your voice, your city, your impact",
    description:
      "Join thousands of citizens actively shaping your community. Report local issues, participate in vital polls, and connect with neighborhood initiatives.",
    siteName: "CivicVoice",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CivicVoice — Your voice, your city, your impact",
    description:
      "Empowering citizens to report local hazards and vote on municipal priorities.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ClerkProvider
          signInFallbackRedirectUrl="/dashboard"
          signUpFallbackRedirectUrl="/dashboard"
          signInForceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
          appearance={{
            unsafe_disableDevelopmentModeWarnings: true,
          } as Record<string, unknown>}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}