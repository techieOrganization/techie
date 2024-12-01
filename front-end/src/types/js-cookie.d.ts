declare module 'js-cookie' {
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    [property: string]: string | boolean | number | Date | undefined;
  }

  interface CookiesStatic {
    get(name: string): string | undefined;
    getJSON<T = unknown>(name: string): T | undefined;
    set(name: string, value: string | object, options?: CookieAttributes): void;
    remove(name: string, options?: CookieAttributes): void;
  }

  const Cookies: CookiesStatic;
  export default Cookies;
}
