// Re-export from data/blog/index.ts
// This maintains backwards compatibility for imports from @/lib/constants/blog

export { allBlogPosts, default } from '@/data/blog';
export type { BlogPost } from '@/data/blog';

// Also export as BLOG_POSTS for backwards compatibility
import { allBlogPosts as importedPosts } from '@/data/blog';
export const BLOG_POSTS = importedPosts;
