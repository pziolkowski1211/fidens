"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError("Nieprawidłowy email lub hasło");
      return;
    }
    router.push("/admin/ogloszenia");
    router.refresh();
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1
          className="mb-6 text-center text-xl font-semibold"
          style={{ color: "#1B2A4A" }}
        >
          Panel admina Fidens
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2"
              style={{ outlineColor: "#F0A500" }}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Hasło
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2"
              style={{ outlineColor: "#F0A500" }}
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md py-2 text-sm font-medium text-white transition disabled:opacity-50"
            style={{ backgroundColor: "#1B2A4A" }}
          >
            {loading ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
      </div>
    </div>
  );
}