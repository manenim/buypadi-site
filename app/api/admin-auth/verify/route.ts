import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'buypadi_admin_token';
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

type VerifyResponse = {
  data?: {
    sessionToken?: string;
    expiresAt?: string;
  };
  message?: string;
};

export async function POST(request: Request) {
  const payload = await request.json();
  const response = await fetch(`${BACKEND_API_URL}/admin-auth/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const body = (await response.json()) as VerifyResponse;

  if (!response.ok || !body.data?.sessionToken || !body.data?.expiresAt) {
    return Response.json(body, { status: response.status });
  }

  const expires = new Date(body.data.expiresAt);
  const result = NextResponse.json({
    message: body.message ?? 'Admin login verified',
    data: { expiresAt: body.data.expiresAt },
  });

  result.cookies.set({
    name: ADMIN_COOKIE,
    value: body.data.sessionToken,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires,
  });

  return result;
}
