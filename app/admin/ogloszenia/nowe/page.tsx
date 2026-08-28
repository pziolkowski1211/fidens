"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { importOtomotoListing } from "../otomoto-actions";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NoweOgloszeniePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
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
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [importError, setImportError] = useState<string | null>(null);

  async function handleImportOtomoto() {
    setImportError(null);
    setImportWarnings([]);

    if (!importUrl) {
      setImportError("Wklej najpierw link do ogłoszenia OtoMoto");
      return;
    }

    setImporting(true);
    try {
      const result = await importOtomotoListing(importUrl);

      if (!result.success) {
        setImportError(result.error);
        return;
      }

      const data = result.data;

      if (data.title) {
        handleTitleChange(data.title);
      }
      if (data.brand) setBrand(data.brand);
      if (data.model) setModel(data.model);
      if (data.year) setYear(String(data.year));
      if (data.pricePln) setPricePln(String(data.pricePln));
      if (data.mileageKm) setMileageKm(String(data.mileageKm));
      if (data.fuel) setFuel(data.fuel);
      if (data.transmission) setTransmission(data.transmission);
      if (data.color) setColor(data.color);
      if (data.powerHp) setPowerHp(String(data.powerHp));
      if (data.engineCc) setEngineCc(String(data.engineCc));
      if (data.countryOrigin) setCountryOrigin(data.countryOrigin);
      setOtomotoUrl(data.otomotoUrl);

      setImportWarnings(data.warnings);
    } catch (e) {
      setImportError(e instanceof Error ? e.message : "Nieoczekiwany blad podczas importu");
    } finally {
      setImporting(false);
    }
  }
  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title || !slug || !brand || !model || !year || !pricePln) {
      setError("Wypełnij wymagane pola: tytuł, slug, marka, model, rok, cena");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("listings")
      .insert({
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
        otomoto_id: null,
        location_city: null,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      setError("Błąd zapisu: " + error.message);
      return;
    }

    router.push(`/admin/ogloszenia/${data.id}`);
  }

  const inputClass =
    "w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2";
  const labelClass = "mb-1 block text-sm font-medium text-gray-700";

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-4 text-lg font-semibold" style={{ color: "#1B2A4A" }}>
        Nowe ogłoszenie
      </h1>
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-500">Import z OtoMoto</h2>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2"
            placeholder="Wklej link do ogłoszenia OtoMoto"
            value={importUrl}
            onChange={(e) => setImportUrl(e.target.value)}
          />
          <button
            type="button"
            onClick={handleImportOtomoto}
            disabled={importing}
            className="whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ backgroundColor: "#F0A500" }}
          >
            {importing ? "Importowanie..." : "Importuj dane"}
          </button>
        </div>
        {importError && <p className="mt-2 text-sm text-red-600">{importError}</p>}
        {importWarnings.length > 0 && (
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
            {importWarnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        )}
      </div>
      <div
        className="mb-4 rounded-md border px-4 py-3 text-sm"
        style={{ borderColor: "#F0A500", backgroundColor: "#FFF8E8", color: "#1B2A4A" }}
      >
        Zdjęcia będzie można dodać dopiero po zapisaniu ogłoszenia
        (nastąpi automatyczne przekierowanie do edycji, gdzie znajduje się sekcja Zdjęcia).
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">Podstawowe</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={labelClass}>Tytuł *</label>
              <input
                className={inputClass}
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Slug *</label>
              <input
                className={inputClass}
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setSlugTouched(true);
                }}
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

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md px-6 py-2 text-sm font-medium text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            style={{ backgroundColor: "#1B2A4A" }}
          >
            {loading ? "Zapisywanie..." : "Zapisz ogłoszenie"}
          </button>
        </div>
      </form>
    </div>
  );
}


