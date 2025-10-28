import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AssessmentProvider } from "@/contexts/AssessmentContext";
import PostHogProvider from "@/components/PostHogProvider";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  variable: "--font-red-hat-display",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Revenue Readiness Assessment | Andru AI",
  description: "Discover your revenue readiness score in 5 minutes. Get personalized insights and systematic scaling tools for Series A technical founders.",
  keywords: ["revenue assessment", "technical founders", "Series A", "revenue intelligence", "scaling tools"],
  openGraph: {
    title: "Revenue Readiness Assessment",
    description: "Professional assessment for Series A technical founders scaling from $2M to $10M+ ARR",
    type: "website",
    url: "https://andru-ai.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${redHatDisplay.variable} font-red-hat-display antialiased`}
        suppressHydrationWarning={true}
      >
        <PostHogProvider>
          <ErrorBoundary>
            <AssessmentProvider>
              {children}
            </AssessmentProvider>
          </ErrorBoundary>
        </PostHogProvider>
      </body>
    </html>
  );
}
