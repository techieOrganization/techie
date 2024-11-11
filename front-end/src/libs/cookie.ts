import { cookies } from 'next/headers';

interface CookieSet {
  key: string;
  value: string;
  options?: {
    path?: string;
    maxAge?: number;
    expires?: Date;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
  };
}

export const cookieStore = cookies();

export const cookieSet = async (p0: string, params: CookieSet): Promise<void> => {
  const { key, value, options } = params;

  cookieStore.set(key, value, {
    path: options?.path || '/',
    maxAge: options?.maxAge,
    expires: options?.expires,
    secure: options?.secure || false,
    httpOnly: options?.httpOnly || false,
    sameSite: options?.sameSite || 'lax',
  });
};
