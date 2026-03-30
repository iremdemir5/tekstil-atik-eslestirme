import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

import type { ReactNode } from "react";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24">{children}</div>
      <Footer />
    </div>
  );
}

