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

export type ApiErrorResponse = {
  message?: string;
  errors?: Array<{ action?: string; attr?: string | null }>;
};
