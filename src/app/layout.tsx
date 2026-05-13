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
      <head>
        {/* Runs before React hydrates — prevents dark-mode flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('ofekos:theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
      </head>
      <body className="font-sans min-h-screen bg-gray-50 dark:bg-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
