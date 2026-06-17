export type ApiErrorResponse = {
  error?: string;
  message?: string;
};

export type AuthRole = "admin" | "seller" | "customer";

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  role: AuthRole;
};

export type LoginResponse = {
  user: AuthUser;
  token?: string;
};

export type RegisterResponse = {
  message?: string;
};

export type ApiCategory = {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiProduct = {
  _id: string;
  sellerId?: string;
  name: string;
  slug: string;
  shopName?: string;
  category: string;
  brand?: string;
  description?: string;
  stock?: number;
  price: number;
  discount?: number;
  images?: string[];
  rating?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ApiReview = {
  _id?: string;
  productId?: string;
  name?: string;
  rating?: number;
  review?: string;
  createdAt?: string;
};

export type ApiCartItem = {
  _id: string;
  userId?: string;
  productId?: string;
  quantity?: number;
  product?: ApiProduct;
  productInfo?: ApiProduct;
};

export type ApiCartProductLine = {
  _id: string;
  quantity?: number;
  productInfo?: ApiProduct;
};

export type ApiCartSellerGroup = {
  sellerId?: string;
  shopName?: string;
  price?: number;
  products?: ApiCartProductLine[];
};

export type ApiCartListResponse = {
  card_products?: ApiCartSellerGroup[];
  cardProducts?: ApiCartItem[];
  price?: number;
  card_product_count?: number;
  shipping_fee?: number;
  buy_product_item?: number;
};

export type ApiWishlistItem = {
  _id: string;
  userId?: string;
  productId?: string;
  name?: string;
  price?: number;
  image?: string;
  discount?: number;
  rating?: number;
  slug?: string;
};

export type ApiWishlistResponse = {
  wishlistCount?: number;
  wishlist_count?: number;
  wishlists?: ApiWishlistItem[];
  wishlist_products?: ApiWishlistItem[];
};

export type CustomerDashboardData = {
  recentOrders?: ApiOrder[];
  pendingOrder?: number;
  cancelledOrder?: number;
  totalOrder?: number;
};

export type ApiSeller = {
  _id: string;
  name?: string;
  email?: string;
  shopName?: string;
  status?: string;
  image?: string;
  createdAt?: string;
};

export type ApiSellersResponse = {
  sellers?: ApiSeller[];
  requestSellers?: ApiSeller[];
  totalSeller?: number;
};

export type ChatMessagePayload = {
  senderId: string;
  receverId: string;
  message: string;
  productId?: string;
};

export type ApiChatMessage = ChatMessagePayload & {
  _id?: string;
  text?: string;
  createdAt?: string;
};

export type ApiChatContact = {
  _id?: string;
  fdId?: string;
  name?: string;
  email?: string;
  shopName?: string;
  image?: string;
};

export type ApiOrder = {
  _id: string;
  userId?: string;
  status?: string;
  price?: number;
  shipping_fee?: number;
  shippingInfo?: Record<string, unknown>;
  products?: Array<Record<string, unknown>>;
  createdAt?: string;
};

export type UserProfile = {
  id?: string;
  email?: string;
  name?: string;
  full_name?: string;
  image?: string | null;
  shopName?: string;
};

export type ListQuery = {
  page?: number;
  parPage?: number;
  searchValue?: string;
};

export type ProductQuery = {
  category?: string;
  rating?: number;
  lowPrice?: number;
  highPrice?: number;
  sortPrice?: "low-to-high" | "high-to-low";
  pageNumber?: number;
  searchValue?: string;
};

export type OrderQuery = {
  page?: number;
  parPage?: number;
  searchValue?: string;
  status?: string;
};

export type ApiCategoriesResponse = {
  categories: ApiCategory[];
};

export type ApiHomeProductsResponse = {
  products: ApiProduct[];
  latest_product?: ApiProduct[][];
  top_rated_product?: ApiProduct[];
  discount_product?: ApiProduct[];
};

export type ApiQueryProductsResponse = {
  products: ApiProduct[];
  totalProduct: number;
  parPage: number;
};

export type ApiProductDetailsResponse = {
  product: ApiProduct;
  relatedProducts?: ApiProduct[];
  reviews?: ApiReview[];
};

export type ApiPaginatedCategoriesResponse = {
  categorys: ApiCategory[];
  totalCategory: number;
};

export type PlaceOrderPayload = {
  userId: string;
  price: number;
  shipping_fee: number;
  shippingInfo: Record<string, unknown>;
  products: Array<Record<string, unknown>>;
};

export type AddToCartPayload = {
  userId: string;
  productId: string;
  quantity: number;
};

export type SubmitReviewPayload = {
  productId: string;
  name: string;
  rating: number;
  review: string;
};

/** @deprecated CMS not available in marketplace API */
export type ApiShopFaq = { id: string; question: string; answer: string };
/** @deprecated CMS not available in marketplace API */
export type ApiShopHeader = {
  id: string;
  text?: string;
  color?: string;
  image?: {
    image?: string;
    related_link?: string | null;
    text?: string;
    color?: string;
  };
};
/** @deprecated CMS not available in marketplace API */
export type ApiShopSlider = {
  id: string;
  text?: string;
  color?: string;
  position?: number;
  position_string?: string;
  images?: Array<{
    id?: string | number;
    image?: string;
    text?: string;
    color?: string;
    related_link?: string | null;
  }>;
};
/** @deprecated CMS not available in marketplace API */
export type ApiShopContact = {
  id?: string;
  instagram_channel?: string | null;
  telegram_channel?: string | null;
  contact_number?: string | null;
  contact_number_2?: string | null;
};
/** @deprecated CMS not available in marketplace API */
export type ApiShopRecommendation = {
  id?: string | number;
  text?: string;
  color?: string;
  related_link?: string | null;
  image?: string | Record<string, unknown>;
};
/** @deprecated Collections not available in marketplace API */
export type ApiCollection = { id: string; name: string; slug: string };
/** @deprecated */
export type ApiComment = ApiReview;
/** @deprecated */
export type ApiManagementOrder = ApiOrder;
/** @deprecated */
export type ApiSaleReview = Record<string, unknown>;
/** @deprecated */
export type ApiCheckpointItem = Record<string, unknown>;
/** @deprecated */
export type ApiContentImage = Record<string, unknown>;
