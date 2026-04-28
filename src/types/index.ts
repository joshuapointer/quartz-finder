export type Tier = "import" | "usmade";

export type BrandStatus = "active" | "dead";

export type ProductCategory = "control_tower" | "terp_slurper" | "dunking_station";

export interface ProductEntry {
  available: boolean;
  name?: string;
  price?: string;
  original_price?: string;
  sold_out?: boolean;
  status_note?: string;
  link?: string;
  note?: string;
}

export interface Accessory {
  name: string;
  price: string;
}

export interface Brand {
  name: string;
  url: string;
  url_note?: string;
  tier: Tier;
  status: BrandStatus;
  status_label?: string;
  products: Record<ProductCategory, ProductEntry>;
  accessories?: Accessory[];
}

export interface CatalogMeta {
  title: string;
  subtitle: string;
  disclaimer: string;
  product_categories: string[];
  tiers: Record<Tier, { label: string; price_range: string }>;
  summary: {
    total_brands: number;
    active_brands: number;
    inactive_brands: number;
    import_tier_count: number;
    usmade_tier_count: number;
  };
}

export interface Catalog {
  metadata: CatalogMeta;
  brands: Brand[];
}

export interface NormalizedProduct {
  id: string;
  brandSlug: string;
  brandName: string;
  brandTier: Tier;
  brandStatus: BrandStatus;
  category: ProductCategory;
  categoryLabel: string;
  name: string;
  price: string;
  priceValue: number | null;
  originalPrice: string | null;
  soldOut: boolean;
  available: boolean;
  link: string | null;
  note: string | null;
  statusNote: string | null;
}

export interface BrandSummary {
  slug: string;
  name: string;
  url: string;
  urlNote: string | null;
  tier: Tier;
  status: BrandStatus;
  statusLabel: string | null;
  productCount: number;
  accessoryCount: number;
  hasControlTower: boolean;
  hasTerpSlurper: boolean;
  hasDunkingStation: boolean;
}
