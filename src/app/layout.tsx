import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OfekOS",
  description: "מרחב עבודה אישי לתוכנית הכשרת מנהלים אופק",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body className="font-sans min-h-screen bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}
