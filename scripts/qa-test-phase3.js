/**
 * QA/QC Test Script - Phase 3 CMS System
 * Comprehensive testing for all Phase 3 features
 */

const fs = require('fs');
const path = require('path');

// Test results storage
const testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function logTest(category, name, status, details = '') {
  testResults.total++;
  if (status === 'PASS') testResults.passed++;
  else if (status === 'FAIL') testResults.failed++;
  else if (status === 'WARN') testResults.warnings++;
  
  testResults.tests.push({
    category,
    name,
    status,
    details,
    timestamp: new Date().toISOString()
  });
  
  const icon = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️';
  console.log(`${icon} [${category}] ${name}${details ? ': ' + details : ''}`);
}

console.log('='.repeat(80));
console.log('🧪 PHASE 3 CMS SYSTEM - QA/QC TEST SUITE');
console.log('='.repeat(80));
console.log('');

// ==========================================
// TEST SUITE 1: File Structure & Build
// ==========================================
console.log('\n📦 TEST SUITE 1: File Structure & Build Verification');
console.log('-'.repeat(80));

const requiredFiles = [
  'lib/admin/publishing-workflow.ts',
  'lib/admin/seo-audit.ts',
  'lib/admin/content-utils.ts',
  'lib/admin/monitoring.ts',
  'app/admin/seo-audit/page.tsx'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    const stats = fs.statSync(fullPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    logTest('Build', `File exists: ${file}`, 'PASS', `${sizeKB} KB`);
  } else {
    logTest('Build', `File exists: ${file}`, 'FAIL', 'File not found');
  }
});

// Check .next build output
const buildOutput = path.join(process.cwd(), '.next');
if (fs.existsSync(buildOutput)) {
  logTest('Build', 'Build output directory exists', 'PASS');
  
  const staticFiles = path.join(buildOutput, 'static');
  if (fs.existsSync(staticFiles)) {
    logTest('Build', 'Static assets compiled', 'PASS');
  } else {
    logTest('Build', 'Static assets compiled', 'WARN', 'Static directory not found');
  }
} else {
  logTest('Build', 'Build output directory exists', 'FAIL', 'Run npm run build first');
}

// ==========================================
// TEST SUITE 2: Publishing Workflow System
// ==========================================
console.log('\n\n🔄 TEST SUITE 2: Publishing Workflow System');
console.log('-'.repeat(80));

try {
  const workflow = require('./lib/admin/publishing-workflow');
  
  // Test 1: Module exports
  const requiredExports = [
    'saveBlogPostWorkflow',
    'saveServiceWorkflow',
    'changeContentStatus',
    'rollbackToVersion',
    'getVersionHistory',
    'getContentByStatus',
    'getScheduledContent',
    'publishScheduledContent',
    'getContentPreview',
    'deleteContentWorkflow'
  ];
  
  requiredExports.forEach(exportName => {
    if (typeof workflow[exportName] === 'function') {
      logTest('Workflow', `Export: ${exportName}`, 'PASS', 'Function exists');
    } else {
      logTest('Workflow', `Export: ${exportName}`, 'FAIL', 'Function not found');
    }
  });
  
  // Test 2: Directory initialization
  const workflowDir = path.join(process.cwd(), 'data', 'workflow');
  if (fs.existsSync(workflowDir)) {
    logTest('Workflow', 'Workflow directories created', 'PASS');
    
    const blogDir = path.join(workflowDir, 'blog');
    const serviceDir = path.join(workflowDir, 'services');
    
    if (fs.existsSync(blogDir)) {
      logTest('Workflow', 'Blog workflow directory', 'PASS');
    } else {
      logTest('Workflow', 'Blog workflow directory', 'FAIL');
    }
    
    if (fs.existsSync(serviceDir)) {
      logTest('Workflow', 'Service workflow directory', 'PASS');
    } else {
      logTest('Workflow', 'Service workflow directory', 'FAIL');
    }
  } else {
    logTest('Workflow', 'Workflow directories created', 'FAIL', 'Directories not initialized');
  }
  
  // Test 3: Version history directory
  const versionsDir = path.join(process.cwd(), 'data', 'workflow', 'versions');
  if (fs.existsSync(versionsDir)) {
    logTest('Workflow', 'Version history directory', 'PASS');
  } else {
    logTest('Workflow', 'Version history directory', 'FAIL');
  }
  
} catch (error) {
  logTest('Workflow', 'Module loading', 'FAIL', error.message);
}

// ==========================================
// TEST SUITE 3: SEO Audit System
// ==========================================
console.log('\n\n🔍 TEST SUITE 3: SEO Audit System');
console.log('-'.repeat(80));

