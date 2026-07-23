export type RoleType = 'admin' | 'leader' | 'user' | 'member';
export type EducationLevel = 'ابتدایی' | 'متوسطه اول' | 'متوسطه دوم';
export type Gender = 'پسر' | 'دختر';
export type SubmissionStatus = 'pending' | 'approved' | 'rejected';
export type TicketType = 'technical' | 'content' | 'judge' | 'other';
export type TicketStatus = 'open' | 'in_progress' | 'closed';
export type TargetRole = 'all' | 'user' | 'leader';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  national_code: string; // 10 digits
  phone: string; // 11 digits
  password: string;
  role: RoleType;
  education_level: EducationLevel;
  grade: string; // پایه تحصیلی (e.g. هفتم، هشتم، نهم، دهم...)
  gender: Gender;
  province: string;
  city: string;
  birth_date: string; // Jalali Solar Hijri string e.g. 1387/05/12
  school_name: string;
  personal_code: string; // Unique 9-digit code e.g. "839201745"
  group_id?: string;
  postal_code?: string;
  address?: string;
  avatar_url?: string;
}

export interface Group {
  id: string;
  leader_id: string;
  name: string; // نام جوخه
  members_count: number; // 2 to 6
  education_level: EducationLevel;
  gender: Gender;
  province: string;
  city: string;
  registration_code: string; // کد ثبت‌نام جوخه
  created_at: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  banner_path: string;
  video_url?: string;
  media_path?: string;
  media_type: 'image' | 'video' | 'audio' | 'document';
  max_score: number;
  is_active: boolean;
  is_optional: boolean;
  deadline?: string;
  created_at: string;
}

export interface MissionSubmission {
  id: string;
  user_id: string;
  user_name: string;
  personal_code: string;
  group_id?: string;
  mission_id: string;
  mission_title: string;
  file_path: string;
  file_name: string;
  file_size: string; // e.g. "12.4 MB"
  file_type: string; // extension
  user_note?: string;
  status: SubmissionStatus;
  awarded_score: number;
  admin_note?: string;
  submitted_at: string;
}

export interface Training {
  id: string;
  title: string;
  description: string;
  video_url?: string;
  media_path?: string;
  media_type: 'video' | 'audio' | 'image' | 'document' | 'iframe';
  target_role: TargetRole;
  is_active: boolean;
  category: string;
  created_at: string;
}

export interface Medal {
  id: string;
  name: string;
  description: string;
  image: string; // Icon or URL
  category?: string;
  is_active: boolean;
}

export interface UserMedal {
  id: string;
  personal_code: string;
  medal_id: string;
  medal_name?: string;
  note?: string;
  awarded_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  user_name: string;
  personal_code: string;
  subject: string;
  message: string;
  type: TicketType;
  status: TicketStatus;
  admin_id?: string;
  admin_type?: TicketType | 'general';
  created_at: string;
  updated_at: string;
}

export interface SupportReply {
  id: string;
  ticket_id: string;
  user_id: string;
  user_name: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

export interface SupportRole {
  user_id: string;
  role_type: TicketType | 'general';
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  image_path?: string;
  is_active: boolean;
  created_at: string;
  type?: 'urgent' | 'normal' | 'victory';
}

export interface News {
  id: string;
  title: string;
  description: string;
  image_path?: string;
  is_active: boolean;
  created_at: string;
  category?: string;
}
