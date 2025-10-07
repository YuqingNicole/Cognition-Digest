const AUTH_HEADER = "authorization"
const AUTH_COOKIE = "digest-token"

function extractBearer(headerValue: string | null): string | null {
  if (!headerValue) return null
  const value = headerValue.trim()
  if (!value.toLowerCase().startsWith("bearer ")) return null
  const token = value.slice(7).trim()
  return token.length ? token : null
}

function extractCookieToken(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null
  const cookies = cookieHeader.split(";")
  for (const part of cookies) {
    const [rawKey, ...rawValue] = part.trim().split("=")
    if (rawKey === AUTH_COOKIE && rawValue.length) {
      try {
        return decodeURIComponent(rawValue.join("="))
      } catch {
        return rawValue.join("=")
      }
    }
  }
  return null
}

function expectedTokens(): string[] {
  const token = process.env.DIGEST_TOKEN?.trim()
  if (!token) return []
  return token.split(",").map((entry) => entry.trim()).filter(Boolean)
}

export function readTokenFromRequest(req: Request): string | null {
  const headerToken = extractBearer(req.headers.get(AUTH_HEADER))
  if (headerToken) return headerToken
  return extractCookieToken(req.headers.get("cookie"))
}

export function isTokenAuthorized(token: string | null): boolean {
  const tokens = expectedTokens()
  if (!tokens.length) {
    // No token configured yet; allow all traffic (MVP fallback).
    return true
  }
  return token !== null && tokens.includes(token)
}

export function requireToken(req: Request): boolean {
  return isTokenAuthorized(readTokenFromRequest(req))
}

export function buildAuthHeaders(existing?: HeadersInit): HeadersInit {
  const tokens = expectedTokens()
  if (!tokens.length) return existing ?? {}

  const token = tokens[0]
  const headers = new Headers(existing ?? {})
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`)
  }
  return headers
}

export const authCookieName = AUTH_COOKIE
