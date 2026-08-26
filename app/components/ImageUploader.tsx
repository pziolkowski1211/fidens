"use client";

import { useState, useEffect, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { createClient } from "@/lib/supabase/client";

type ListingImage = {
  id: string;
  listing_id: string;
  storage_path: string;
  url: string;
  position: number;
  is_cover: boolean;
};

export default function ImageUploader({
  listingId,
  slug,
}: {
  listingId: string;
  slug: string;
}) {
  const [images, setImages] = useState<ListingImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const loadImages = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("listing_images")
      .select("*")
      .eq("listing_id", listingId)
      .order("position", { ascending: true });

    if (!error && data) {
      setImages(data);
    }
    setLoading(false);
  }, [listingId]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    const supabase = createClient();

    let nextPosition =
      images.length > 0 ? Math.max(...images.map((i) => i.position)) + 1 : 0;
    const isFirstUpload = images.length === 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const compressed = await imageCompression(file, {
          maxWidthOrHeight: 1600,
          maxSizeMB: 0.4,
          useWebWorker: true,
        });

        const safeName = file.name
          .toLowerCase()
          .replace(/[^a-z0-9.]+/g, "-");
        const path = `${slug}/${Date.now()}-${i}-${safeName}`;

        const { error: uploadError } = await supabase.storage
          .from("listing-images")
          .upload(path, compressed);

        if (uploadError) {
          setError("Blad uploadu: " + uploadError.message);
          continue;
        }

        const { data: publicUrlData } = supabase.storage
          .from("listing-images")
          .getPublicUrl(path);

        const { error: insertError } = await supabase
          .from("listing_images")
          .insert({
            listing_id: listingId,
            storage_path: path,
            url: publicUrlData.publicUrl,
            position: nextPosition,
            is_cover: isFirstUpload && i === 0,
          });

        if (insertError) {
          setError("Blad zapisu zdjecia: " + insertError.message);
        }

        nextPosition++;
      } catch {
        setError("Nie udalo sie skompresowac zdjecia: " + file.name);
      }
    }

    setUploading(false);
    loadImages();
  }

  async function handleSetCover(imageId: string) {
    const supabase = createClient();

    await supabase
      .from("listing_images")
      .update({ is_cover: false })
      .eq("listing_id", listingId);

    await supabase
      .from("listing_images")
      .update({ is_cover: true })
      .eq("id", imageId);

    loadImages();
  }

  async function handleDelete(image: ListingImage) {
    if (!confirm("Usunac to zdjecie?")) return;

    const supabase = createClient();

    await supabase.storage.from("listing-images").remove([image.storage_path]);
    await supabase.from("listing_images").delete().eq("id", image.id);

    loadImages();
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const supabase = createClient();
    const current = images[index];
    const target = images[targetIndex];

    await supabase
      .from("listing_images")
      .update({ position: target.position })
      .eq("id", current.id);

    await supabase
      .from("listing_images")
      .update({ position: current.position })
      .eq("id", target.id);

    loadImages();
  }

  if (loading) {
    return <p className="text-sm text-gray-500">Wczytywanie zdjec...</p>;
  }

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        className="rounded-lg border-2 border-dashed p-6 text-center"
        style={{
          borderColor: dragOver ? "#F0A500" : "#e8eaed",
          backgroundColor: dragOver ? "#fffbea" : "white",
        }}
      >
        <p className="mb-2 text-sm text-gray-600">
          Przeciagnij zdjecia tutaj lub wybierz plik
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          disabled={uploading}
          className="text-sm"
        />
        {uploading && (
          <p className="mt-2 text-sm" style={{ color: "#F0A500" }}>
            Wysylanie i kompresowanie zdjec...
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="relative aspect-square bg-gray-100">
                <img
                  src={image.url}
                  alt=""
                  className="h-full w-full object-cover"
                />
                {image.is_cover && (
                  <span
                    className="absolute left-1 top-1 rounded px-2 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: "#F0A500" }}
                  >
                    Okladka
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between gap-1 p-2">
                <button
                  type="button"
                  onClick={() => handleMove(index, -1)}
                  disabled={index === 0}
                  className="text-xs text-gray-500 disabled:opacity-30"
                >
                  left
                </button>
                {!image.is_cover && (
                  <button
                    type="button"
                    onClick={() => handleSetCover(image.id)}
                    className="text-xs font-medium"
                    style={{ color: "#1B2A4A" }}
                  >
                    Ustaw okladke
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleMove(index, 1)}
                  disabled={index === images.length - 1}
                  className="text-xs text-gray-500 disabled:opacity-30"
                >
                  right
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(image)}
                className="w-full border-t border-gray-100 py-1 text-xs text-red-600"
              >
                Usun
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
