export const formatNumber = (num: number, decimals = 0): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(decimals) + '万';
  }
  return num.toLocaleString('zh-CN', { maximumFractionDigits: decimals });
};

export const formatPercent = (num: number, decimals = 1): string => {
  return (num * 100).toFixed(decimals) + '%';
};

export const formatPermille = (num: number, decimals = 2): string => {
  return num.toFixed(decimals) + '‰';
};

export const formatYoY = (value: number): { text: string; isUp: boolean } => {
  const isUp = value > 0;
  const text = value > 0 ? `+${value.toFixed(1)}%` : `${value.toFixed(1)}%`;
  return { text, isUp };
};

export const getYearList = (start: number, end: number): number[] => {
  const years: number[] = [];
  for (let y = start; y <= end; y++) {
    years.push(y);
  }
  return years;
};

export const monthNames = [
  '1月', '2月', '3月', '4月', '5月', '6月',
  '7月', '8月', '9月', '10月', '11月', '12月',
];

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month, 0).getDate();
};

export const REGION_NAMES: Record<string, string> = {
  east: '东部地区',
  central: '中部地区',
  west: '西部地区',
  northeast: '东北地区',
};

export const EDUCATION_LEVELS = [
  '小学及以下',
  '初中',
  '高中/中专',
  '大专',
  '本科',
  '硕士',
  '博士',
];
