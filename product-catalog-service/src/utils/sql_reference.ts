// CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Required for gen_random_uuid()

/*

CREATE TABLE products (
    _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) NOT NULL,
    image TEXT NOT NULL,
    summary VARCHAR(255) NOT NULL,
    old_price NUMERIC(10, 2) DEFAULT 0 CHECK (old_price >= 0),
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    description TEXT NOT NULL,
    color TEXT[] DEFAULT NULL, -- Array of strings
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    special BOOLEAN DEFAULT FALSE,
    brand VARCHAR(100),
    reviews JSONB DEFAULT '[]', -- Array of JSON objects
    categories TEXT[] DEFAULT NULL, -- Array of category IDs
    tags TEXT[] DEFAULT NULL, -- Array of tags
    sku VARCHAR(50) NOT NULL UNIQUE,
    variants JSONB DEFAULT '[]', -- Array of JSON objects
    discount JSONB DEFAULT NULL, -- JSON object for discount details
    seo JSONB DEFAULT NULL, -- JSON object for SEO details
    availability VARCHAR(20) DEFAULT 'in-stock' CHECK (availability IN ('in-stock', 'out-of-stock', 'pre-order')),
    dimensions JSONB DEFAULT NULL, -- JSON object for dimensions
    weight NUMERIC(10, 2) DEFAULT NULL CHECK (weight >= 0),
    related_products UUID[] DEFAULT NULL, -- Array of related product IDs
    visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
  _id UUID PRIMARY KEY DEFAULT gen_random_uuid(),  -- Automatically generate UUID if not provided
  name VARCHAR(255) NOT NULL,
  description TEXT,
  slug VARCHAR(255) UNIQUE NOT NULL,
  parent_id UUID REFERENCES categories(_id) ON DELETE CASCADE,  -- Self-referencing for subcategories
  image VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  visibility BOOLEAN DEFAULT true,  -- Default to true if not specified
  seo_metadata JSONB,
  sort_order INT,
  is_featured BOOLEAN DEFAULT false  -- Default to false if not specified
);

-- Create an index for faster search on the `slug`
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

--create an index on `parent_id` for if dealing with large category hierarchies

CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
*/
