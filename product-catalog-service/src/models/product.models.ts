export interface ProductInterface {
  title: string;
  image: string;
  summary: string;
  oldPrice: number;
  price: number;
  description: string;
  color?: string[];
  quantity: number;
  special?: boolean;
  brand?: string;
  reviews?: {
    username?: string;
    rating?: number;
    comment?: string;
    createdAt?: Date;
    uid?: string;
  }[];
  categories?: string[]; // Array of category IDs
  tags?: string[]; // Optional tags for filtering
  sku: string; // Stock keeping unit
  variants?: {
    size?: string;
    color?: string;
    price?: number;
    quantity: number;
  }[];
  discount?: {
    percentage?: number;
    amount?: number;
    expiresAt?: Date;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  availability?: "in-stock" | "out-of-stock" | "pre-order";
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  weight?: number;
  relatedProducts?: string[];
  visibility?: "public" | "private";
  createdAt: Date | number;
  updatedAt: Date | number;
}

class Product implements ProductInterface {
  title: string;
  image: string;
  summary: string;
  oldPrice: number;
  price: number;
  description: string;
  color?: string[];
  quantity: number;
  special?: boolean;
  brand?: string;
  reviews?: {
    username?: string;
    rating?: number;
    comment?: string;
    createdAt?: Date;
    uid?: string;
  }[];
  categories?: string[];
  tags?: string[];
  sku: string;
  variants?: {
    size?: string;
    color?: string;
    price?: number;
    quantity: number;
  }[];
  discount?: {
    percentage?: number;
    amount?: number;
    expiresAt?: Date;
  };
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  availability?: "in-stock" | "out-of-stock" | "pre-order";
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  weight?: number;
  relatedProducts?: string[];
  visibility?: "public" | "private";
  createdAt: Date | number;
  updatedAt: Date | number;

  constructor(productData: ProductInterface) {
    this.title = productData.title;
    this.image = productData.image;
    this.summary = productData.summary;
    this.oldPrice = productData.oldPrice;
    this.price = productData.price;
    this.description = productData.description;
    this.color = productData.color;
    this.quantity = productData.quantity;
    this.special = productData.special;
    this.brand = productData.brand;
    this.reviews = productData.reviews;
    this.categories = productData.categories;
    this.tags = productData.tags;
    this.sku = productData.sku;
    this.variants = productData.variants;
    this.discount = productData.discount;
    this.seo = productData.seo;
    this.availability = productData.availability;
    this.dimensions = productData.dimensions;
    this.weight = productData.weight;
    this.relatedProducts = productData.relatedProducts;
    this.visibility = productData.visibility;
    this.createdAt = productData.createdAt || new Date();
    this.updatedAt = productData.updatedAt || new Date();
  }

  //   calculateDiscountedPrice(): number {
  //     if (this.discount?.percentage) {
  //       return this.price - (this.price * this.discount.percentage) / 100;
  //     } else if (this.discount?.amount) {
  //       return this.price - this.discount.amount;
  //     }
  //     return this.price;
  //   }

  //   isAvailable(): boolean {
  //     return this.availability === "in-stock" && this.quantity > 0;
  //   }

  addReview(review: {
    username: string;
    rating: number;
    comment: string;
    uid: string;
  }): void {
    if (!this.reviews) {
      this.reviews = [];
    }
    this.reviews.push({ ...review, createdAt: new Date() });
    this.updatedAt = new Date();
  }

  //   updateQuantity(amount: number): void {
  //     if (this.quantity + amount < 0) {
  //       throw new Error("Quantity cannot be negative");
  //     }
  //     this.quantity += amount;
  //     this.updatedAt = new Date();
  //   }

  //   toJSON(): ProductInterface {
  //     return { ...this };
  //   }
}

export default Product;