try {
  const seoAudit = require('./lib/admin/seo-audit');
  
  // Test 1: Module exports
  const seoExports = [
    'auditBlogSEO',
    'auditServiceSEO',
    'generateSEOAuditReport',
    'getIssuesBySeverity',
    'getSEOScoreGrade'
  ];
  
  seoExports.forEach(exportName => {
    if (typeof seoAudit[exportName] === 'function') {
      logTest('SEO Audit', `Export: ${exportName}`, 'PASS', 'Function exists');
    } else {
      logTest('SEO Audit', `Export: ${exportName}`, 'FAIL', 'Function not found');
    }
  });
  
  // Test 2: SEO scoring logic
  const mockPost = {
    id: 'test-1',
    slug: 'test-post',
    title: 'Test Post Title',
    excerpt: 'This is a test post excerpt for testing purposes',
    content: 'Test content that is long enough to pass validation checks and provide meaningful analysis for SEO scoring system',
    author: 'Test Author',
    date: '2025-05-07',
    readTime: '5 phút',
    category: 'Marketing',
    tags: ['test', 'qa', 'seo'],
    imageUrl: '/images/test.jpg',
    imageAlt: 'Test image for QA',
    metaTitle: 'Test Post Title | Blog - 360TuongTac',
    metaDescription: 'This is a test meta description for SEO audit testing purposes with proper length',
    featured: false,
    seoScore: 0
  };
  
  try {
    const audit = seoAudit.auditBlogSEO(mockPost);
    
    if (audit.overall >= 0 && audit.overall <= 100) {
      logTest('SEO Audit', 'SEO score range (0-100)', 'PASS', `Score: ${audit.overall}`);
    } else {
      logTest('SEO Audit', 'SEO score range (0-100)', 'FAIL', `Invalid score: ${audit.overall}`);
    }
    
    if (audit.issues && Array.isArray(audit.issues)) {
      logTest('SEO Audit', 'Issues array returned', 'PASS', `${audit.issues.length} issues found`);
    } else {
      logTest('SEO Audit', 'Issues array returned', 'FAIL');
    }
    
    if (audit.passedChecks && audit.totalChecks) {
      logTest('SEO Audit', 'Check counters present', 'PASS', `${audit.passedChecks}/${audit.totalChecks} passed`);
    } else {
      logTest('SEO Audit', 'Check counters present', 'FAIL');
    }
    
    // Test individual category scores
    const categories = ['title', 'meta', 'content', 'images', 'technical', 'schema'];
    categories.forEach(cat => {
      if (audit[cat] >= 0 && audit[cat] <= 100) {
        logTest('SEO Audit', `${cat} score valid`, 'PASS', `${audit[cat]}/100`);
      } else {
        logTest('SEO Audit', `${cat} score valid`, 'FAIL', `Invalid: ${audit[cat]}`);
      }
    });
    
  } catch (error) {
    logTest('SEO Audit', 'Audit execution', 'FAIL', error.message);
  }
  
  // Test 3: Grade system
  try {
    const grades = [
      { score: 95, expected: 'A+' },
      { score: 85, expected: 'A' },
      { score: 75, expected: 'B' },
      { score: 65, expected: 'C' },
      { score: 50, expected: 'D' }
    ];
    
    grades.forEach(({ score, expected }) => {
      const grade = seoAudit.getSEOScoreGrade(score);
      if (grade.grade === expected) {
        logTest('SEO Audit', `Grade ${score} → ${expected}`, 'PASS');
      } else {
        logTest('SEO Audit', `Grade ${score} → ${expected}`, 'FAIL', `Got: ${grade.grade}`);
      }
    });
  } catch (error) {
    logTest('SEO Audit', 'Grade system', 'FAIL', error.message);
  }
  
} catch (error) {
  logTest('SEO Audit', 'Module loading', 'FAIL', error.message);
}

// ==========================================
// TEST SUITE 4: Content Management Utilities
// ==========================================
console.log('\n\n📚 TEST SUITE 4: Content Management Utilities');
console.log('-'.repeat(80));

