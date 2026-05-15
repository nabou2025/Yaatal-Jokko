const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('yaatal_token');
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('yaatal_token');
    window.location.href = '/login';
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur serveur');
  return data as T;
}

export const api = {
  get:    <T>(path: string) => request<T>(path, { method: 'GET' }),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  put:    <T>(path: string, body: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export const auth = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: User }>('/auth/login', { email, password }),
  register: (name: string, email: string, password: string, password_confirmation: string, role: string) =>
    api.post<{ token: string; user: User }>('/auth/register', { name, email, password, password_confirmation, role }),
  logout: () => api.post('/auth/logout', {}),
  me: () => api.get<{ user: User }>('/user'),
  saveToken: (token: string) => localStorage.setItem('yaatal_token', token),
  clearToken: () => localStorage.removeItem('yaatal_token'),
  isLoggedIn: () => !!getToken(),
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'learner' | 'teacher' | 'parent';
}

export interface Sign {
  id: number;
  title: string;
  description: string;
  category: 'alphabet' | 'word' | 'phrase';
  video_url?: string;
  image_url?: string;
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  signs?: Sign[];
  exercises?: Exercise[];
}

export interface Exercise {
  id: number;
  lesson_id: number;
  title: string;
  description: string;
  questions: Question[];
  lesson?: Lesson;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  answer: string;
}