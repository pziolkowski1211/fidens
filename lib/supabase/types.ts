// lib/supabase/types.ts
export type VehicleType = 'osobowe' | 'ciezarowe' | 'maszyna'
export type FuelType = 'benzyna' | 'diesel' | 'elektryczny' | 'hybryda' | 'lpg' | 'inny'
export type TransmissionType = 'manualna' | 'automatyczna' | 'inne'
export type ListingStatus = 'active' | 'inactive' | 'sold'

export interface Database {
  public: {
    Tables: {
      listings: { Row: Listing; Insert: ListingInsert; Update: ListingUpdate; Relationships: [] }
      listing_images: { Row: ListingImage; Insert: ListingImageInsert; Update: Partial<ListingImageInsert>; Relationships: [] }
      contact_requests: { Row: ContactRequest; Insert: ContactRequestInsert; Update: Partial<ContactRequestInsert>; Relationships: [] }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}

export type Listing = {
  id: string
  created_at: string
  updated_at: string
  title: string
  slug: string
  vehicle_type: VehicleType
  status: ListingStatus
  brand: string
  model: string
  variant: string | null
  year: number
  mileage_km: number | null
  mileage_hours: number | null
  fuel: FuelType | null
  transmission: TransmissionType | null
  power_hp: number | null
  engine_cc: number | null
  color: string | null
  country_origin: string | null
  price_pln: number | null
  leasing_rate_pln: number | null
  leasing_initial_pct: number | null
  leasing_months: number | null
  leasing_residual_pct: number | null
  is_featured: boolean
  badge: string | null
  otomoto_url: string | null
  otomoto_id: string | null
  description: string | null
  location_city: string | null
  vat_type: string | null
}

export type ListingInsert = Omit<Listing, 'id' | 'created_at' | 'updated_at'>
export type ListingUpdate = Partial<ListingInsert>

export type ListingWithCover = Listing & {
  cover_image: ListingImage | null
}

export type ListingImage = {
  id: string
  listing_id: string
  storage_path: string
  url: string
  position: number
  is_cover: boolean
  created_at: string
}

export type ListingImageInsert = Omit<ListingImage, 'id' | 'created_at'>

export type ContactRequest = {
  id: string
  created_at: string
  listing_id: string | null
  name: string
  phone: string
  email: string | null
  nip: string | null
  message: string | null
  leasing_initial_pct: number | null
  leasing_months: number | null
  leasing_residual_pct: number | null
  marketing_consent: boolean
  is_read: boolean
  notes: string | null
  ip_address: string | null
  marketing_confirm_token: string | null
  marketing_confirmed: boolean
}

export type ContactRequestInsert = Omit<ContactRequest, 'id' | 'created_at' | 'is_read' | 'notes'>