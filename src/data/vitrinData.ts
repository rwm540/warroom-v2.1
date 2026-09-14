/**
 * ویترین آثار (Showcase) — مدل داده و ابزارهای کمکی
 * ---------------------------------------------------------------
 * 📡 منبع اصلی داده‌ها: State سراسری App.tsx که با Supabase همگام است
 *    (جدول warroom_vitrin_posts / warroom_vitrin_comments).
 *
 * این ماژول فقط «آینه‌ی localStorage» را که هوک همگام‌سازی هر لحظه
 * به‌روزرسانی می‌کند می‌خواند تا کامپوننت‌های فرعی (مثل مودال ذخیره‌ها)
 * بدون Prop-Drilling به آخرین داده‌ها دسترسی داشته باشند.
 */

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
  // ✅ ویترین از طریق پنل مدیریت (تب «ویترین آثار») و تأیید آثار رزمندگان پر می‌شود.
];

// ---------------------------------------------------------------------------
// کلیدهای ذخیره‌سازی (آینه‌ی State سراسری)
// ---------------------------------------------------------------------------
export const SAVED_POSTS_STORAGE_KEY = 'warroom_saved_vitrin_posts';
export const VITRIN_COMMENTS_STORAGE_KEY = 'warroom_vitrin_comments';
export const VITRIN_CUSTOM_POSTS_STORAGE_KEY = 'warroom_vitrin_custom_posts';

// ---------------------------------------------------------------------------
// ذخیره‌های کاربری (Bookmark) — با کلید اختصاصی هر کاربر
// ---------------------------------------------------------------------------
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
    // 📡 اطلاع به App برای همگام‌سازی با Supabase
    try {
      window.dispatchEvent(new CustomEvent('warroom_saved_posts_changed', { detail: { userId, ids: next } }));
    } catch {}
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
    // 📡 اطلاع به App برای همگام‌سازی با Supabase
    try {
      window.dispatchEvent(new CustomEvent('warroom_saved_posts_changed', { detail: { userId, ids: next } }));
    } catch {}
  } catch (e) {
    console.error('Failed to remove saved post ID', e);
  }
}

// ---------------------------------------------------------------------------
// خواندن پست‌های ویترین از آینه‌ی localStorage (Source: State سراسری App)
// ---------------------------------------------------------------------------
export function getVitrinPostsFromStore(userId?: string): VitrinPost[] {
  try {
    const raw = localStorage.getItem(VITRIN_CUSTOM_POSTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const savedIds = getSavedPostIds(userId);
        return parsed.map((p: VitrinPost) => ({ ...p, isBookmarked: savedIds.includes(p.id) }));
      }
    }
  } catch (e) {
    console.error('Failed to load vitrin posts', e);
  }
  return [];
}

// ---------------------------------------------------------------------------
// نظرات ویترین — آرایه‌ی تخت (هر ردیف یک نظر) در localStorage
// ---------------------------------------------------------------------------
function readRawComments(): VitrinComment[] {
  try {
    const raw = localStorage.getItem(VITRIN_COMMENTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter(c => c && typeof c === 'object' && c.id);
    }
    // شکل قدیمی: Record<postId, VitrinComment[]> → تخت‌سازی می‌شود
    if (typeof parsed === 'object') {
      const flat: VitrinComment[] = [];
      Object.values(parsed).forEach(list => {
        if (Array.isArray(list)) flat.push(...list.filter(c => c && c.id));
      });
      return flat;
    }
  } catch (e) {
    console.error('Failed to load vitrin comments', e);
  }
  return [];
}

export function getAllVitrinComments(): VitrinComment[] {
  return readRawComments();
}

export function getAllComments(): Record<string, VitrinComment[]> {
  const flat = readRawComments();
  const map: Record<string, VitrinComment[]> = {};
  flat.forEach(c => {
    (map[c.postId] = map[c.postId] || []).push(c);
  });
  return map;
}

