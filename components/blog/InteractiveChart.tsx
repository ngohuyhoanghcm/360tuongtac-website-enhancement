'use client';

import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface InteractiveChartProps {
  type: 'Bar' | 'Area' | 'Pie';
  data: any[];
  xAxisKey?: string;
  dataKey: string;
  nameKey?: string;
  title?: string;
  description?: string;
}

const COLORS = ['#FF8C00', '#FF2E63', '#8B5CF6', '#3B82F6', '#10B981'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/60 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
        {label && <p className="text-white/70 text-xs font-bold mb-2">{label}</p>}
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-white text-sm font-black" style={{ color: entry.color || '#fff' }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function InteractiveChart({
  type,
  data,
  xAxisKey = 'name',
  dataKey,
  nameKey = 'name',
  title,
  description,
}: InteractiveChartProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading to show skeleton state and then nicely animate the chart
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="my-10 p-6 sm:p-8 rounded-3xl glass-panel backdrop-blur-xl relative"
      role="region"
      aria-label={title || "Biểu đồ dữ liệu"}
    >
      {(title || description) && (
        <div className="mb-8 relative z-10">
          {title && <h3 className="text-xl font-black text-[var(--text-primary)] mb-2" id={`chart-title-${title.replace(/\s+/g, '-')}`}>{title}</h3>}
          {description && <p className="text-[var(--text-muted)] text-sm">{description}</p>}
        </div>
      )}

      {/* Screen Reader Only Data Table */}
      <div className="sr-only" aria-hidden={isLoading}>
        <table aria-labelledby={title ? `chart-title-${title.replace(/\s+/g, '-')}` : undefined}>
          <caption>{title || "Dữ liệu biểu đồ"}</caption>
          <thead>
            <tr>
              <th scope="col">{xAxisKey || "Danh mục"}</th>
              <th scope="col">{dataKey || "Giá trị"}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={idx}>
                <td>{item[xAxisKey] || item[nameKey]}</td>
                <td>{item[dataKey]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div 
        className="h-[300px] sm:h-[400px] w-full relative focus:outline-none focus:ring-2 focus:ring-[#FF8C00] rounded-xl"
        tabIndex={0}
        aria-hidden="true" // Hide the complex SVG from screen readers, as they can read the table above
      >
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse z-20">
            <Loader2 className="w-8 h-8 text-[#FF8C00] animate-spin mb-4" />
            <div className="flex items-end gap-2 h-32 opacity-50">
               <div className="w-8 bg-[#FF8C00]/20 rounded-t-sm h-1/4"></div>
               <div className="w-8 bg-[#FF8C00]/20 rounded-t-sm h-2/4"></div>
               <div className="w-8 bg-[#FF8C00]/20 rounded-t-sm h-3/4"></div>
               <div className="w-8 bg-[#FF8C00]/20 rounded-t-sm h-full"></div>
               <div className="w-8 bg-[#FF8C00]/20 rounded-t-sm h-1/2"></div>
            </div>
            <p className="text-[var(--text-muted)] text-sm mt-4 font-medium tracking-wide hidden sm:block">Đang tải dữ liệu biểu đồ...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" className="animate-in fade-in duration-700">
            {type === 'Bar' ? (
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF8C00" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF2E63" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar dataKey={dataKey} fill="url(#colorGradient)" radius={[6, 6, 0, 0]} animationDuration={1500} />
              </BarChart>
            ) : type === 'Area' ? (
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#FF2E63" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey={xAxisKey} stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey={dataKey} stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorArea)" animationDuration={1500} />
              </AreaChart>
            ) : (
              <PieChart>
                <Tooltip content={<CustomTooltip />} />
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  animationDuration={1500}
                  stroke="rgba(0,0,0,0)"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

