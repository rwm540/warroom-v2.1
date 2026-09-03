export interface VitrinComment {
  id: string;
  postId: string;
  authorName: string;
  authorAvatar?: string;
  authorSquad?: string;
  authorRole?: string;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface VitrinPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  squadName: string;
  title: string;
  description: string;
  mediaUrl: string;
  videoSourceUrl?: string;
  mediaType: 'image' | 'video';
  likesCount: number;
  isLikedByUser: boolean;
  isBookmarked?: boolean;
  ratingAverage: number; // 1 to 5
  userRating?: number;
  commentsCount: number;
  stageTag: string;
  badge?: string;
  timeAgo?: string;
  createdAtTimestamp?: number;
}

export const initialVitrinPosts: VitrinPost[] = [
  {
    id: 'v1',
    authorName: 'سید علی حسینی',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    squadName: 'جوخه صاعقه ۱۲',
    title: 'ماکت عملیاتی قرارگاه تاکتیکی مرحله ۳',
    description: 'طراحی ماکت بازسازی شده از عملیات فتح با مقوا، چراغ‌های ال‌ای‌دی و چوب کبریت به نیابت از شهدای گردان فجر.',
    mediaUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    likesCount: 142,
    isLikedByUser: false,
    ratingAverage: 4.8,
    commentsCount: 4,
    stageTag: 'مرحله ۳ - فتح‌المبین',
    badge: 'برگزیده داوران',
    timeAgo: '۲ ساعت پیش'
  },
  {
    id: 'v2',
    authorName: 'زهرا کاظمی',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    squadName: 'جوخه نسترن‌های نور',
    title: 'مستند ویدیویی مصاحبه با جانباز محله',
    description: 'روایت شفاهی ناگفته‌های شب عملیات از زبان رزمنده پیشکسوت دفاع مقدس. همراه با عکس‌های دوران جنگ.',
    mediaUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80',
    videoSourceUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    mediaType: 'video',
    likesCount: 289,
    isLikedByUser: true,
    ratingAverage: 5.0,
    commentsCount: 5,
    stageTag: 'مرحله ۵ - روایت فتح',
    badge: '۵ ستاره طلایی',
    timeAgo: '۵ ساعت پیش'
  },
  {
    id: 'v3',
    authorName: 'محمدرضا پورمند',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    squadName: 'جوخه طوفان سرخ',
    title: 'کتابچه دیجیتال و تحلیل رمزشکنی',
    description: 'کتابچه مصور ۴۰ صفحه‌ای از تحلیل پیام‌های رمز و سرنخ‌های مرحله اول همراه با جدول کدهای مورس.',
    mediaUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    likesCount: 95,
    isLikedByUser: false,
    ratingAverage: 4.5,
    commentsCount: 3,
    stageTag: 'مرحله ۱ - سرنخ آغاز',
    timeAgo: 'دیروز'
  },
  {
    id: 'v4',
    authorName: 'فاطمه احمدی',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    squadName: 'جوخه پرواز',
    title: 'نقاشی دیجیتال کارآگاه تاریخ',
    description: 'طراحی چهره قهرمان داستان در سبک کمیک و دیجیتال آرت تقدیم به تمام رزمندگان گمنام وطن.',
    mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    likesCount: 310,
    isLikedByUser: false,
    ratingAverage: 4.9,
    commentsCount: 4,
    stageTag: 'مرحله ۲ - چهره‌های ماندگار',
    timeAgo: '۲ روز پیش'
  },
  {
    id: 'v5',
    authorName: 'امیرعلی رضایی',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    squadName: 'جوخه الفجر',
    title: 'پادکست صوتی رازهای خط مقدم',
    description: 'ضبط ۳ دقیقه‌ای با افکت‌های صدای بیسیم و باران در سنگر، بازخوانی وصیت‌نامه شهید باکری.',
    mediaUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    videoSourceUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    mediaType: 'video',
    likesCount: 180,
    isLikedByUser: false,
    ratingAverage: 4.7,
    commentsCount: 3,
    stageTag: 'مرحله ۴ - بیسیم‌چی',
    timeAgo: '۳ روز پیش'
  },
  {
    id: 'v6',
    authorName: 'مریم سلیمانی',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    squadName: 'جوخه یاس',
    title: 'گزارش روزنامه‌دیواری مدرسه ما',
    description: 'روزنامه دیواری ویژه دهه فجر و بازخوانی اسناد اتاق جنگ در تابلوی اعلانات دبیرستان زینبیه.',
    mediaUrl: 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?auto=format&fit=crop&w=800&q=80',
    mediaType: 'image',
    likesCount: 125,
    isLikedByUser: true,
    ratingAverage: 4.6,
    commentsCount: 3,
    stageTag: 'مرحله ۶ - رسانه سنگر',
    timeAgo: '۴ روز پیش'
  }
];

