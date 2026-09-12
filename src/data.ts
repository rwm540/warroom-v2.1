import { User, Group, Mission, MissionSubmission, Training, Medal, UserMedal, SupportTicket, SupportReply, Announcement, News, AppNotification } from './types';

/**
 * داده‌های اولیه سامانه — پلتفرم اتاق جنگ
 * ---------------------------------------------------------------
 * ✅ تمام داده‌های پیش‌فرض/نمونه حذف شده‌اند.
 * تنها حساب پیش‌فرض باقی‌مانده، «مدیر ارشد عملیات» برای ورود به پنل مدیریت است:
 *      کد ملی: 0012345678  |  رمز عبور: admin
 *
 * در استقرار روی Supabase، همین حساب در فایل supabase/schema.sql به‌صورت
 * ردیف اولیه جدول warroom_users (با رمز هش‌شده SHA-256) ایجاد می‌شود.
 */
export const initialUsers: User[] = [
  {
    id: 'u-admin',
    first_name: 'امیرحسین',
    last_name: 'فرماندهی کل',
    national_code: '0012345678',
    phone: '09120000000',
    password: 'admin',
    role: 'admin',
    education_level: 'متوسطه دوم',
    grade: 'دوازدهم',
    gender: 'پسر',
    province: 'تهران',
    city: 'تهران',
    birth_date: '1384/01/15',
    school_name: 'دبیرستان ماندگار البرز',
    personal_code: '900000001',
    address: 'ستاد مرکزی اتاق جنگ'
  }
];

export const initialGroups: Group[] = [];

export const initialMissions: Mission[] = [];

export const initialSubmissions: MissionSubmission[] = [];

export const initialTrainings: Training[] = [];

export const initialMedals: Medal[] = [];

export const initialUserMedals: UserMedal[] = [];

export const initialSupportTickets: SupportTicket[] = [];

export const initialSupportReplies: SupportReply[] = [];

export const initialAnnouncements: Announcement[] = [];

export const initialNews: News[] = [];

export const initialNotifications: AppNotification[] = [];
