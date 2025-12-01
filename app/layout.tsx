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
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import NextTopLoader from "nextjs-toploader";
import { ChatProvider } from '@/lib/ai/chat-context';
import { ErrorBoundary } from "@/components/error-boundary";
import { SessionProvider } from "@/components/session-provider";

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
    <ThemeProvider
    attribute="class"
    defaultTheme="system"
    enableSystem
    disableTransitionOnChange
    >
    <ErrorBoundary>
    <SessionProvider>
    <ChatProvider>
    <NextTopLoader />
    {children}
    <Toaster position="bottom-right" richColors />
    </ChatProvider>
    </SessionProvider>
    </ErrorBoundary>
    </ThemeProvider>
    </body>
    </html>
  );
}
