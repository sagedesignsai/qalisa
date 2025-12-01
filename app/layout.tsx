import type { Metadata } from "next";
import {
  firaSans,
  firaCode,
  firaMono,
  comodo,
  surgena,
  inter
} from '@/lib/fonts';
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "Qalisa",
  description: "AI Boilerplate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${firaSans.variable} ${firaCode.variable} ${firaMono.variable} ${comodo.variable} ${surgena.variable} ${inter.variable} antialiased`}
      >
        <AppProviders
          theme={{
            attribute: "class",
            defaultTheme: "system",
            enableSystem: true,
            disableTransitionOnChange: false,
          }}
          toast={{
            position: "bottom-right",
            richColors: true,
          }}
          topLoader={{
            show: true,
            height: 3,
            showSpinner: true,
            crawl: true,
            crawlSpeed: 200,
            speed: 200,
            initialPosition: 0.08,
            easing: "ease",
            zIndex: 1600,
            showAtBottom: false,
          }}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
