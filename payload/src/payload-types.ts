/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    footprint: Footprint;
    classes: Class;
    supervisor: Supervisor;
    events: Event;
    messages: Message;
    surverys: Survery;
    waste: Waste;
    electricity: Electricity;
    media: Media;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
export interface User {
  id: string;
  name: string;
  roles?: ('admin' | 'principal' | 'supervisor' | 'teacher' | 'user')[] | null;
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
        activity: 'car' | 'bus' | 'metro' | 'cycle' | 'walk' | 'plane';
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
export interface Class {
  id: string;
  class: number;
  section: string;
  level?: ('senior' | 'middle' | 'primary') | null;
  class_teacher: string | User;
  students: (string | User)[];
  combined_class_section?: string | null;
  updatedAt: string;
  createdAt: string;
}
export interface Supervisor {
  id: string;
  supervisor: string | User;
  section: 'primary' | 'middle' | 'senior';
  classes: (string | Class)[];
  updatedAt: string;
  createdAt: string;
}
export interface Event {
  id: string;
  title: string;
  duration: {
    starts: string;
    ends: string;
  };
  description: {
    [k: string]: unknown;
  }[];
  send_mail: boolean;
  updatedAt: string;
  createdAt: string;
}
export interface Message {
  id: string;
  from: string | User;
  to: string | User;
  message: string;
  is_read?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
export interface Survery {
  id: string;
  user: string | User;
  cooking: 'non_clean' | 'clean' | 'none';
  vehicle: 'non_electric' | 'electric';
  updatedAt: string;
  createdAt: string;
}
export interface Waste {
  id: string;
  user: string | User;
  timestamp: string;
  waste: 'ewaste' | 'plastic' | 'paper' | 'glass' | 'can';
  quantity: number;
  emission?: number | null;
  updatedAt: string;
  createdAt: string;
}
export interface Electricity {
  id: string;
  user: string | User;
  consumption: number;
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
    relationTo: 'users';
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


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}