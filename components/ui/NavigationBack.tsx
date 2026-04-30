'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';

interface NavigationBackProps {
  href: string;
  label: string;
}

export default function NavigationBack({ href, label }: NavigationBackProps) {
  return (
    <div className="pb-4">
      <Link href={href} className="inline-flex items-center gap-2 text-slate-400 hover:text-[#00E5FF] transition-colors group py-3 pr-6 -ml-2 pl-2 rounded-lg hover:bg-white/5 font-medium text-sm sm:text-base antialiased">
        <motion.div
          initial={{ x: 0 }}
          whileHover={{ x: -4 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.div>
        {label}
      </Link>
    </div>
  );
}
