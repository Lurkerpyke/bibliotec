import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL ="https://bibliotec-ten.vercel.app/";

export const metadata: Metadata = {
  title: {
    default: "Bibliotec - Sistema de Gestão de Bibliotecas",
    template: "%s | Bibliotec"
  },
  description: "Plataforma profissional de gestão para bibliotecas. Controle de acervos, empréstimos, usuários e relatórios em tempo real.",
  metadataBase: new URL(BASE_URL),
  keywords: [
    "gestão de biblioteca",
    "sistema biblioteca",
    "biblioteca digital",
    "gestão de acervos",
    "controle de empréstimos",
    "catalogo digital"
  ],
  authors: [{ name: "Leandro Soares & JS Mastery", url: BASE_URL }],
  creator: "Leandro Soares",
  publisher: "Bibliotec Inc.",
  twitter: {
    card: "summary_large_image",
    title: "Bibliotec - Gestão Inteligente para Bibliotecas",
    description: "Solução completa para administração de bibliotecas com tecnologia de ponta",
    images: [`${BASE_URL}/bibliotec-og.png`],
  },
  openGraph: {
    title: "Bibliotec - Gestão Inteligente para Bibliotecas",
    description: "Solução completa para administração de bibliotecas com tecnologia de ponta",
    url: BASE_URL,
    siteName: "Bibliotec",
    images: ["https://bibliotec-ten.vercel.app//bibliotec-og.png"],
    locale: "pt_BR",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/logo.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "library management system",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    }
  }
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  
  const session = await auth();
  
  return (
    <html lang="pt-br">
      <head>
        <meta property="og:image" content="/bibliotec-og" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <SessionProvider session={session}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
          <Toaster position="top-center" />
        </body>
      </SessionProvider>
    </html>
  );
}
