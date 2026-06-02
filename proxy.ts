import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_COOKIE = 'buypadi_admin_token';
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

function redirectToLogin(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL('/padi-admin/login', request.url);
  loginUrl.searchParams.set('next', `${pathname}${search}`);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

async function hasValidSession(token: string) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/admin-auth/session`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === '/padi-admin/login';
  const sessionToken = request.cookies.get(ADMIN_COOKIE)?.value;
  const hasMagicToken = Boolean(request.nextUrl.searchParams.get('token'));

  if (!sessionToken && !isLoginPage) {
    return redirectToLogin(request);
  }

  if (sessionToken && !(await hasValidSession(sessionToken))) {
    return isLoginPage ? NextResponse.next() : redirectToLogin(request);
  }

  if (sessionToken && isLoginPage && !hasMagicToken) {
    return NextResponse.redirect(new URL('/padi-admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/padi-admin/:path*',
};
