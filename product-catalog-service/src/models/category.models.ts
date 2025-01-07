export interface CategoryInterface {
  name: string;
  description: string | null;
  slug: string;
  parent_id: string | null; // Nullable, for subcategories
  image: string | null;
  created_at: Date;
  updated_at: Date;
  visibility: boolean;
  seo_metadata: object | null; // JSONB data type in PostgreSQL
  sort_order: number | null;
  is_featured: boolean;
}

export class Category implements CategoryInterface {
  name: string;
  description: string | null;
  slug: string;
  parent_id: string | null;
  image: string | null;
  created_at: Date;
  updated_at: Date;
  visibility: boolean;
  seo_metadata: object | null;
  sort_order: number | null;
  is_featured: boolean;

  constructor(data: CategoryInterface) {
    this.name = data.name;
    this.description = data.description;
    this.slug = data.slug;
    this.parent_id = data.parent_id;
    this.image = data.image;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
    this.visibility = data.visibility;
    this.seo_metadata = data.seo_metadata;
    this.sort_order = data.sort_order;
    this.is_featured = data.is_featured;
  }
}
