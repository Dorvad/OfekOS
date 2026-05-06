import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "OfekOS",
  description: "מרחב עבודה אישי לתוכנית הכשרת מנהלים אופק",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body
        className={`${heebo.variable} font-sans min-h-screen bg-gray-50 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
