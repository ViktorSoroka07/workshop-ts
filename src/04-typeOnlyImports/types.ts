// Types that exist only at compile time — erased from emitted JavaScript.

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface RequestConfig {
  baseUrl: string;
  timeout: number;
  headers: Record<string, string>;
}

// A runtime value exported alongside types:
export const DEFAULT_HEADERS: Record<string, string> = {
  'Content-Type': 'application/json',
};