try {
  const contentUtils = require('./lib/admin/content-utils');
  
  // Test 1: Module exports
  const utilExports = [
    'searchBlogPosts',
    'searchServices',
    'bulkUpdateBlogPosts',
    'bulkDeleteBlogPosts',
    'scheduleContent',
    'getScheduledContent',
    'exportContent',
    'importContent',
    'getContentStats'
  ];
  
  utilExports.forEach(exportName => {
    if (typeof contentUtils[exportName] === 'function') {
      logTest('Content Utils', `Export: ${exportName}`, 'PASS', 'Function exists');
    } else {
      logTest('Content Utils', `Export: ${exportName}`, 'FAIL', 'Function not found');
    }
  });
  
  // Test 2: Search functionality
  try {
    const posts = contentUtils.searchBlogPosts();
    if (Array.isArray(posts)) {
      logTest('Content Utils', 'Search returns array', 'PASS', `${posts.length} posts found`);
    } else {
      logTest('Content Utils', 'Search returns array', 'FAIL');
    }
  } catch (error) {
    logTest('Content Utils', 'Search execution', 'FAIL', error.message);
  }
  
  // Test 3: Content stats
  try {
    const stats = contentUtils.getContentStats();
    if (stats && typeof stats === 'object') {
      logTest('Content Utils', 'Stats object structure', 'PASS');
      
      if (typeof stats.totalBlogPosts === 'number') {
        logTest('Content Utils', 'Stats: totalBlogPosts', 'PASS', stats.totalBlogPosts.toString());
      }
      
      if (typeof stats.totalServices === 'number') {
        logTest('Content Utils', 'Stats: totalServices', 'PASS', stats.totalServices.toString());
      }
      
      if (typeof stats.avgSEOScore === 'number') {
        logTest('Content Utils', 'Stats: avgSEOScore', 'PASS', stats.avgSEOScore.toString());
      }
    } else {
      logTest('Content Utils', 'Stats object structure', 'FAIL');
    }
  } catch (error) {
    logTest('Content Utils', 'Stats execution', 'FAIL', error.message);
  }
  
  // Test 4: Export functionality
  try {
    const exportData = contentUtils.exportContent('blog', 'json');
    if (exportData && exportData.data && Array.isArray(exportData.data)) {
      logTest('Content Utils', 'Export returns valid structure', 'PASS');
    } else {
      logTest('Content Utils', 'Export returns valid structure', 'FAIL');
    }
  } catch (error) {
    logTest('Content Utils', 'Export execution', 'FAIL', error.message);
  }
  
} catch (error) {
  logTest('Content Utils', 'Module loading', 'FAIL', error.message);
}

// ==========================================
// TEST SUITE 5: Monitoring & Reporting
// ==========================================
console.log('\n\n📊 TEST SUITE 5: Monitoring & Reporting System');
console.log('-'.repeat(80));

try {
  const monitoring = require('./lib/admin/monitoring');
  
  // Test 1: Module exports
  const monitoringExports = [
    'logAuditTrail',
    'getAuditTrail',
    'generateDashboardData',
    'trackSEOScore',
    'getSEOTrend',
    'savePerformanceMetrics',
    'getPerformanceMetrics',
    'generateSEOAuditReport',
    'getContentHealthSummary'
  ];
  
  monitoringExports.forEach(exportName => {
    if (typeof monitoring[exportName] === 'function') {
      logTest('Monitoring', `Export: ${exportName}`, 'PASS', 'Function exists');
    } else {
      logTest('Monitoring', `Export: ${exportName}`, 'FAIL', 'Function not found');
    }
  });
  
  // Test 2: Audit trail
  try {
    monitoring.logAuditTrail({
      action: 'create',
      type: 'blog',
      slug: 'test-post',
      user: 'qa-tester',
      details: 'QA test entry'
    });
    
    const trail = monitoring.getAuditTrail({}, 10);
    if (Array.isArray(trail)) {
      logTest('Monitoring', 'Audit trail logging', 'PASS', `${trail.length} entries`);
    } else {
      logTest('Monitoring', 'Audit trail logging', 'FAIL');
    }
  } catch (error) {
    logTest('Monitoring', 'Audit trail logging', 'FAIL', error.message);
  }
  
  // Test 3: Dashboard data
  try {
    const dashboard = monitoring.generateDashboardData();
    if (dashboard && dashboard.overview) {
      logTest('Monitoring', 'Dashboard data structure', 'PASS');
      
      if (dashboard.seoPerformance) {
        logTest('Monitoring', 'SEO performance data', 'PASS');
      }
      
      if (dashboard.contentActivity) {
        logTest('Monitoring', 'Content activity data', 'PASS');
      }
      
      if (dashboard.auditTrail) {
        logTest('Monitoring', 'Audit trail in dashboard', 'PASS');
      }
    } else {
      logTest('Monitoring', 'Dashboard data structure', 'FAIL');
    }
  } catch (error) {
    logTest('Monitoring', 'Dashboard generation', 'FAIL', error.message);
  }
  
  // Test 4: Health summary
  try {
    const health = monitoring.getContentHealthSummary();
    if (health && typeof health.healthScore === 'number') {
      logTest('Monitoring', 'Health summary', 'PASS', `Score: ${health.healthScore}%`);
    } else {
      logTest('Monitoring', 'Health summary', 'FAIL');
    }
  } catch (error) {
    logTest('Monitoring', 'Health summary', 'FAIL', error.message);
  }
  
} catch (error) {
  logTest('Monitoring', 'Module loading', 'FAIL', error.message);
}

