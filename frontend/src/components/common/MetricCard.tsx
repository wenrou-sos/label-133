import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatYoY } from '@/utils';

interface MetricCardProps {
  title: string;
  value: string;
  unit?: string;
  yoy: number;
  yoyLabel?: string;
  icon: React.ReactNode;
  color: 'blue' | 'orange' | 'green' | 'purple';
  trendInterpretation?: 'upGood' | 'upBad' | 'downGood' | 'downBad';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-500',
    accent: 'text-blue-600',
    bar: 'from-blue-500 to-blue-400',
  },
  orange: {
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-500',
    accent: 'text-orange-600',
    bar: 'from-orange-500 to-orange-400',
  },
  green: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-500',
    accent: 'text-emerald-600',
    bar: 'from-emerald-500 to-emerald-400',
  },
  purple: {
    bg: 'bg-violet-50',
    iconBg: 'bg-violet-500',
    accent: 'text-violet-600',
    bar: 'from-violet-500 to-violet-400',
  },
};

const MetricCard = ({
  title,
  value,
  unit,
  yoy,
  yoyLabel = '同比',
  icon,
  color,
  trendInterpretation = 'upGood',
}: MetricCardProps) => {
  const colors = colorClasses[color];
  const yoyInfo = formatYoY(yoy);
  
  const isPositiveTrend = 
    (trendInterpretation === 'upGood' && yoyInfo.isUp) ||
    (trendInterpretation === 'downGood' && !yoyInfo.isUp);

  return (
    <div className="card p-6 relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${colors.bar}`} />
      
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
        </div>
        <div className={`${colors.iconBg} text-white p-3 rounded-xl shadow-md group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline space-x-1">
          <span className="metric-number text-3xl font-bold text-gray-800">{value}</span>
          {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-500">{yoyLabel}</span>
        <div
          className={`flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            isPositiveTrend
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-rose-50 text-rose-600'
          }`}
        >
          {yoyInfo.isUp ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          <span>{yoyInfo.text}</span>
        </div>
      </div>

      <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5">
        <div className={`w-full h-full rounded-full ${colors.bg}`} />
      </div>
    </div>
  );
};

export default MetricCard;
