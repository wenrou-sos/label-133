export interface CoreMetrics {
  year: number;
  marriageCount: number;
  divorceCount: number;
  marriageRate: number;
  divorceRate: number;
  marriageYoY: number;
  divorceYoY: number;
  marriageRateYoY: number;
  divorceRateYoY: number;
}

export interface AnnualTrend {
  year: number;
  marriageRate: number;
  divorceRate: number;
  marriageCount: number;
  divorceCount: number;
}

export interface PolicyNode {
  year: number;
  month?: number;
  name: string;
  description: string;
}

export interface HeatmapDay {
  month: number;
  day: number;
  count: number;
  isPeak: boolean;
  peakType?: string;
}

export interface HeatmapData {
  year: number;
  type: 'marriage' | 'divorce';
  data: HeatmapDay[];
  maxCount: number;
  minCount: number;
}

export interface AgeGroup {
  ageRange: string;
  count: number;
  percentage: number;
}

export interface AgeDistribution {
  year: number;
  gender: 'male' | 'female';
  ageGroups: AgeGroup[];
  averageAge: number;
  medianAge: number;
}

export interface RegionData {
  code: string;
  name: string;
  level: 'country' | 'province' | 'city';
  marriageRate: number;
  divorceRate: number;
  marriageCount: number;
  divorceCount: number;
  population: number;
  region: 'east' | 'central' | 'west' | 'northeast';
  children?: RegionData[];
}

export interface EducationData {
  year: number;
  educationLevel: string;
  marriageCount: number;
  divorceCount: number;
  divorceRate: number;
  sampleSize: number;
  significance?: number;
  lowerCI?: number;
  upperCI?: number;
}

export interface CorrelationResult {
  correlation: number;
  pValue: number;
  rSquared: number;
  interpretation: string;
}

export type TabKey = 'overview' | 'trend' | 'heatmap' | 'age' | 'region' | 'education' | 'crosstab';

export type CrosstabDim = 'age' | 'education' | 'region';
export type CrosstabMetric = 'divorceRate' | 'marriageRate';

export interface CrosstabData {
  year: number;
  dimX: CrosstabDim;
  dimY: CrosstabDim;
  metric: CrosstabMetric;
  xLabels: string[];
  yLabels: string[];
  xCategories: string[];
  yCategories: string[];
  data: [number, number, number][];
  minValue: number;
  maxValue: number;
  rowMeans: number[];
  colMeans: number[];
  error?: string;
}

export interface FilterOptions {
  year: number;
  startYear: number;
  endYear: number;
  region: string[];
  population: string[];
  educationLevels: string[];
}