// ==========================================
// TEST SUITE 6: API Routes
// ==========================================
console.log('\n\n🌐 TEST SUITE 6: API Routes Structure');
console.log('-'.repeat(80));

const apiRoutes = [
  'app/api/admin/blog/save/route.ts',
  'app/api/admin/service/save/route.ts'
];

apiRoutes.forEach(route => {
  const fullPath = path.join(process.cwd(), route);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    if (content.includes('export async function POST')) {
      logTest('API Routes', `POST handler: ${route}`, 'PASS');
    } else {
      logTest('API Routes', `POST handler: ${route}`, 'FAIL', 'No POST handler');
    }
    
    if (content.includes('authorization')) {
      logTest('API Routes', `Auth check: ${route}`, 'PASS');
    } else {
      logTest('API Routes', `Auth check: ${route}`, 'WARN', 'No auth check found');
    }
  } else {
    logTest('API Routes', `Route exists: ${route}`, 'FAIL', 'File not found');
  }
});

// ==========================================
// TEST SUITE 7: Admin UI Pages
// ==========================================
console.log('\n\n🎨 TEST SUITE 7: Admin UI Pages');
console.log('-'.repeat(80));

const adminPages = [
  'app/admin/layout.tsx',
  'app/admin/page.tsx',
  'app/admin/blog/page.tsx',
  'app/admin/blog/new/page.tsx',
  'app/admin/blog/edit/[slug]/page.tsx',
  'app/admin/services/page.tsx',
  'app/admin/services/edit/[slug]/page.tsx',
  'app/admin/seo-audit/page.tsx'
];

adminPages.forEach(page => {
  const fullPath = path.join(process.cwd(), page);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    
    if (content.includes('export default function') || content.includes('export default')) {
      logTest('Admin UI', `Page export: ${page}`, 'PASS');
    } else {
      logTest('Admin UI', `Page export: ${page}`, 'FAIL', 'No default export');
    }
    
    if (page.includes('layout')) {
      if (content.includes('children')) {
        logTest('Admin UI', `Layout children prop: ${page}`, 'PASS');
      }
    }
  } else {
    logTest('Admin UI', `Page exists: ${page}`, 'FAIL', 'File not found');
  }
});

// ==========================================
// TEST SUITE 8: Data Integrity
// ==========================================
console.log('\n\n💾 TEST SUITE 8: Data Integrity & Storage');
console.log('-'.repeat(80));

// Check data directories
const dataDirs = [
  'lib/constants',
  'data/services',
  'data/workflow',
  'data/audit',
  'data/analytics'
];

dataDirs.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    logTest('Data Integrity', `Directory exists: ${dir}`, 'PASS');
  } else {
    logTest('Data Integrity', `Directory exists: ${dir}`, 'WARN', 'Will be created on first use');
  }
});

// Check blog data files
const blogDir = path.join(process.cwd(), 'lib', 'constants');
if (fs.existsSync(blogDir)) {
  const blogFiles = fs.readdirSync(blogDir).filter(f => f.endsWith('.ts') && f !== 'blog.ts');
  logTest('Data Integrity', 'Blog post files', 'PASS', `${blogFiles.length} files`);
}

// Check service data files
const serviceDir = path.join(process.cwd(), 'data', 'services');
if (fs.existsSync(serviceDir)) {
  const serviceFiles = fs.readdirSync(serviceDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
  logTest('Data Integrity', 'Service files', 'PASS', `${serviceFiles.length} files`);
}

// ==========================================
// FINAL REPORT
// ==========================================
console.log('\n\n' + '='.repeat(80));
console.log('📋 QA/QC TEST REPORT SUMMARY');
console.log('='.repeat(80));
console.log('');
console.log(`Total Tests:    ${testResults.total}`);
console.log(`✅ Passed:      ${testResults.passed} (${((testResults.passed/testResults.total)*100).toFixed(1)}%)`);
console.log(`❌ Failed:      ${testResults.failed} (${((testResults.failed/testResults.total)*100).toFixed(1)}%)`);
console.log(`⚠️  Warnings:    ${testResults.warnings} (${((testResults.warnings/testResults.total)*100).toFixed(1)}%)`);
console.log('');

if (testResults.failed === 0) {
  console.log('🎉 RESULT: ALL CRITICAL TESTS PASSED!');
  console.log('✅ System is ready for production deployment');
} else {
  console.log('⚠️  RESULT: SOME TESTS FAILED');
  console.log('🔧 Please review and fix failed tests before deployment');
}

console.log('');
console.log('Detailed test results saved to: qa-test-results.json');

// Save detailed results
fs.writeFileSync(
  path.join(process.cwd(), 'qa-test-results.json'),
  JSON.stringify(testResults, null, 2)
);

console.log('');
console.log('='.repeat(80));
