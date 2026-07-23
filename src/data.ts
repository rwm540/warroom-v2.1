import { User, Group, Mission, MissionSubmission, Training, Medal, UserMedal, SupportTicket, SupportReply, Announcement, News } from './types';

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
  },
  {
    id: 'u-leader',
    first_name: 'محمدجواد',
    last_name: 'حسینی',
    national_code: '0087654321',
    phone: '09121111111',
    password: 'leader',
    role: 'leader',
    education_level: 'متوسطه دوم',
    grade: 'یازدهم',
    gender: 'پسر',
    province: 'اصفهان',
    city: 'اصفهان',
    birth_date: '1386/03/22',
    school_name: 'دبیرستان تیزهوشان شهید اژه‌ای',
    personal_code: '839201745',
    group_id: 'g-saegheh'
  },
  {
    id: 'u-member1',
    first_name: 'علی',
    last_name: 'رضایی',
    national_code: '0076543210',
    phone: '09122222222',
    password: '123',
    role: 'member',
    education_level: 'متوسطه دوم',
    grade: 'یازدهم',
    gender: 'پسر',
    province: 'اصفهان',
    city: 'اصفهان',
    birth_date: '1386/08/10',
    school_name: 'دبیرستان تیزهوشان شهید اژه‌ای',
    personal_code: '839201746',
    group_id: 'g-saegheh'
  },
  {
    id: 'u-member2',
    first_name: 'سینا',
    last_name: 'کریمی',
    national_code: '0065432109',
    phone: '09123333333',
    password: '123',
    role: 'member',
    education_level: 'متوسطه دوم',
    grade: 'یازدهم',
    gender: 'پسر',
    province: 'اصفهان',
    city: 'اصفهان',
    birth_date: '1386/05/04',
    school_name: 'دبیرستان تیزهوشان شهید اژه‌ای',
    personal_code: '839201747',
    group_id: 'g-saegheh'
  },
  {
    id: 'u-user1',
    first_name: 'زهرا',
    last_name: 'موسوی',
    national_code: '0054321098',
    phone: '09124444444',
    password: 'user',
    role: 'user',
    education_level: 'متوسطه اول',
    grade: 'نهم',
    gender: 'دختر',
    province: 'خراسان رضوی',
    city: 'مشهد',
    birth_date: '1388/11/20',
    school_name: 'دبیرستان فرزانگان مشهد',
    personal_code: '748192034'
  }
];

export const initialGroups: Group[] = [
  {
    id: 'g-saegheh',
    leader_id: 'u-leader',
    name: 'جوخه صاعقه مداری',
    members_count: 3,
    education_level: 'متوسطه دوم',
    gender: 'پسر',
    province: 'اصفهان',
    city: 'اصفهان',
    registration_code: 'WRS-7740',
    created_at: '1403/02/10'
  }
];

export const initialMissions: Mission[] = [
  {
    id: 'm-1',
    title: 'عملیات ۱: رصد و تحلیل نفوذ سایبری زیرساخت',
    description: 'در این مأموریت باید فایل لاگ شبکه‌ای شبیه‌سازی‌شده مربوط به سیستم ارتباطی ماهواره‌ای را تحلیل نموده، منشأ نفوذ، کدهای انحرافی و IP فرستنده ناشناس را استخراج و در قالب یک گزارش تحلیل فنی ارائه دهید.',
    banner_path: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    media_type: 'video',
    max_score: 100,
    is_active: true,
    is_optional: false,
    deadline: '۱۴۰۳/۰۴/۱۵',
    created_at: '۱۴۰۳/۰۱/۱۵'
  },
  {
    id: 'm-2',
    title: 'عملیات ۲: رمزگشایی کدهای کوانتومی و الگوریتم AES-256',
    description: 'یک پیام متنی رمزنگاری‌شده از فرستنده ناشناس جبهه دریافت شده است. با بهره‌گیری از ابزارهای هش و کلیدهای متقارن ارائه شده در کلاس، کد را رمزگشایی کرده و فرمول خروجی را ارسال نمایید.',
    banner_path: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    media_path: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    max_score: 150,
    is_active: true,
    is_optional: false,
    deadline: '۱۴۰۳/۰۴/۲۵',
    created_at: '۱۴۰۳/۰۱/۲۰'
  },
  {
    id: 'm-3',
    title: 'عملیات ۳: شبیه‌سازی دفاع هوایی و جنگ الکترونیک (پدافند)',
    description: 'طراحی نقشه دفاع استراتژیک برای ایستگاه ارتباطی منطقه‌ای در برابر سیگنال‌های اخلال‌گر (Jamming). گزارش بایستی شامل سناریوی مقابله و لایه‌های امنیتی باشد.',
    banner_path: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
    media_type: 'document',
    max_score: 200,
    is_active: true,
    is_optional: true,
    deadline: '۱۴۰۳/۰۵/۰۱',
    created_at: '۱۴۰۳/۰۲/۰۱'
  }
];

