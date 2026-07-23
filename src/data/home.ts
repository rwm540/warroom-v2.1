export interface HomeAnnouncement {
  id: string;
  title: string;
  message: string;
  imageUrl?: string;
  createdAt: string;
  isActive: boolean;
  isNew?: boolean;
}

export interface HomeStats {
  activeMissions: number;
  activeParticipants: number;
  activeGroups: number;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const initialHomeAnnouncements: HomeAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'دستورالعمل عملیاتی شماره ۴: آغاز فاز دوم مسابقات',
    message: 'تمامی رزمندگان و فرماندهان جوخه‌ها موظفند پاسخ مأموریت‌های فعال را حداکثر تا ۲۵ تیرماه در سامانه بارگذاری نمایند.',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=400&q=80',
    createdAt: '۱۴۰۳/۰۴/۱۸',
    isActive: true,
    isNew: true
  },
  {
    id: 'ann-2',
    title: 'افتتاح بخش آموزش‌های هوش مصنوعی و امنیت شبکه',
    message: 'دوره جدید ارتقای مهارت در بخش آموزش‌های قرارگاه فعال شد. هم‌اکنون می‌توانید ویدئوها و جزوات آموزشی را مشاهده نمایید.',
    imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
    createdAt: '۱۴۰۳/۰۴/۱۵',
    isActive: true,
    isNew: true
  },
  {
    id: 'ann-3',
    title: 'اهدای مدال‌های شجاعت و نخبگی به جوخه‌های برتر',
    message: 'مدال‌های افتخار دوره اول ارزیابی توسط هیئت داوران ستاد به حساب کاربری رزمندگان برتر اعطا گردید.',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=400&q=80',
    createdAt: '۱۴۰۳/۰۴/۱۰',
    isActive: true,
    isNew: false
  }
];

export const homeStatsData: HomeStats = {
  activeMissions: 18,
  activeParticipants: 1420,
  activeGroups: 156
};

export const faqsData: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'چگونه در مسابقه ثبت‌نام کنم؟',
    answer: 'برای ثبت‌نام، دکمه «شروع ثبت‌نام» را انتخاب کرده و فرم اطلاعات فردی و مدرسه‌ای را تکمیل کنید. پس از تایید، کد اختصاصی رزمنده برای شما صادر می‌شود.'
  },
  {
    id: 'faq-2',
    question: 'آیا می‌توانم به‌صورت گروهی شرکت کنم؟',
    answer: 'بله، هر جوخه می‌تواند شامل ۲ تا ۶ رزمنده باشد. فرمانده جوخه با ایجاد گروه و دریافت «کد ثبت‌نام جوخه»، اعضای دیگر را به جوخه دعوت می‌کند.'
  },
  {
    id: 'faq-3',
    question: 'مأموریت‌ها چگونه ارزیابی می‌شوند؟',
    answer: 'مأموریت‌ها پس از ارسال توسط رزمندگان، توسط هیئت داوران ستاد مرکزی بررسی شده و بر اساس دقت، خلاقیت و کیفیت خروجی، امتیاز و مدال تعلق می‌گیرد.'
  },
  {
    id: 'faq-4',
    question: 'برای دریافت پشتیبانی چه کاری انجام دهم؟',
    answer: 'در صورت بروز هرگونه مشکل فنی، سوال آموزشی یا حقوقی، می‌توانید از بخش «پشتیبانی» تیکت جدید ارسال نموده و پاسخ کارشناسان را پیگیری کنید.'
  }
];