export const initialVitrinComments: Record<string, VitrinComment[]> = {
  v1: [
    {
      id: 'c1-1',
      postId: 'v1',
      authorName: 'محمدحسین حسنی',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه خیبر',
      content: 'خدا قوت هم‌سنگر! نورپردازی ال‌ای‌دی داخل سنگرها خیلی طبیعی دراومده، واقعاً عالیه.',
      createdAt: '۱ ساعت پیش',
      likesCount: 12,
      isLiked: false
    },
    {
      id: 'c1-2',
      postId: 'v1',
      authorName: 'زهرا میرزایی',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه نیلوفر',
      content: 'ما هم در مرحله ۳ گیر کرده بودیم، این ایده‌تون به جوخه ما هم خیلی انگیزه داد.',
      createdAt: '۴۵ دقیقه پیش',
      likesCount: 8,
      isLiked: true
    },
    {
      id: 'c1-3',
      postId: 'v1',
      authorName: 'فرمانده ستاد داوری',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'ستاد مرکزی',
      content: 'دقت در مقیاس‌های نظامی و شبیه‌سازی جاده‌های مواصلاتی قابل تقدیر است. نمره کامل ثبت شد.',
      createdAt: '۳۰ دقیقه پیش',
      likesCount: 24,
      isLiked: true
    },
    {
      id: 'c1-4',
      postId: 'v1',
      authorName: 'علی پورمحمدی',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه طوفان',
      content: 'دمت گرم داداش، امیدوارم رتبه اول کشوری رو بگیرید!',
      createdAt: '۱۰ دقیقه پیش',
      likesCount: 5,
      isLiked: false
    },
    {
      id: 'c1-5',
      postId: 'v1',
      authorName: 'فاطمه ابراهیمی',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه کوثر',
      content: 'خاکریزها و کانال‌های آب خیلی با جزئیات کار شدند. آفرین به پشتکارتون.',
      createdAt: '۸ دقیقه پیش',
      likesCount: 3,
      isLiked: false
    },
    {
      id: 'c1-6',
      postId: 'v1',
      authorName: 'احسان کاظمی',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه مالک اشتر',
      content: 'میشه ابعاد ماکت و جنس چسبی که استفاده کردید رو بفرمایید؟',
      createdAt: '۵ دقیقه پیش',
      likesCount: 2,
      isLiked: false
    },
    {
      id: 'c1-7',
      postId: 'v1',
      authorName: 'مهدی یوسفی',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه نینوا',
      content: '۵ ستاره ثبت شد، لایق رتبه برتر هفته هستید.',
      createdAt: '۳ دقیقه پیش',
      likesCount: 7,
      isLiked: true
    },
    {
      id: 'c1-8',
      postId: 'v1',
      authorName: 'زینب رضایی',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه فاطمیون',
      content: 'عالی و تمیز، روح شهدای عملیات فتح شاد.',
      createdAt: 'هم‌اکنون',
      likesCount: 1,
      isLiked: false
    }
  ],
  v2: [
    {
      id: 'c2-1',
      postId: 'v2',
      authorName: 'فاطمه موسوی',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه کوثر',
      content: 'اشک تو چشمام جمع شد وقتی حاج‌آقا از همرزمان شهیدش می‌گفت... اجر کارتون با شهدا.',
      createdAt: '۴ ساعت پیش',
      likesCount: 31,
      isLiked: true
    },
    {
      id: 'c2-2',
      postId: 'v2',
      authorName: 'سجاد رفیعی',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه ذوالفقار',
      content: 'کیفیت تدوین و نریشنتون در سطح صداوسیماست! آفرین به بچه‌های جوخه نسترن.',
      createdAt: '۳ ساعت پیش',
      likesCount: 19,
      isLiked: false
    },
    {
      id: 'c2-3',
      postId: 'v2',
      authorName: 'معاونت فرهنگی',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'ستاد داوری',
      content: 'این اثر به عنوان الگوی برتر برای سایر مدارس در کانال رسمی بازنشر خواهد شد.',
      createdAt: '۲ ساعت پیش',
      likesCount: 42,
      isLiked: true
    },
    {
      id: 'c2-4',
      postId: 'v2',
      authorName: 'نرگس کریمی',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه پرواز',
      content: 'میشه بفرمایید با چه نرم‌افزاری صدای باد و بیسیم رو حذف و ادیت کردید؟',
      createdAt: '۱ ساعت پیش',
      likesCount: 7,
      isLiked: false
    },
    {
      id: 'c2-5',
      postId: 'v2',
      authorName: 'مهدی ناصری',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه الفجر',
      content: 'بسیار تأثیرگذار و حرفه‌ای بود، موفق باشید.',
      createdAt: '۲۰ دقیقه پیش',
      likesCount: 3,
      isLiked: false
    },
    {
      id: 'c2-6',
      postId: 'v2',
      authorName: 'سارا حسینی',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه ریحانه',
      content: 'موسیقی متن انتهای ویدیو فوق‌العاده متناسب بود.',
      createdAt: '۱۵ دقیقه پیش',
      likesCount: 6,
      isLiked: true
    },
    {
      id: 'c2-7',
      postId: 'v2',
      authorName: 'امیرحسین اکبری',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه خیبر',
      content: 'دم همه بچه‌های تیم گرم، خیلی کیف کردیم.',
      createdAt: '۵ دقیقه پیش',
      likesCount: 4,
      isLiked: false
    }
  ],
  v3: [
    {
      id: 'c3-1',
      postId: 'v3',
      authorName: 'احسان باقری',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه صاعقه',
      content: 'تحلیل الگوریتم مورس صفحه ۱۲ واقعاً هوشمندانه بود، ما کلی زمان صرف اون کرده بودیم.',
      createdAt: '۱۸ ساعت پیش',
      likesCount: 14,
      isLiked: false
    },
    {
      id: 'c3-2',
      postId: 'v3',
      authorName: 'سارا تقوی',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه ریحانه',
      content: 'طراحی گرافیکی صفحات پی‌دی‌اف هم دست‌کمی از محتوای عالیش نداره. خسته نباشید.',
      createdAt: '۱۴ ساعت پیش',
      likesCount: 9,
      isLiked: true
    },
    {
      id: 'c3-3',
      postId: 'v3',
      authorName: 'امیرعباس رضایی',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه سلمان',
      content: 'فایل کامل پی‌دی‌اف رو چطور می‌تونیم برای مسابقه مدرسه استفاده کنیم؟',
      createdAt: '۵ ساعت پیش',
      likesCount: 4,
      isLiked: false
    }
  ],
  v4: [
    {
      id: 'c4-1',
      postId: 'v4',
      authorName: 'حامد شریفی',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه شهید همت',
      content: 'سبک تصویرسازی کمیک واقعاً برای بچه‌های نسل امروز جذاب و پرکشش است.',
      createdAt: '۱ روز پیش',
      likesCount: 22,
      isLiked: true
    },
    {
      id: 'c4-2',
      postId: 'v4',
      authorName: 'زینب کاویانی',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه یاس کبود',
      content: 'رنگ‌آمیزی چشم‌ها و سربند حماسی خیلی زیباست، با تبلت کشیدید یا فتوشاپ؟',
      createdAt: '۱ روز پیش',
      likesCount: 11,
      isLiked: false
    },
    {
      id: 'c4-3',
      postId: 'v4',
      authorName: 'کیوان اسدی',
      authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه ابوذر',
      content: 'لایک شد، حتماً ادامه بدید و برای بقیه مراحل هم کاراکتر بسازید.',
      createdAt: '۲۰ ساعت پیش',
      likesCount: 8,
      isLiked: false
    },
    {
      id: 'c4-4',
      postId: 'v4',
      authorName: 'مطهره احمدی',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه نور',
      content: 'خدا قوت به خواهر هنرمندم، ۵ ستاره طلایی دادم.',
      createdAt: '۸ ساعت پیش',
      likesCount: 6,
      isLiked: true
    }
  ],
  v5: [
    {
      id: 'c5-1',
      postId: 'v5',
      authorName: 'داوود قاسمی',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه میثم',
      content: 'صدای بیسیم و خش‌خش باران واقعاً حس خط مقدم رو زنده کرد، دمتون گرم.',
      createdAt: '۲ روز پیش',
      likesCount: 15,
      isLiked: false
    },
    {
      id: 'c5-2',
      postId: 'v5',
      authorName: 'حنانه صادقی',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه طوبی',
      content: 'لحن گویندگی رزمنده عالیه، کاملاً ریتم و ضرباهنگ متناسب با متن وصیت‌نامه است.',
      createdAt: '۱ روز پیش',
      likesCount: 12,
      isLiked: true
    },
    {
      id: 'c5-3',
      postId: 'v5',
      authorName: 'بنیامین صادقی',
      authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه صاعقه',
      content: 'پادکست فوق‌العاده‌ای بود، دانلودش کردم برای مراسم صبحگاه مدرسه.',
      createdAt: '۱۲ ساعت پیش',
      likesCount: 7,
      isLiked: false
    }
  ],
  v6: [
    {
      id: 'c6-1',
      postId: 'v6',
      authorName: 'سمانه نوری',
      authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه بنت‌الهدی',
      content: 'چیدمان تصاویر روزنامه دیواری خیلی تمیز و هماهنگه، مشخصه وقت زیادی گذاشتید.',
      createdAt: '۳ روز پیش',
      likesCount: 9,
      isLiked: false
    },
    {
      id: 'c6-2',
      postId: 'v6',
      authorName: 'پژمان رضایی',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'جوخه رعد',
      content: 'آفرین به شما، کار گروهی در مدارس مهم‌ترین بخش این رویداده.',
      createdAt: '۲ روز پیش',
      likesCount: 6,
      isLiked: false
    },
    {
      id: 'c6-3',
      postId: 'v6',
      authorName: 'مربی پرورشی ناحیه ۴',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
      authorSquad: 'ستاد آموزش و پرورش',
      content: 'در تابلوی برگزیدگان استانی قرار گرفتید. موفق و سربلند باشید.',
      createdAt: '۱ روز پیش',
      likesCount: 18,
      isLiked: true
    }
  ]
};