export const initialSubmissions: MissionSubmission[] = [
  {
    id: 'sub-1',
    user_id: 'u-leader',
    user_name: 'محمدجواد حسینی',
    personal_code: '839201745',
    group_id: 'g-saegheh',
    mission_id: 'm-1',
    mission_title: 'عملیات ۱: رصد و تحلیل نفوذ سایبری زیرساخت',
    file_path: '/uploads/report_cyber_leader.pdf',
    file_name: 'گزارش_تحلیل_نفوذ_جوخه_صاعقه.pdf',
    file_size: '4.2 MB',
    file_type: 'pdf',
    user_note: 'تحلیل کامل فایل لاگ با استخراج ۵ آی‌پی مشکوک و نمودار زمان‌بندی حمله انجام گردید.',
    status: 'approved',
    awarded_score: 95,
    admin_note: 'تحلیل بسیار عالی و دقیق. پاسخ کاملاً جامع بود.',
    submitted_at: '۱۴۰۳/۰۲/۱۲'
  },
  {
    id: 'sub-2',
    user_id: 'u-member1',
    user_name: 'علی رضایی',
    personal_code: '839201746',
    group_id: 'g-saegheh',
    mission_id: 'm-1',
    mission_title: 'عملیات ۱: رصد و تحلیل نفوذ سایبری زیرساخت',
    file_path: '/uploads/ali_logs.zip',
    file_name: 'تحلیل_شبکه_علی_رضایی.zip',
    file_size: '18.5 MB',
    file_type: 'zip',
    user_note: 'کدهای پایتون استخراج لاگ ضمیمه شد.',
    status: 'pending',
    awarded_score: 0,
    submitted_at: '۱۴۰۳/۰۲/۱۴'
  },
  {
    id: 'sub-3',
    user_id: 'u-user1',
    user_name: 'زهرا موسوی',
    personal_code: '748192034',
    mission_id: 'm-2',
    mission_title: 'عملیات ۲: رمزگشایی کدهای کوانتومی و الگوریتم AES-256',
    file_path: '/uploads/cipher_result.docx',
    file_name: 'رمزگشایی_نهایی_موسوی.docx',
    file_size: '1.8 MB',
    file_type: 'docx',
    user_note: 'کلید رمزگشایی با فرمول هش MD5 و کلید AES به‌دست آمد.',
    status: 'approved',
    awarded_score: 140,
    admin_note: 'رمزگشایی با موفقیت کامل انجام گردید.',
    submitted_at: '۱۴۰۳/۰۲/۱۵'
  }
];

export const initialTrainings: Training[] = [
  {
    id: 't-1',
    title: 'دوره پایه: اصول تحلیل لاگ و شناسایی حملات سایبری',
    description: 'در این دوره با مفاهیم پایه پروتکل‌های TCP/IP، لاگ فایل‌های ویندوز و لینوکس و روش‌های شناساگر نفوذ (IDS) آشنا می‌شوید.',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    media_type: 'video',
    target_role: 'all',
    is_active: true,
    category: 'امپراتوری سایبری',
    created_at: '۱۴۰۳/۰۱/۱۰'
  },
  {
    id: 't-2',
    title: 'تکنیک‌های فرماندهی جوخه و مدیریت تاکتیکی عملیات',
    description: 'راهنمای ویژه فرماندهان جوخه‌ها جهت تقسیم کار بین اعضا، زمان‌بندی ارسال پاسخ‌ها و هماهنگی تیمی.',
    media_path: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    media_type: 'image',
    target_role: 'leader',
    is_active: true,
    category: 'فرماندهی و مدیریت',
    created_at: '۱۴۰۳/۰۱/۱۲'
  },
  {
    id: 't-3',
    title: 'آشنایی با مبانی جنگ الکترونیک و سیگنالینگ',
    description: 'بررسی طیف‌های فرکانسی، روش‌های ضد اخلال و ایمن‌سازی لینک‌های ارتباطی بی‌سیم.',
    video_url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    media_type: 'video',
    target_role: 'user',
    is_active: true,
    category: 'پدافند غیرعامل',
    created_at: '۱۴۰۳/۰۱/۱۸'
  }
];

export const initialMedals: Medal[] = [
  {
    id: 'med-1',
    name: 'نشان فاتح سایبری',
    description: 'اهدا شده به دلیل کسب امتیاز کامل در مأموریت‌های سطح یک دفاع شبکه',
    image: '🛡️',
    category: 'عملیاتی',
    is_active: true
  },
  {
    id: 'med-2',
    name: 'مدال فرمانده ارشد برتر',
    description: 'ویژه فرماندهانی که تمامی اعضای جوخه خود را به مشارکت ۱۰۰ درصدی رسانده‌اند',
    image: '🎖️',
    category: 'فرماندهی',
    is_active: true
  },
  {
    id: 'med-3',
    name: 'نشان شجاعت و پدافند استراتژیک',
    description: 'اهدا شده جهت تحلیل‌های برتر در چالش‌های پیچیده غیرعامل',
    image: '🥇',
    category: 'پدافند',
    is_active: true
  },
  {
    id: 'med-4',
    name: 'نشان نخبه رمزگشایی کوانتوم',
    description: 'رمزگشایی موفق سریع‌ترین فایل‌های رمز شده در اتاق جنگ',
    image: '🔮',
    category: 'رمزنگاری',
    is_active: true
  }
];

