export const TOKEN_COOKIE = "token";

export function setTokenCookie(token: string) {
  // 7 days, same-site lax to work with middleware
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(
    token
  )}; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax`;
}

export function clearTokenCookie() {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

