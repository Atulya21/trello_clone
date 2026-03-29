import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Trello Clone",
  description: "A production-ready Trello-like Kanban board",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        {children}
        <Toaster
          position="bottom-left"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#172b4d",
              color: "#fff",
              borderRadius: "8px",
              fontSize: "14px",
            },
            success: { iconTheme: { primary: "#36b37e", secondary: "#fff" } },
            error: { iconTheme: { primary: "#ff5630", secondary: "#fff" } },
          }}
        />
      </body>
    </html>
  );
}
