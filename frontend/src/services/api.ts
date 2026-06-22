import axios from 'axios';
import type {
  CoreMetrics,
  AnnualTrend,
  PolicyNode,
  HeatmapData,
  AgeDistribution,
  RegionData,
  EducationData,
  CorrelationResult,
  CrosstabData,
  CrosstabDim,
  CrosstabMetric,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

export const metricsApi = {
  getCoreMetrics: (year?: number): Promise<CoreMetrics> =>
    api.get('/metrics', { params: { year } }).then((res) => res.data),
};

export const trendApi = {
  getAnnualTrend: (startYear?: number, endYear?: number): Promise<AnnualTrend[]> =>
    api.get('/trend', { params: { startYear, endYear } }).then((res) => res.data),

  getPolicyNodes: (): Promise<PolicyNode[]> =>
    api.get('/policies').then((res) => res.data),
};

export const heatmapApi = {
  getMarriageHeatmap: (year: number): Promise<HeatmapData> =>
    api.get('/heatmap/marriage', { params: { year } }).then((res) => res.data),

  getDivorceHeatmap: (year: number): Promise<HeatmapData> =>
    api.get('/heatmap/divorce', { params: { year } }).then((res) => res.data),
};

export const ageApi = {
  getAgeDistribution: (year: number, gender?: 'male' | 'female'): Promise<AgeDistribution[]> =>
    api.get('/age-distribution', { params: { year, gender } }).then((res) => res.data),
};

export const regionApi = {
  getRegions: (level?: string, region?: string): Promise<RegionData[]> =>
    api.get('/regions', { params: { level, region } }).then((res) => res.data),

  getRegionDetail: (code: string): Promise<RegionData> =>
    api.get(`/regions/${code}`).then((res) => res.data),
};

export const educationApi = {
  getEducationData: (year?: number): Promise<EducationData[]> =>
    api.get('/education', { params: { year } }).then((res) => res.data),

  getCorrelation: (): Promise<CorrelationResult> =>
    api.get('/education/correlation').then((res) => res.data),
};

export const crosstabApi = {
  getCrosstab: (
    dimX: CrosstabDim,
    dimY: CrosstabDim,
    year?: number,
    metric?: CrosstabMetric
  ): Promise<CrosstabData> =>
    api.get('/crosstab', { params: { dimX, dimY, year, metric } }).then((res) => res.data),
};

export default api;
