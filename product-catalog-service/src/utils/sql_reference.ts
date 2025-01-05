// CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- Required for gen_random_uuid()

// CREATE TABLE products (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     title VARCHAR(100) NOT NULL,
//     image TEXT NOT NULL,
//     summary VARCHAR(255) NOT NULL,
//     old_price NUMERIC(10, 2) DEFAULT 0 CHECK (old_price >= 0),
//     price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
//     description TEXT NOT NULL,
//     color TEXT[] DEFAULT NULL, -- Array of strings
//     quantity INTEGER NOT NULL CHECK (quantity >= 0),
//     special BOOLEAN DEFAULT FALSE,
//     brand VARCHAR(100),
//     reviews JSONB DEFAULT '[]', -- Array of JSON objects
//     categories TEXT[] DEFAULT NULL, -- Array of category IDs
//     tags TEXT[] DEFAULT NULL, -- Array of tags
//     sku VARCHAR(50) NOT NULL UNIQUE,
//     variants JSONB DEFAULT '[]', -- Array of JSON objects
//     discount JSONB DEFAULT NULL, -- JSON object for discount details
//     seo JSONB DEFAULT NULL, -- JSON object for SEO details
//     availability VARCHAR(20) DEFAULT 'in-stock' CHECK (availability IN ('in-stock', 'out-of-stock', 'pre-order')),
//     dimensions JSONB DEFAULT NULL, -- JSON object for dimensions
//     weight NUMERIC(10, 2) DEFAULT NULL CHECK (weight >= 0),
//     related_products UUID[] DEFAULT NULL, -- Array of related product IDs
//     visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