/**
 * افزودن/به‌روزرسانی یک نظر + انتشار رویداع برای همگام‌سازی با Supabase.
 * (State سراسری App این رویداد را شنیده و ردیف را در دیتابیس Upsert می‌کند)
 */
export function saveComment(comment: VitrinComment): Record<string, VitrinComment[]> {
  const flat = readRawComments();
  const idx = flat.findIndex(c => c.id === comment.id);
  const nextFlat = idx >= 0 ? flat.map(c => (c.id === comment.id ? comment : c)) : [comment, ...flat];
  try {
    localStorage.setItem(VITRIN_COMMENTS_STORAGE_KEY, JSON.stringify(nextFlat));
  } catch (e) {
    console.error('Failed to persist comment', e);
  }
  window.dispatchEvent(new CustomEvent('warroom_vitrin_comments_updated', { detail: nextFlat }));
  const map: Record<string, VitrinComment[]> = {};
  nextFlat.forEach(c => { (map[c.postId] = map[c.postId] || []).push(c); });
  return map;
}

/**
 * تغییر لایک یک نظر + همگام‌سازی با Supabase
 */
export function toggleCommentLike(postId: string, commentId: string): Record<string, VitrinComment[]> {
  const flat = readRawComments();
  const nextFlat = flat.map(c => {
    if (c.id === commentId) {
      const nextLiked = !c.isLiked;
      return {
        ...c,
        isLiked: nextLiked,
        likesCount: nextLiked ? (c.likesCount || 0) + 1 : Math.max(0, (c.likesCount || 0) - 1)
      };
    }
    return c;
  });
  try {
    localStorage.setItem(VITRIN_COMMENTS_STORAGE_KEY, JSON.stringify(nextFlat));
  } catch (e) {
    console.error('Failed to update comment like', e);
  }
  window.dispatchEvent(new CustomEvent('warroom_vitrin_comments_updated', { detail: nextFlat }));
  const map: Record<string, VitrinComment[]> = {};
  nextFlat.forEach(c => { (map[c.postId] = map[c.postId] || []).push(c); });
  return map;
}

/**
 * ساخت پست ویترین از یک اثر ارسالی رزمنده (تابع خالص — بدون Effect جانبی)
 * انتشار واقعی توسط caller از طریق setVitrinPosts (همگام با Supabase) انجام می‌شود.
 */
export function buildVitrinPostFromSubmission(sub: {
  id: string;
  user_name: string;
  personal_code: string;
  mission_title: string;
  file_path: string;
  file_name: string;
  file_type?: string;
  user_note?: string;
  awarded_score?: number;
}): VitrinPost {
  const fileName = sub.file_name || '';
  const fileType = sub.file_type || '';
  const isVideo = fileType.toLowerCase().includes('mp4') ||
                  fileName.toLowerCase().endsWith('.mp4') ||
                  fileName.toLowerCase().endsWith('.mov') ||
                  fileType.toLowerCase().includes('video');

  return {
    id: `sub_${sub.id}`,
    authorName: sub.user_name,
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    squadName: `رزمنده کد ${sub.personal_code}`,
    title: sub.mission_title,
    description: sub.user_note || `اثر ارسالی رزمنده ${sub.user_name} برای مأموریت ${sub.mission_title} که پس از ارزیابی داوران در ویترین منتخبین قرار گرفت.`,
    mediaUrl: sub.file_path && sub.file_path.startsWith('http')
      ? sub.file_path
      : isVideo
      ? 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80'
      : 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=800&q=80',
    videoSourceUrl: isVideo
      ? (sub.file_path && sub.file_path.startsWith('http') ? sub.file_path : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4')
      : undefined,
    mediaType: isVideo ? 'video' : 'image',
    likesCount: 0,
    isLikedByUser: false,
    ratingAverage: 5.0,
    commentsCount: 0,
    stageTag: sub.mission_title,
    badge: 'تأیید شده داوران ستاد',
    timeAgo: 'به تازگی',
    createdAtTimestamp: Date.now()
  };
}
