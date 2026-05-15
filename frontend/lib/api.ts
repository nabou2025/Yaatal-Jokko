const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw json;
  return json;
}