export type ApiErrorResponse = {
  message?: string;
  action?: string;
  errors?: Array<{
    action?: string;
    detail?: string;
    code?: string;
    attr?: string | null;
  }>;
};

export type PaginatedResponse<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
};

export type AuthUser = {
  id: string;
  is_active: boolean;
  is_owner: boolean;
  is_staff: boolean;
  is_superuser: boolean;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type LoginResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};

export type RegisterResponse = {
  user_id: string;
};

export type ApiSuccessResponse<T> = {
  message: string;
  data: T;
  action?: string;
};

export type ApiCategory = {
  id: string | number;
  name: string;
  slug: string;
  image?: string | null;
  description?: string;
  parent?: string | number | null;
  depth?: number;
};

export type ApiCategoryDetail = ApiCategory & {
  products?: ApiProduct[];
};

export type ApiCollection = {
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string;
};

export type ApiCollectionDetail = ApiCollection & {
  products?: ApiProduct[];
};

export type ApiProductImage = {
  id: string;
  image: string;
  is_primary?: boolean;
};

export type ApiProduct = {
  id: string;
  name: string;
  slug: string;
  price: string;
  discount_price?: string;
  discounts?: Array<{ id: string; percentage?: string }>;
  images?: ApiProductImage[];
  categories?: Array<Pick<ApiCategory, "id"> & Partial<ApiCategory>>;
  is_out_of_stock?: boolean;
  attribute?: string | Record<string, string>;
};

export type ApiCartItem = {
  id: string;
  product: ApiProduct;
  quantity: number;
};

export type ApiOrder = {
  id: string;
  status: string;
  total_price: string;
  total_discount_price?: string;
  items?: Array<{ id: string; quantity: number; product?: ApiProduct }>;
  created_at?: string;
};

export type ApiComment = {
  id: number | string;
  text?: string;
  comment?: string;
  rating?: number;
  reply_to?: number | string | null;
  replys?: ApiComment[];
  reactions?: unknown[];
  product?: number;
  user?: AuthUser;
  created_at?: string;
  updated_at?: string;
};

export type UserProfile = {
  id?: string;
  full_name?: string;
  image?: string | null;
  email?: string;
  phone?: string;
};

export type ApiContentImage = {
  id?: number | string;
  image?: string | null;
  related_link?: string | null;
  text?: string | null;
  color?: string | null;
};

export type ApiShopFaq = {
  id: number | string;
  question: string;
  answer: string;
};

export type ApiShopHeader = {
  id: number | string;
  text?: string | null;
  color?: string | null;
  image?: ApiContentImage | null;
};

export type ApiShopSlider = {
  id: number | string;
  text?: string | null;
  color?: string | null;
  position?: number | string;
  position_string?: string;
  images?: ApiContentImage[];
};

export type ApiShopContact = {
  id?: number | string;
  instagram_channel?: string | null;
  telegram_channel?: string | null;
  contact_number?: string | null;
  contact_number_2?: string | null;
};

export type ApiShopRecommendation = {
  id?: number | string;
  text?: string | null;
  color?: string | null;
  related_link?: string | null;
  image?: ApiContentImage | Record<string, unknown> | string | null;
};
