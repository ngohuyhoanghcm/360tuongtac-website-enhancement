# Phase 3 Quick Start Guide

## 🚀 Getting Started with Phase 3 Features

This guide will help you start using the new Phase 3 features immediately.

---

## 1. Content Publishing Workflow

### Create a Draft Post

```typescript
import { saveBlogPostWorkflow } from '@/lib/admin/publishing-workflow';

const draftPost = {
  id: 'blog_' + Date.now(),
  slug: 'my-draft-post',
  title: 'My Draft Post',
  excerpt: 'This is a draft...',
  content: 'Full content here...',
  author: 'Your Name',
  date: new Date().toISOString().split('T')[0],
  readTime: '5 phút',
  category: 'Marketing',
  tags: ['tiktok', 'marketing'],
  imageUrl: '/images/blog/default.jpg',
  imageAlt: 'Blog post image',
  status: 'draft',                    // ← Draft status
  versionHistory: [],
  currentVersion: 1
};

const result = saveBlogPostWorkflow(draftPost);
console.log(result.message);
// "Blog post saved as draft"
```

### Submit for Review

```typescript
import { changeContentStatus } from '@/lib/admin/publishing-workflow';

const result = changeContentStatus(
  'blog',                              // Type
  'my-draft-post',                     // Slug
  'review',                            // New status
  'author@example.com',                // Author
  'editor@example.com'                 // Reviewer (optional)
);

console.log(result.message);
// "Status changed to review"
```

### Publish Content

```typescript
const result = changeContentStatus(
  'blog',
  'my-draft-post',
  'published',
  'author@example.com',
  'editor@example.com'
);

console.log(result.message);
// "Status changed to published"
```

### Rollback to Previous Version

```typescript
import { rollbackToVersion } from '@/lib/admin/publishing-workflow';

const result = rollbackToVersion(
  'blog',
  'my-draft-post',
  2,                                   // Target version
  'author@example.com'
);

console.log(result.message);
// "Rolled back to version 2"

// Content is restored and set to draft
if (result.success) {
  console.log(result.content);         // Restored content
}
```

---

## 2. SEO Audit System

### Audit a Single Blog Post

```typescript
import { auditBlogSEO } from '@/lib/admin/seo-audit';
import { BLOG_POSTS } from '@/lib/constants/blog';

const post = BLOG_POSTS[0];
const audit = auditBlogSEO(post);

console.log(`Overall Score: ${audit.overall}/100`);
console.log(`Title Score: ${audit.title}/100`);
console.log(`Content Score: ${audit.content}/100`);
console.log(`Issues Found: ${audit.issues.length}`);
console.log(`Checks Passed: ${audit.passedChecks}/${audit.totalChecks}`);

// List critical issues
audit.issues
  .filter(issue => issue.severity === 'critical')
  .forEach(issue => {
    console.log(`❌ ${issue.message}`);
    console.log(`   → ${issue.recommendation}`);
  });
```

### Get SEO Grade

```typescript
import { getSEOScoreGrade } from '@/lib/admin/seo-audit';

const grade = getSEOScoreGrade(85);
console.log(grade);
// { grade: 'A', color: 'green', message: 'Tốt' }
```

### Audit All Content

```typescript
import { generateSEOAuditReport } from '@/lib/admin/monitoring';

const report = generateSEOAuditReport();

console.log(`Overall Score: ${report.overallScore}`);
console.log(`Critical Issues: ${report.criticalIssues}`);
console.log(`Warnings: ${report.warnings}`);

// Top performers
report.blogPosts
  .sort((a, b) => b.score.overall - a.score.overall)
  .slice(0, 5)
  .forEach(post => {
    console.log(`${post.title}: ${post.score.overall}/100`);
  });
```

---

## 3. Content Search & Filtering

### Search Blog Posts

```typescript
import { searchBlogPosts } from '@/lib/admin/content-utils';

// Search by keyword
const tiktokPosts = searchBlogPosts({
  query: 'tiktok'
});

// Filter by category and SEO score
const highQualityMarketing = searchBlogPosts({
  category: 'Marketing',
  minSEOScore: 80
});

// Filter by date range and tags
const recentTiktokPosts = searchBlogPosts({
  tags: ['tiktok'],
  dateFrom: '2025-01-01',
  dateTo: '2025-12-31'
});

// Filter featured posts
const featuredPosts = searchBlogPosts({
  featured: true
});
```

### Search Services

```typescript
import { searchServices } from '@/lib/admin/content-utils';

const allServices = searchServices();
const tiktokServices = searchServices({ query: 'tiktok' });
```

---

