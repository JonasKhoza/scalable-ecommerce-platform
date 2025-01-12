export interface ProductInterface {
  _id: string;
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

export interface CartItemI {
  productId: string;
  quantity: number;
  totalPrice: number; // fetched from the product-catalog-service
}

export interface CartI {
  userId: string;
  items: CartItemI[];
  totalQuantity: number; //number of items in the cart
  overallTotalPrice: number; // total of thye number of items in the cart
}

class Cart implements CartI {
  userId: string;
  items: CartItemI[];
  totalQuantity: number;
  overallTotalPrice: number;

  constructor(
    userId: string,
    items: CartItemI[] = [],
    totalQuantity: number = 0,
    overallTotalPrice: number = 0
  ) {
    (this.userId = userId),
      (this.items = items),
      (this.totalQuantity = totalQuantity),
      (this.overallTotalPrice = overallTotalPrice);
  }

  //ADDING A PRODUCT TO CART
  //   addItemToCart(product: ProductInterface) {
  //     //State of the cart item
  //     let cartItem: CartItemI = {
  //       productId: product._id,
  //       totalPrice: +product.price,
  //       quantity: 1,
  //     };

  //     //Check if the product already is in the cart
  //     for (let i = 0; i < this.items.length; i++) {
  //       let item = this.items[i];

  //       //if it does exist in cart
  //       if (item.productId.toString() === product._id.toString()) {
  //         //Reassigning values to it
  //         cartItem.totalPrice = +item.totalPrice + product.price;
  //         cartItem.quantity = item.quantity + 1;
  //         //Add it to the existing cart
  //         this.items[i] = cartItem;

  //         //Update the total number of items in cart and total quantities
  //         this.totalQuantity++;
  //         this.overallTotalPrice += product.price;
  //       }

  //       return;
  //     }

  //     //If it doesn't exist in cart
  //     this.items.push(cartItem);
  //     this.totalQuantity++;
  //     this.overallTotalPrice += product.price;
  //   }

  addItemToCart(product: ProductInterface) {
    // Check if the product already exists in the cart
    const existingItem = this.items.find(
      (item) => item.productId === product._id
    );

    if (existingItem) {
      // If the item exists, update its quantity and total price
      existingItem.quantity += 1;
      existingItem.totalPrice = existingItem.quantity * product.price;
    } else {
      // If the item doesn't exist, add it to the cart
      const cartItem: CartItemI = {
        productId: product._id,
        quantity: 1,
        totalPrice: product.price,
      };
      this.items.push(cartItem);
    }

    // Update total quantity and price for the cart
    this.totalQuantity++;
    this.overallTotalPrice += product.price;
  }

  //UPDATE PRODUCT IN CART
  //   updateCartItemQuant(product: ProductInterface, newQuant: number) {
  //     const existingItem = this.items.find((item) => {
  //       item.productId.toString() === product._id.toString();
  //     });

  //     //In case of increasing the quant of the item
  //     if (existingItem && newQuant > 0) {
  //       const quantityChange = newQuant - existingItem.quantity;

  //       //Update existing item
  //       existingItem.quantity += newQuant;
  //       existingItem.totalPrice = newQuant * product.price;

  //       //Update whole cart data
  //       this.totalQuantity += quantityChange;
  //       this.overallTotalPrice += quantityChange * product.price;

  //       //Update the items array
  //       const itemIndex = this.items.findIndex(
  //         (item) => item.productId.toString() === product._id.toString()
  //       );

  //       this.items[itemIndex] = existingItem;
  //     }
  //   }

  updateCartItemQuant(product: ProductInterface, newQuant: number) {
    const existingItem = this.items.find(
      (item) => item.productId === product._id
    );

    if (existingItem && newQuant > 0) {
      // Calculate the difference in quantity
      const quantityChange = newQuant - existingItem.quantity;

      // Update item quantity and price
      existingItem.quantity = newQuant;
      existingItem.totalPrice = newQuant * product.price;

      // Update overall cart values
      this.totalQuantity += quantityChange;
      this.overallTotalPrice += quantityChange * product.price;
    }
  }

  //   removeCartItem(product: ProductInterface, newQuant: number) {
  //     const existingItem = this.items.find((item) => {
  //       item.productId.toString() === product._id.toString();
  //     });

  //     if (existingItem && newQuant <= 0) {
  //       const itemIndex = this.items.findIndex(
  //         (item) => item.productId.toString() === product._id.toString()
  //       );

  //       //Adjust items in cart state
  //       this.totalQuantity -= existingItem.quantity;
  //       this.overallTotalPrice -= existingItem.totalPrice;
  //       //Remove item from cart
  //       this.items.splice(itemIndex, 1);
  //     }
  //   }

  removeCartItem(product: ProductInterface) {
    const existingItemIndex = this.items.findIndex(
      (item) => item.productId === product._id
    );

    if (existingItemIndex !== -1) {
      const existingItem = this.items[existingItemIndex];

      // Adjust overall cart values
      this.totalQuantity -= existingItem.quantity;
      this.overallTotalPrice -= existingItem.totalPrice;

      // Remove the item from the cart
      this.items.splice(existingItemIndex, 1);
    }
  }
}

export { Cart };
