import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

// Using system fonts instead of Google Fonts for offline compatibility
const fontClass = "font-sans";

export const metadata: Metadata = {
  title: "Kings BJJ Hub de Treinamento",
  description: "Welcome to the Game!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${fontClass} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