export const initialUserMedals: UserMedal[] = [
  {
    id: 'um-1',
    personal_code: '839201745', // Commander
    medal_id: 'med-2',
    medal_name: 'مدال فرمانده ارشد برتر',
    note: 'تقدیر ویژه ستاد فرماندهی از هدایت عالی جوخه صاعقه مداری',
    awarded_at: '۱۴۰۳/۰۲/۱۵'
  },
  {
    id: 'um-2',
    personal_code: '839201745',
    medal_id: 'med-1',
    medal_name: 'نشان فاتح سایبری',
    note: 'قبولی در ارزیابی عملیات اول سایبری',
    awarded_at: '۱۴۰۳/۰۲/۱۲'
  },
  {
    id: 'um-3',
    personal_code: '748192034', // Zahra
    medal_id: 'med-4',
    medal_name: 'نشان نخبه رمزگشایی کوانتوم',
    note: 'پاسخ ممتاز در عملیات رمزگشایی AES',
    awarded_at: '۱۴۰۳/۰۲/۱۶'
  }
];

export const initialSupportTickets: SupportTicket[] = [
  {
    id: 'tick-101',
    user_id: 'u-leader',
    user_name: 'محمدجواد حسینی',
    personal_code: '839201745',
    subject: 'عدم امکان ویرایش نام یکی از اعضای جوخه',
    message: 'با سلام، هنگام اصلاح نام خانوادگی عضو جدید جوخه خطای شبکه دریافت می‌کنم. لطفاً بررسی فرمایید.',
    type: 'technical',
    status: 'in_progress',
    admin_id: 'u-admin',
    admin_type: 'technical',
    created_at: '۱۴۰۳/۰۲/۱۴ - ۱۰:۳۰',
    updated_at: '۱۴۰۳/۰۲/۱۴ - ۱۱:۱۵'
  },
  {
    id: 'tick-102',
    user_id: 'u-user1',
    user_name: 'زهرا موسوی',
    personal_code: '748192034',
    subject: 'سوال در خصوص مهلت ارسال مأموریت شماره ۲',
    message: 'آیا امکان تمدید مهلت ارسال مأموریت رمزگشایی تا پایان هفته وجود دارد؟',
    type: 'content',
    status: 'open',
    created_at: '۱۴۰۳/۰۲/۱۶ - ۱۶:۲۰',
    updated_at: '۱۴۰۳/۰۲/۱۶ - ۱۶:۲۰'
  }
];

export const initialSupportReplies: SupportReply[] = [
  {
    id: 'rep-1',
    ticket_id: 'tick-101',
    user_id: 'u-admin',
    user_name: 'پشتیبانی فنی اتاق جنگ',
    message: 'سلام فرمانده محترم. فرمت کد ملی عضو جدید بررسی شد و مشکل مرتفع گردید. مجدداً تلاش کنید.',
    is_admin: true,
    created_at: '۱۴۰۳/۰۲/۱۴ - ۱۱:۱۵'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: 'دستورالعمل عملیاتی شماره ۴: آغاز فاز دوم مسابقات ملی اتاق جنگ',
    message: 'تمامی رزمندگان و فرماندهان جوخه‌ها موظفند پاسخ مأموریت‌های فعال را حداکثر تا ۲۵ تیرماه در سامانه بارگذاری نمایند.',
    is_active: true,
    created_at: '۱۴۰۳/۰۲/۱۰',
    type: 'urgent'
  },
  {
    id: 'ann-2',
    title: 'اضافه شدن مدال‌های جدید فرماندهی و پدافند به سامانه',
    message: 'مدال‌های شجاعت و نخبه کوانتوم توسط ستاد داوری تعریف گردید و به برترین‌ها اهدا شد.',
    is_active: true,
    created_at: '۱۴۰۳/۰۲/۱۲',
    type: 'victory'
  }
];

export const initialNews: News[] = [
  {
    id: 'news-1',
    title: 'حضور بیش از ۵۰۰ جوخه دانش‌آموزی در مرحله مقدماتی اتاق جنگ',
    description: 'مرحله مقدماتی رقابت‌های پدافند غیرعامل و سایبری دانش‌آموزی با استقبال بی‌نظیر جوخه‌های سراسر کشور آغاز گردید.',
    image_path: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: '۱۴۰۳/۰۲/۰۱',
    category: 'اخبار مسابقات'
  },
  {
    id: 'news-2',
    title: 'برگزاری کارگاه‌های آنلاین آشنایی با هوش مصنوعی و امنیت شبکه',
    description: 'کارگاه‌های آموزشی ویژه رزمندگان و فرماندهان جوخه‌ها از ابتدای هفته آینده در بخش آموزش‌ها قابل دسترسی است.',
    image_path: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    is_active: true,
    created_at: '۱۴۰۳/۰۲/۰۵',
    category: 'رویدادها'
  }
];