## 4. Bulk Operations

### Bulk Update Posts

```typescript
import { bulkUpdateBlogPosts } from '@/lib/admin/content-utils';

const slugs = ['post-1', 'post-2', 'post-3'];
const updates = {
  featured: true,
  category: 'Featured'
};

const result = bulkUpdateBlogPosts(slugs, updates, 'admin@example.com');

console.log(`Processed: ${result.processed}`);
console.log(`Succeeded: ${result.succeeded}`);
console.log(`Failed: ${result.failed}`);
if (result.errors.length > 0) {
  console.log('Errors:', result.errors);
}
```

### Bulk Delete Posts

```typescript
import { bulkDeleteBlogPosts } from '@/lib/admin/content-utils';

const slugsToDelete = ['old-post-1', 'old-post-2'];
const result = bulkDeleteBlogPosts(slugsToDelete);

console.log(`Deleted: ${result.succeeded}`);
console.log(`Failed: ${result.failed}`);
```

---

## 5. Content Scheduling

### Schedule a Post

```typescript
import { scheduleContent } from '@/lib/admin/content-utils';

const result = scheduleContent(
  'blog',                              // Type
  'my-new-post',                       // Slug
  '2025-06-01T08:00:00Z'              // Publish date
);

console.log(result.message);
// "Scheduled blog "my-new-post" for 2025-06-01T08:00:00Z"
```

### View Scheduled Content

```typescript
import { getScheduledContent } from '@/lib/admin/content-utils';

const scheduled = getScheduledContent();
console.log(`Scheduled items: ${scheduled.length}`);

scheduled.forEach(item => {
  console.log(`${item.type}: ${item.slug} - ${item.publishDate}`);
});
```

---

## 6. Export/Import Content

### Export All Blog Posts

```typescript
import { exportContent } from '@/lib/admin/content-utils';

const exportData = exportContent('blog', 'json');

console.log(`Exported: ${exportData.totalCount} posts`);
console.log(`Format: ${exportData.format}`);
console.log(`Date: ${exportData.exportDate}`);

// Save to file
const fs = require('fs');
fs.writeFileSync(
  'blog-export.json',
  JSON.stringify(exportData.data, null, 2)
);
```

### Import Blog Posts

```typescript
import { importContent } from '@/lib/admin/content-utils';
import { readFileSync } from 'fs';

const jsonData = readFileSync('blog-export.json', 'utf-8');
const result = importContent('blog', jsonData);

console.log(`Imported: ${result.succeeded}`);
console.log(`Failed: ${result.failed}`);
if (result.errors.length > 0) {
  console.log('Errors:', result.errors);
}
```

---

## 7. Monitoring & Reporting

### Generate Dashboard Data

```typescript
import { generateDashboardData } from '@/lib/admin/monitoring';

const dashboard = generateDashboardData();

// Overview
console.log(`Total Blog Posts: ${dashboard.overview.totalBlogPosts}`);
console.log(`Total Services: ${dashboard.overview.totalServices}`);
console.log(`Avg SEO Score: ${dashboard.overview.avgSEOScore}`);
console.log(`Published This Month: ${dashboard.overview.publishedThisMonth}`);

// SEO Performance
console.log(`Excellent (90-100): ${dashboard.seoPerformance.excellentCount}`);
console.log(`Good (80-89): ${dashboard.seoPerformance.goodCount}`);
console.log(`Fair (70-79): ${dashboard.seoPerformance.fairCount}`);
console.log(`Poor (<70): ${dashboard.seoPerformance.poorCount}`);

// Top Performers
dashboard.seoPerformance.topPerformers.forEach(post => {
  console.log(`⭐ ${post.title}: ${post.score}/100`);
});

// Needs Improvement
dashboard.seoPerformance.needsImprovement.forEach(post => {
  console.log(`⚠️ ${post.title}: ${post.score}/100`);
});
```

### View Audit Trail

```typescript
import { getAuditTrail } from '@/lib/admin/monitoring';

// Get all recent actions
const allActions = getAuditTrail({}, 50);

// Filter by type
const blogActions = getAuditTrail({ type: 'blog' }, 50);

// Filter by action
const publishActions = getAuditTrail({ action: 'publish' }, 50);

// Filter by user
const userActions = getAuditTrail({ user: 'admin@example.com' }, 50);

// Filter by date range
const recentActions = getAuditTrail({
  dateFrom: '2025-05-01',
  dateTo: '2025-05-31'
}, 50);

allActions.forEach(action => {
  console.log(`${action.timestamp} - ${action.user} ${action.action} ${action.type}/${action.slug}`);
});
```

