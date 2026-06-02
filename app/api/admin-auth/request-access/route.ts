const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export async function POST() {
  const response = await fetch(`${BACKEND_API_URL}/admin-auth/request-access`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  const body = await response.json();

  return Response.json(body, { status: response.status });
}
