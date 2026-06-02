import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  LoginResponse,
  RegisterResponse,
} from "@/lib/auth-types";
import api from "@/lib/axios";
import { AxiosError } from "axios";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.message) return data.message;
    if (data?.errors?.[0]?.action) return data.errors[0].action;
  }
  return fallback;
}

export async function loginWithPassword(payload: {
  identifier: string;
  password: string;
}) {
  const { data } = await api.post<ApiSuccessResponse<LoginResponse>>(
    "/auth/login-password/",
    payload,
  );
  return data;
}

export async function registerUser(payload: {
  identifier: string;
  password?: string;
  full_name?: string;
}) {
  const { data } = await api.post<ApiSuccessResponse<RegisterResponse>>(
    "/auth/register/",
    payload,
  );
  return data;
}

export async function requestOtp(payload: { identifier: string }) {
  const { data } = await api.post<{ message: string }>(
    "/auth/request-otp/",
    payload,
  );
  return data;
}

export async function verifyOtp(payload: {
  identifier: string;
  code: string;
}) {
  const { data } = await api.post<ApiSuccessResponse<LoginResponse>>(
    "/auth/verify-otp/",
    payload,
  );
  return data;
}
