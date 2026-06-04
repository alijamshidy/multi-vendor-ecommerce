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
  id: string;
  name: string;
  slug: string;
  image?: string | null;
  description?: string;
  parent?: string | null;
  depth?: number;
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
  images?: ApiProductImage[];
  categories?: ApiCategory[];
  is_out_of_stock?: boolean;
  attribute?: string;
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
  id: string;
  comment: string;
  rating?: number;
  user?: AuthUser;
  created_at?: string;
};

export type UserProfile = {
  id?: string;
  full_name?: string;
  image?: string | null;
  email?: string;
  phone?: string;
};
