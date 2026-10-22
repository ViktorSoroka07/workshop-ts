// Shared type definitions — imported across the project via @app/types alias.
// This file demonstrates how a central types module keeps type definitions
// DRY and consistent across the codebase.

export type UserDto = {
  firstName: string;
  lastName: string;
  age?: number;
};

export type ShapeWithClassName<P = Record<string, unknown>> = P & {
  className?: string;
};

// API-related types used by the components and utils:
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