// Storage helper functions
export const SAVED_POSTS_STORAGE_KEY = 'warroom_saved_vitrin_posts';
export const VITRIN_COMMENTS_STORAGE_KEY = 'warroom_vitrin_comments';

export function getSavedPostIds(userId?: string): string[] {
  try {
    const key = userId ? `${SAVED_POSTS_STORAGE_KEY}_${userId}` : SAVED_POSTS_STORAGE_KEY;
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
    // fallback to generic key if user-specific is empty
    if (userId) {
      const fallback = localStorage.getItem(SAVED_POSTS_STORAGE_KEY);
      if (fallback) return JSON.parse(fallback);
    }
  } catch (e) {
    console.error('Failed to read saved post IDs', e);
  }
  return [];
}

export function savePostId(postId: string, userId?: string): boolean {
  try {
    const current = getSavedPostIds(userId);
    let next: string[];
    let isAdded = false;
    if (current.includes(postId)) {
      next = current.filter(id => id !== postId);
      isAdded = false;
    } else {
      next = [...current, postId];
      isAdded = true;
    }
    const key = userId ? `${SAVED_POSTS_STORAGE_KEY}_${userId}` : SAVED_POSTS_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(next));
    localStorage.setItem(SAVED_POSTS_STORAGE_KEY, JSON.stringify(next));
    return isAdded;
  } catch (e) {
    console.error('Failed to save post ID', e);
    return false;
  }
}

