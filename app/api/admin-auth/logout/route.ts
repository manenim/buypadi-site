import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'buypadi_admin_token';
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;

  if (token) {
    await fetch(`${BACKEND_API_URL}/admin-auth/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }).catch(() => null);
  }

  const response = NextResponse.redirect(new URL('/padi-admin/login', request.url));
  response.cookies.set({
    name: ADMIN_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
