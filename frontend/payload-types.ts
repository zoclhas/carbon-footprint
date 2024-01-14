export interface User {
  id: string;
  name: string;
  roles?: ("admin" | "user" | "teacher" | "supervisor" | "principal")[] | null;
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
    today: Activities;
    month: Activities;
    year: Activities;
  };
  message?: string;
  user: {
    is_class_teacher: boolean;
    is_supervisor: boolean;
    is_principal: boolean;
    name: string;
    user: string;
    roles: ("admin" | "user" | "teacher" | "principal")[];
    my_class?: { id: string; class_section: string };
    my_section?: { id: string; section: string };
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
  id: string;
  class_section: string;
  combined_class_section: string;
  class_teacher: User;
  students: User[];
  student_with_highest_emission: {
    emission: number;
    student: User;
  };
  emissions_stats: EmissionsStats;
  message?: string;
  send_message?: boolean;
}

interface EmissionsStats {
  todays_emission: Emissions;
  months_emission: Emissions;
  years_emission: Emissions;
}

interface Emissions {
  total: number;
  avg: number;
  activties: Activities;
}

export interface Activities {
  car: number;
  bus: number;
  metro: number;
  cycle: number;
  walk: number;
  plane: number;
}

export interface ClassStudent {
  message?: string;
  emission_stats: EmissionStats;
  logs: Log[];
  activities: {
    today: Activities;
    month: Activities;
    year: Activities;
  };
  student: {
    name: string;
    class: string;
  };
}

export interface Message {
  success?: boolean;
  message?: string;
  read: MessageProps;
  unread: MessageProps;
  show_sent: boolean;
}

export interface MessageProps {
  message?: string;
  totalDocs: number;
  docs: {
    id: string;
    from: {
      name: string;
    };
    to: {
      name: string;
    };
    message: string;
    createdAt: string;
    updatedAt: string;
    is_read: boolean;
  }[];
}

export interface MessageSendProps {
  message?: string;
  success?: boolean;
}

export interface Events {
  message?: string;
  current_upcoming: {
    totalDocs: number;
    docs: Event[];
  };
  previous: {
    totalDocs: number;
    docs: Event[];
  };
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
  updatedAt: string;
  createdAt: string;
}

export interface EventDetails {
  message?: string;
  event_data: Event;
  classes: {
    class_section: string;
    activity: {
      car: number;
      bus: number;
      metro: number;
      cycle: number;
      walk: number;
      plane: number;
    };
    total_emission: number;
  }[];
}

export interface MySectionProps {
  my_section: {
    id: string;
    supervisor: User;
    section: string;
    classes: MyClassProps[];
  };
  emissions_stats: {
    today: Emissions;
    month: Emissions;
    year: Emissions;
  };
  message?: string;
}
