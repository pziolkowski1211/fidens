"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

type ContactRequest = {
  id: string;
  created_at: string;
  listing_id: string | null;
  name: string;
  phone: string;
  email: string | null;
  nip: string | null;
  message: string | null;
  leasing_initial_pct: number | null;
  leasing_months: number | null;
  leasing_residual_pct: number | null;
  is_read: boolean;
  notes: string | null;
};

export default function AdminZapytaniaPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});

  const loadRequests = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else if (data) {
      setRequests(data);
      const drafts: Record<string, string> = {};
      data.forEach((r) => {
        drafts[r.id] = r.notes || "";
      });
      setNotesDraft(drafts);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  async function toggleRead(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("contact_requests")
      .update({ is_read: !current } as never)
      .eq("id", id);
    loadRequests();
  }

  async function saveNotes(id: string) {
    const supabase = createClient();
    await supabase
      .from("contact_requests")
      .update({ notes: notesDraft[id] || null } as never)
      .eq("id", id);
    loadRequests();
  }

  async function deleteRequest(id: string) {
    const supabase = createClient();
    await supabase.from("contact_requests").delete().eq("id", id);
    loadRequests();
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Wczytywanie...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-lg font-semibold" style={{ color: "#1B2A4A" }}>
        Zapytania
      </h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {requests.length === 0 && !error && (
        <p className="text-sm text-gray-500">Brak zapytań.</p>
      )}

      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="rounded-lg border bg-white p-4"
            style={{
              borderColor: req.is_read ? "#e8eaed" : "#F0A500",
            }}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900">{req.name}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(req.created_at)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => toggleRead(req.id, req.is_read)}
                  className="rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{
                    backgroundColor: req.is_read ? "#9ca3af" : "#F0A500",
                  }}
                >
                  {req.is_read ? "Przeczytane" : "Nieprzeczytane"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteRequest(req.id)}
                  className="rounded-full px-3 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: "#dc2626" }}
                >
                  Usuń
                </button>
              </div>
            </div>

            <div className="mb-2 grid grid-cols-1 gap-1 text-sm text-gray-700 sm:grid-cols-2">
              <p>Telefon: {req.phone}</p>
              {req.email && <p>Email: {req.email}</p>}
              {req.nip && <p>NIP: {req.nip}</p>}
              {req.leasing_months && (
                <p>
                  Leasing: {req.leasing_initial_pct}% / {req.leasing_months} msc /{" "}
                  {req.leasing_residual_pct}% wykup
                </p>
              )}
            </div>

            {req.message && (
              <p className="mb-2 rounded-md bg-gray-50 p-2 text-sm text-gray-700">
                {req.message}
              </p>
            )}

            <div>
              <label className="mb-1 block text-xs font-medium text-gray-500">
                Notatki
              </label>
              <div className="flex gap-2">
                <textarea
                  className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-gray-900"
                  rows={2}
                  value={notesDraft[req.id] || ""}
                  onChange={(e) =>
                    setNotesDraft((prev) => ({
                      ...prev,
                      [req.id]: e.target.value,
                    }))
                  }
                />
                <button
                  type="button"
                  onClick={() => saveNotes(req.id)}
                  className="shrink-0 self-start rounded-md px-3 py-1 text-xs font-medium text-white"
                  style={{ backgroundColor: "#1B2A4A" }}
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}