### Track SEO Score Over Time

```typescript
import { trackSEOScore, getSEOTrend } from '@/lib/admin/monitoring';
import { auditBlogSEO } from '@/lib/admin/seo-audit';
import { BLOG_POSTS } from '@/lib/constants/blog';

const post = BLOG_POSTS[0];
const audit = auditBlogSEO(post);

// Track today's score
trackSEOScore('blog', post.slug, audit);

// Get trend history
const trend = getSEOTrend('blog', post.slug);
console.log(`Score history: ${trend.length} entries`);

trend.forEach(entry => {
  console.log(`${entry.date}: ${entry.score}/100`);
});
```

### Get Content Health Summary

```typescript
import { getContentHealthSummary } from '@/lib/admin/monitoring';

const health = getContentHealthSummary();

console.log(`Total Content: ${health.totalContent}`);
console.log(`Healthy (80+): ${health.healthyContent}`);
console.log(`Needs Attention (60-79): ${health.needsAttention}`);
console.log(`Critical Issues: ${health.criticalIssues}`);
console.log(`Health Score: ${health.healthScore}%`);
```

---

## 8. View SEO Audit Dashboard

Access the SEO audit dashboard at:

```
http://localhost:3000/admin/seo-audit
```

Features:
- Overall SEO score
- Critical issues count
- Warnings count
- Per-post SEO scores
- Visual score bars
- Filter by severity
- Export reports

---

## 🎯 Common Workflows

### Workflow 1: Create and Publish a Blog Post

```typescript
// 1. Create draft
saveBlogPostWorkflow({ ...post, status: 'draft' });

// 2. Audit SEO
const audit = auditBlogSEO(post);
if (audit.overall < 80) {
  console.log('Fix SEO issues before publishing');
  audit.issues.forEach(issue => console.log(issue.message));
}

// 3. Submit for review
changeContentStatus('blog', post.slug, 'review', author);

// 4. Editor approves
changeContentStatus('blog', post.slug, 'published', author, editor);

// 5. Track SEO
trackSEOScore('blog', post.slug, audit);

// 6. Log action
logAuditTrail({
  action: 'publish',
  type: 'blog',
  slug: post.slug,
  user: editor,
  details: 'Published after review'
});
```

### Workflow 2: Bulk Update and Audit

```typescript
// 1. Find all posts with low SEO score
const lowScorePosts = searchBlogPosts({ minSEOScore: 70 });

// 2. Bulk update category
const slugs = lowScorePosts.map(p => p.slug);
bulkUpdateBlogPosts(slugs, { category: 'Needs Review' }, admin);

// 3. Re-audit all
lowScorePosts.forEach(post => {
  const audit = auditBlogSEO(post);
  trackSEOScore('blog', post.slug, audit);
});
```

### Workflow 3: Backup and Restore

```typescript
// 1. Export all content
const blogExport = exportContent('blog', 'json');
const serviceExport = exportContent('service', 'json');

// 2. Save to backup file
fs.writeFileSync(`backup-${Date.now()}.json`, JSON.stringify({
  blogs: blogExport.data,
  services: serviceExport.data
}));

// 3. Restore later
const backup = JSON.parse(fs.readFileSync('backup.json', 'utf-8'));
importContent('blog', JSON.stringify(backup.blogs));
importContent('service', JSON.stringify(backup.services));
```

---

## 🆘 Troubleshooting

**Q: How do I see version history?**
```typescript
import { getVersionHistory } from '@/lib/admin/publishing-workflow';

const history = getVersionHistory('blog', 'my-post');
history.versions?.forEach(v => {
  console.log(`v${v.version} - ${v.timestamp} - ${v.action}`);
});
```

**Q: How do I fix SEO issues?**
```typescript
const audit = auditBlogSEO(post);
audit.issues.forEach(issue => {
  console.log(`${issue.severity}: ${issue.message}`);
  console.log(`Fix: ${issue.recommendation}`);
});
```

**Q: How do I rollback a bad update?**
```typescript
// Get version history
const history = getVersionHistory('blog', 'my-post');

// Rollback to previous version
rollbackToVersion('blog', 'my-post', history.versions[0].version, author);
```

---

## 📞 Need Help?

- Check [PHASE3_SUMMARY.md](./PHASE3_SUMMARY.md) for detailed documentation
- Review [CONTENT_MANAGEMENT_SYSTEM_STRATEGY.md](../CONTENT_MANAGEMENT_SYSTEM_STRATEGY.md) for architecture
- Check console logs for error messages
- Review audit trail for action history

---

**Ready to use Phase 3 features!** 🎉

