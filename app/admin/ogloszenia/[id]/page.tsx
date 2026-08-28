"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "@/app/components/ImageUploader";
import ConfirmDialog from "@/app/components/ConfirmDialog";

export default function EdytujOgloszeniePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [vehicleType, setVehicleType] = useState("osobowe");
  const [status, setStatus] = useState("active");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [variant, setVariant] = useState("");
  const [year, setYear] = useState("");

  const [mileageKm, setMileageKm] = useState("");
  const [mileageHours, setMileageHours] = useState("");
  const [fuel, setFuel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [powerHp, setPowerHp] = useState("");
  const [engineCc, setEngineCc] = useState("");
  const [color, setColor] = useState("");
  const [countryOrigin, setCountryOrigin] = useState("");

  const [pricePln, setPricePln] = useState("");
  const [leasingRatePln, setLeasingRatePln] = useState("");
  const [leasingInitialPct, setLeasingInitialPct] = useState("");
  const [leasingMonths, setLeasingMonths] = useState("");
  const [leasingResidualPct, setLeasingResidualPct] = useState("");
  const [vatType, setVatType] = useState("");

  const [description, setDescription] = useState("");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  function insertBold() {
    const el = descriptionRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = description.slice(start, end) || "pogrubiony tekst";
    const newValue = description.slice(0, start) + "**" + selected + "**" + description.slice(end);
    setDescription(newValue);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + 2, start + 2 + selected.length);
    });
  }
  function insertBullet() {
    const el = descriptionRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selectedText = description.slice(start, end);
    const lines = selectedText.length > 0 ? selectedText.split("\n") : [""];
    const bulletedLines = lines.map((l) => (l.startsWith("- ") ? l : "- " + l)).join("\n");
    const newValue = description.slice(0, start) + bulletedLines + description.slice(end);
    setDescription(newValue);
    requestAnimationFrame(() => {
      el.focus();
      const newPos = start + bulletedLines.length;
      el.setSelectionRange(newPos, newPos);
    });
  }
  const [isFeatured, setIsFeatured] = useState(false);
  const [badge, setBadge] = useState("");
  const [otomotoUrl, setOtomotoUrl] = useState("");

  useEffect(() => {
    async function loadListing() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setError("Nie znaleziono ogłoszenia");
        setFetching(false);
        return;
      }

      setTitle(data.title);
      setSlug(data.slug);
      setVehicleType(data.vehicle_type);
      setStatus(data.status);
      setBrand(data.brand);
      setModel(data.model);
      setVariant(data.variant || "");
      setYear(String(data.year));
      setMileageKm(data.mileage_km ? String(data.mileage_km) : "");
      setMileageHours(data.mileage_hours ? String(data.mileage_hours) : "");
      setFuel(data.fuel || "");
      setTransmission(data.transmission || "");
      setPowerHp(data.power_hp ? String(data.power_hp) : "");
      setEngineCc(data.engine_cc ? String(data.engine_cc) : "");
      setColor(data.color || "");
      setCountryOrigin(data.country_origin || "");
      setPricePln(data.price_pln ? String(data.price_pln) : "");
      setLeasingRatePln(data.leasing_rate_pln ? String(data.leasing_rate_pln) : "");
      setLeasingInitialPct(data.leasing_initial_pct ? String(data.leasing_initial_pct) : "");
      setLeasingMonths(data.leasing_months ? String(data.leasing_months) : "");
      setLeasingResidualPct(data.leasing_residual_pct ? String(data.leasing_residual_pct) : "");
      setVatType(data.vat_type || "");
      setDescription(data.description || "");
      setIsFeatured(data.is_featured);
      setBadge(data.badge || "");
      setOtomotoUrl(data.otomoto_url || "");

      setFetching(false);
    }

    loadListing();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !slug || !brand || !model || !year || !pricePln) {
      setError("Wypełnij wymagane pola: tytuł, slug, marka, model, rok, cena");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase
      .from("listings")
      .update({
        title,
        slug,
        vehicle_type: vehicleType as "osobowe" | "ciezarowe" | "maszyna",
        status: status as "active" | "inactive" | "sold",
        brand,
        model,
        variant: variant || null,
        year: Number(year),
        mileage_km: mileageKm ? Number(mileageKm) : null,
        mileage_hours: mileageHours ? Number(mileageHours) : null,
        fuel: (fuel || null) as "benzyna" | "diesel" | "elektryczny" | "hybryda" | "lpg" | "inny" | null,
        transmission: (transmission || null) as "manualna" | "automatyczna" | "inne" | null,
        power_hp: powerHp ? Number(powerHp) : null,
        engine_cc: engineCc ? Number(engineCc) : null,
        color: color || null,
        country_origin: countryOrigin || null,
        price_pln: Number(pricePln),
        leasing_rate_pln: leasingRatePln ? Number(leasingRatePln) : null,
        leasing_initial_pct: leasingInitialPct ? Number(leasingInitialPct) : null,
        leasing_months: leasingMonths ? Number(leasingMonths) : null,
        leasing_residual_pct: leasingResidualPct ? Number(leasingResidualPct) : null,
        vat_type: vatType || null,
        description: description || null,
        is_featured: isFeatured,
        badge: badge || null,
        otomoto_url: otomotoUrl || null,
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      setError("Błąd zapisu: " + error.message);
      return;
    }

    router.push("/admin/ogloszenia");
    router.refresh();
  }

  async function confirmDelete() {
    setShowDeleteConfirm(false);
    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from("listings").delete().eq("id", id);

    setLoading(false);

    if (error) {
      setError("Błąd usuwania: " + error.message);
      return;
    }

    router.push("/admin/ogloszenia");
    router.refresh();
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";

  if (fetching) {
    return <p className="text-sm text-gray-500">Wczytywanie...</p>;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Usunąć to ogłoszenie?"
        message="Tej operacji nie można cofnąć. Ogłoszenie wraz z jego danymi zostanie trwale usunięte."
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <h1 className="mb-4 text-lg font-semibold" style={{ color: "#1B2A4A" }}>
        Edytuj ogłoszenie
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Podstawowe</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Tytuł *</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Slug *</label>
              <input
                className={inputClass}
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Typ pojazdu</label>
              <select
                className={inputClass}
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
              >
                <option value="osobowe">Osobowe</option>
                <option value="ciezarowe">Ciężarowe</option>
                <option value="maszyna">Maszyna</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Status</label>
              <select
                className={inputClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Aktywne</option>
                <option value="inactive">Nieaktywne</option>
                <option value="sold">Sprzedane</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Marka *</label>
              <input
                className={inputClass}
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Model *</label>
              <input
                className={inputClass}
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Wariant</label>
              <input
                className={inputClass}
                value={variant}
                onChange={(e) => setVariant(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Rok *</label>
              <input
                type="number"
                className={inputClass}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Techniczne</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Przebieg (km)</label>
              <input
                type="number"
                className={inputClass}
                value={mileageKm}
                onChange={(e) => setMileageKm(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Motogodziny</label>
              <input
                type="number"
                className={inputClass}
                value={mileageHours}
                onChange={(e) => setMileageHours(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Paliwo</label>
              <select
                className={inputClass}
                value={fuel}
                onChange={(e) => setFuel(e.target.value)}
              >
                <option value="">-- wybierz --</option>
                <option value="benzyna">Benzyna</option>
                <option value="diesel">Diesel</option>
                <option value="elektryczny">Elektryczny</option>
                <option value="hybryda">Hybryda</option>
                <option value="lpg">LPG</option>
                <option value="inny">Inny</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Skrzynia</label>
              <select
                className={inputClass}
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              >
                <option value="">-- wybierz --</option>
                <option value="manualna">Manualna</option>
                <option value="automatyczna">Automatyczna</option>
                <option value="inne">Inne</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Moc (KM)</label>
              <input
                type="number"
                className={inputClass}
                value={powerHp}
                onChange={(e) => setPowerHp(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Pojemność (cm3)</label>
              <input
                type="number"
                className={inputClass}
                value={engineCc}
                onChange={(e) => setEngineCc(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Kolor</label>
              <input
                className={inputClass}
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Kraj pochodzenia</label>
              <input
                className={inputClass}
                value={countryOrigin}
                onChange={(e) => setCountryOrigin(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Cena i leasing</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>Cena (PLN) *</label>
              <input
                type="number"
                className={inputClass}
                value={pricePln}
                onChange={(e) => setPricePln(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Rata leasingu (PLN)</label>
              <input
                type="number"
                className={inputClass}
                value={leasingRatePln}
                onChange={(e) => setLeasingRatePln(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Wpłata wstępna (%)</label>
              <input
                type="number"
                className={inputClass}
                value={leasingInitialPct}
                onChange={(e) => setLeasingInitialPct(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Okres (msc)</label>
              <input
                type="number"
                className={inputClass}
                value={leasingMonths}
                onChange={(e) => setLeasingMonths(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Wykup (%)</label>
              <input
                type="number"
                className={inputClass}
                value={leasingResidualPct}
                onChange={(e) => setLeasingResidualPct(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>Typ VAT</label>
              <select
                className={inputClass}
                value={vatType}
                onChange={(e) => setVatType(e.target.value)}
              >
                <option value="">-- wybierz --</option>
                <option value="marza">Marża</option>
                <option value="vat23">VAT 23%</option>
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Dodatkowe</h2>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Opis</label>
              <div className="flex gap-2 mb-1">
                <button
                  type="button"
                  onClick={insertBold}
                  className="px-2 py-1 text-xs font-bold border rounded hover:bg-gray-100 cursor-pointer"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={insertBullet}
                  className="px-2 py-1 text-xs border rounded hover:bg-gray-100 cursor-pointer"
                >
                  &bull; Lista
                </button>
              </div>
              <textarea
                ref={descriptionRef}
                className={inputClass}
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                Formatowanie: **pogrubienie**, linie zaczynajace sie od &quot;- &quot; to punkty listy.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Badge</label>
                <select
                  className={inputClass}
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                >
                  <option value="">Brak</option>
                  <option value="Nowe">Nowe</option>
                  <option value="Promocja">Promocja</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Link OtoMoto</label>
                <input
                  className={inputClass}
                  value={otomotoUrl}
                  onChange={(e) => setOtomotoUrl(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />
              <label htmlFor="featured" className="text-sm text-gray-700">
                Ogłoszenie tygodnia
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Zdjęcia</h2>
          <ImageUploader listingId={id} slug={slug} otomotoUrl={otomotoUrl} />
        </section>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex items-center justify-between gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md px-6 py-2 text-sm font-medium text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ backgroundColor: "#1B2A4A" }}
          >
            {loading ? "Zapisywanie..." : "Zapisz zmiany"}
          </button>

          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-md border px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ borderColor: "#dc2626" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
              <path d="M10 11v6"></path>
              <path d="M14 11v6"></path>
              <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
            </svg>
            Usuń ogłoszenie
          </button>
        </div>
      </form>
    </div>
  );
}



