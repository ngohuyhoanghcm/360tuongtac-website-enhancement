#!/bin/bash
# Security Pre-Commit Hook
# Checks for exposed API keys and secrets before committing

echo "🔍 Running security check..."

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track if any issues found
ISSUES_FOUND=0

# Check for Google API keys
if grep -r "AIzaSy[A-Za-z0-9_-]\{35,\}" --include="*.md" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.next .; then
    echo -e "${RED}❌ Google API key detected!${NC}"
    ISSUES_FOUND=1
fi

# Check for OpenAI API keys
if grep -r "sk-proj-[A-Za-z0-9_-]\{20,\}" --include="*.md" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.next .; then
    echo -e "${RED}❌ OpenAI API key detected!${NC}"
    ISSUES_FOUND=1
fi

# Check for Telegram bot tokens
if grep -r "[0-9]\{8,10\}:AA[A-Za-z0-9_-]\{30,\}" --include="*.md" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.next .; then
    echo -e "${RED}❌ Telegram bot token detected!${NC}"
    ISSUES_FOUND=1
fi

# Check for AWS keys
if grep -r "AKIA[A-Z0-9]\{16,\}" --include="*.md" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.next .; then
    echo -e "${RED}❌ AWS access key detected!${NC}"
    ISSUES_FOUND=1
fi

if [ $ISSUES_FOUND -eq 0 ]; then
    echo -e "${GREEN}✅ No API keys or secrets detected. Safe to commit!${NC}"
    exit 0
else
    echo -e "${RED}❌ SECURITY CHECK FAILED!${NC}"
    echo -e "${YELLOW}⚠️  Please redact all API keys before committing.${NC}"
    echo -e "${YELLOW}💡 Replace actual keys with: [REDACTED] or placeholder values${NC}"
    exit 1
fi
