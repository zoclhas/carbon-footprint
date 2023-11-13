export interface User {
  id: string;
  name: string;
  roles?: ("admin" | "user" | "teacher" | "principal")[] | null;
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
export interface UserProps {
  exp: number;
  message: string;
  token: string;
  user: User;
}

export interface TodayLogsProps {
  emission_stats: EmissionStats;
  logs: Log[];
  activities: {
    today: Activites;
    month: Activites;
    year: Activites;
  };
  message?: string;
  user: {
    is_class_teacher: boolean;
    is_principal: boolean;
    name: string;
    roles: ("admin" | "user" | "teacher" | "principal")[];
    my_class?: { id: string; class_section: string };
  };
}

export interface EmissionStats {
  average_emission: AverageEmission;
  total_emission: TotalEmission;
}

export interface AverageEmission {
  today: number;
  month: number;
  year: number;
}

export interface TotalEmission {
  today: number;
  month: number;
  year: number;
}

export interface Log {
  timestamp: string;
  activity: string;
  distance: number;
  people: number;
  emission: number;
  id: string;
}

export interface MyClassProps {
  class_section: string;
  class_teacher: User;
  students: User[];
  student_with_highest_emission: {
    emission: number;
    student: User;
  };
  emissions_stats: EmissionsStats;
  message?: string;
}

interface EmissionsStats {
  todays_emission: Emissions;
  months_emission: Emissions;
  years_emission: Emissions;
}

interface Emissions {
  total: number;
  avg: number;
  activties: Activites;
}

export interface Activites {
  car: number;
  bus: number;
  metro: number;
  cycle: number;
  walk: number;
  plane: number;
}
