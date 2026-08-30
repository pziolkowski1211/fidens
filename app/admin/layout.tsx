"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const links = [
    { href: "/admin/ogloszenia", label: "Ogłoszenia" },
    { href: "/admin/zapytania", label: "Zapytania" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 text-white"
        style={{ backgroundColor: "#1B2A4A" }}
      >
        <nav className="flex items-center gap-4 text-sm">
          {links.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium"
                style={{
                  color: isActive ? "#F0A500" : "white",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="text-sm font-medium opacity-80 hover:opacity-100 cursor-pointer"
        >
          Wyloguj
        </button>
      </header>

      <main className="p-4">{children}</main>
    </div>
  );
}