export function removeSavedPostId(postId: string, userId?: string): void {
  try {
    const current = getSavedPostIds(userId);
    const next = current.filter(id => id !== postId);
    const key = userId ? `${SAVED_POSTS_STORAGE_KEY}_${userId}` : SAVED_POSTS_STORAGE_KEY;
    localStorage.setItem(key, JSON.stringify(next));
    localStorage.setItem(SAVED_POSTS_STORAGE_KEY, JSON.stringify(next));
  } catch (e) {
    console.error('Failed to remove saved post ID', e);
  }
}

export function getAllComments(): Record<string, VitrinComment[]> {
  try {
    const raw = localStorage.getItem(VITRIN_COMMENTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge with initial comments so initial ones are never lost
      return { ...initialVitrinComments, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load comments', e);
  }
  return initialVitrinComments;
}

export function saveComment(comment: VitrinComment): Record<string, VitrinComment[]> {
  const all = getAllComments();
  const postComments = all[comment.postId] || [];
  const updatedPostComments = [comment, ...postComments];
  const updatedAll = {
    ...all,
    [comment.postId]: updatedPostComments
  };
  try {
    localStorage.setItem(VITRIN_COMMENTS_STORAGE_KEY, JSON.stringify(updatedAll));
  } catch (e) {
    console.error('Failed to persist comment', e);
  }
  return updatedAll;
}
