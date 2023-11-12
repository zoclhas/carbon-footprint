export interface User {
  id: string;
  name: string;
  roles?: ("admin" | "user")[] | null;
  updatedAt: string;
  createdAt: string;
  enableAPIKey?: boolean | null;
  apiKey?: string | null;
  apiKeyIndex?: string | null;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
export interface Footprint {
  id: string;
  user: string | User;
  logs?:
    | {
        timestamp: string;
        activity: "car" | "bus" | "metro" | "cycle" | "walk" | "plane";
        distance: number;
        people: number;
        emission?: number | null;
        id?: string | null;
      }[]
    | null;
  emission_stats?: {
    average_emission?: {
      today?: number | null;
      month?: number | null;
      year?: number | null;
    };
    total_emission?: {
      today?: number | null;
      month?: number | null;
      year?: number | null;
    };
  };
  updatedAt: string;
  createdAt: string;
}
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    feature?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
export interface PayloadPreference {
  id: string;
  user: {
    relationTo: "users";
    value: string | User;
  };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}
