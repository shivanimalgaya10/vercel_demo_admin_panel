import { api } from "./api";
import type { AuthUser } from "@/types";

export async function signup(payload: {
  name: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post<{ token: string; user: AuthUser }>(
    "/api/auth/signup",
    payload
  );
  return data;
}

export async function login(payload: { email: string; password: string }) {
  const { data } = await api.post<{ token: string; user: AuthUser }>(
    "/api/auth/login",
    payload
  );
  return data;
}

