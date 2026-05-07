import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="pb-6">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link href={item.href} className="hover:text-gray-900 transition-colors antialiased truncate max-w-[120px] sm:max-w-[200px]">
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium antialiased truncate max-w-[150px] sm:max-w-[300px]" aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <ChevronRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
