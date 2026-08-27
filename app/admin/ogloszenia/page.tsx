import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
const statusLabels: Record<string, string> = {
  active: "Aktywne",
  inactive: "Nieaktywne",
  sold: "Sprzedane",
};
const statusColors: Record<string, string> = {
  active: "#16a34a",
  inactive: "#9ca3af",
  sold: "#dc2626",
};
export default async function AdminOgloszeniaPage() {
  const supabase = await createClient();
  const { data: listings, error } = await supabase
    .from("listings")
    .select("*")
    .order("created_at", { ascending: false });
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold" style={{ color: "#1B2A4A" }}>
          Ogłoszenia
        </h1>
        <Link
          href="/admin/ogloszenia/nowe"
          className="rounded-md px-4 py-2 text-sm font-medium text-white"
          style={{ backgroundColor: "#F0A500" }}
        >
          + Dodaj nowe
        </Link>
      </div>
      {error && (
        <p className="text-sm text-red-600">
          Błąd wczytywania ogłoszeń: {error.message}
        </p>
      )}
      {!error && listings && listings.length === 0 && (
        <p className="text-sm text-gray-500">Brak ogłoszeń.</p>
      )}
      {!error && listings && listings.length > 0 && (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Tytuł</th>
                <th className="px-4 py-3">Marka / Model</th>
                <th className="px-4 py-3">Cena</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-t border-gray-100">
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {listing.title}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {listing.brand} {listing.model}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {listing.price_pln
                      ? `${listing.price_pln.toLocaleString("pl-PL")} zł`
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="rounded-full px-2 py-1 text-xs font-medium text-white"
                      style={{
                        backgroundColor: statusColors[listing.status],
                      }}
                    >
                      {statusLabels[listing.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/ogloszenia/${listing.id}`}
                      className="text-sm font-medium"
                      style={{ color: "#1B2A4A" }}
                    >
                      Edytuj
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}