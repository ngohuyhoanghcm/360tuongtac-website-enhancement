'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // We use a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('h2, h3'))
        .map((elem) => ({
          id: elem.id,
          text: elem.textContent || '',
          level: Number(elem.tagName.substring(1)),
        }))
        .filter((item) => item.id);
      setHeadings(elements);
    }, 100);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0% -80% 0%' }
    );

    document.querySelectorAll('h2, h3').forEach((elem) => observer.observe(elem));

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav className="hidden xl:block sticky top-32 max-h-[calc(100vh-160px)] overflow-y-auto">
      <div className="pl-8 border-l border-[var(--border)]">
        <h4 className="font-h1 text-xs font-black text-[var(--text-muted)] uppercase tracking-widest mb-6">
          Nội dung chính
        </h4>
        <ul className="space-y-4">
          {headings.map((heading) => (
            <li 
              key={heading.id}
              style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
            >
              <a
                href={`#${heading.id}`}
                className={`block text-sm transition-all duration-300 font-medium leading-relaxed ${
                  activeId === heading.id 
                    ? 'text-[#FF2E63] font-bold' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({
                    behavior: 'smooth'
                  });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
