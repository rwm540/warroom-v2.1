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
  // ✅ داده پیش‌فرض حذف شد — ویترین پس از تأیید آثار توسط ادمین از طریق پنل مدیریت پر می‌شود.
  // در حالت Supabase، آثار تأییدشده در جدول warroom_vitrin_posts همگام‌سازی می‌شوند.
];

export const initialVitrinComments: Record<string, VitrinComment[]> = {
  // ✅ داده پیش‌فرض حذف شد — نظرات ویترین پس از ثبت واقعی کاربران ذخیره می‌شوند.
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

export const VITRIN_CUSTOM_POSTS_STORAGE_KEY = 'warroom_vitrin_custom_posts';

export function getCustomVitrinPosts(): VitrinPost[] {
  try {
    const raw = localStorage.getItem(VITRIN_CUSTOM_POSTS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load custom vitrin posts', e);
  }
  return [];
}

export function getAllVitrinPosts(userId?: string): VitrinPost[] {
  const custom = getCustomVitrinPosts();
  const savedIds = getSavedPostIds(userId);
  const combined = [...custom, ...initialVitrinPosts];
  return combined.map(p => ({
    ...p,
    isBookmarked: savedIds.includes(p.id)
  }));
}

export function publishSubmissionToVitrin(sub: {
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
  const custom = getCustomVitrinPosts();
  const fileName = sub.file_name || '';
  const fileType = sub.file_type || '';
  const isVideo = fileType.toLowerCase().includes('mp4') || 
                  fileName.toLowerCase().endsWith('.mp4') || 
                  fileName.toLowerCase().endsWith('.mov') ||
                  fileType.toLowerCase().includes('video');
  
  const newPost: VitrinPost = {
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
    likesCount: 24,
    isLikedByUser: false,
    ratingAverage: 5.0,
    commentsCount: 1,
    stageTag: sub.mission_title,
    badge: 'تأیید شده داوران ستاد',
    timeAgo: 'به تازگی'
  };

  const filtered = custom.filter(p => p.id !== newPost.id);
  const updated = [newPost, ...filtered];
  try {
    localStorage.setItem(VITRIN_CUSTOM_POSTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to store vitrin post', e);
  }
  window.dispatchEvent(new CustomEvent('warroom_vitrin_updated'));
  return newPost;
}

export function removeSubmissionFromVitrin(submissionId: string): void {
  const custom = getCustomVitrinPosts();
  const updated = custom.filter(p => p.id !== `sub_${submissionId}` && p.id !== submissionId);
  try {
    localStorage.setItem(VITRIN_CUSTOM_POSTS_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to remove vitrin post', e);
  }
  window.dispatchEvent(new CustomEvent('warroom_vitrin_updated'));
}
