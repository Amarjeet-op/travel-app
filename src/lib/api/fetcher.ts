import { fetch } from 'undici';

export async function apiFetcher<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    credentials: 'include' as const,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    body: init?.body as string | undefined,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error((error as any).message || 'Request failed');
  }

  return res.json() as Promise<T>;
}
