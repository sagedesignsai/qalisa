import { Inter } from "next/font/google";
import localFont from "next/font/local";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const firaSans = localFont({
  src: [
    {
      path: "../assets/fonts/fira-sans/FiraSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/fira-sans/FiraSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/fira-sans/FiraSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/fira-sans/FiraSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-fira-sans",
});

export const firaCode = localFont({
  src: "../assets/fonts/fira-code/FiraCode-VariableFont_wght.ttf",
  variable: "--font-fira-code",
});

export const firaMono = localFont({
  src: [
    {
      path: "../assets/fonts/fira-mono/FiraMono-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/fira-mono/FiraMono-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/fira-mono/FiraMono-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-fira-mono",
});

export const comodo = localFont({
  src: "../assets/fonts/comodo-font/comodo-regular.otf",
  variable: "--font-comodo",
});

export const surgena = localFont({
  src: "../assets/fonts/surgena-font/surgena-regular.otf",
  variable: "--font-surgena",
});

