import { useEffect, useState } from 'react';
import { MapPin, ArrowDownUp, Filter, BarChart3 } from 'lucide-react';
import RegionBarChart from '@/components/charts/RegionBarChart';
import { regionApi } from '@/services/api';
import type { RegionData } from '@/types';
import { REGION_NAMES } from '@/utils';

type SortField = 'marriage' | 'divorce' | 'name';
type SortOrder = 'asc' | 'desc';
type ShowType = 'marriage' | 'divorce' | 'both';

const RegionPage = () => {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortField>('marriage');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [showType, setShowType] = useState<ShowType>('both');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const drillLevel = 'province' as const;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await regionApi.getRegions(drillLevel, selectedRegion || undefined);
        setRegions(data);
      } catch (error) {
        console.error('Failed to fetch region data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [drillLevel, selectedRegion]);

  const handleBarClick = (region: RegionData) => {
    if (drillLevel === 'province') {
      // 可以下钻到市级（暂用相同数据模拟）
      console.log('Clicked:', region.name);
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const avgMarriage = regions.length > 0
    ? (regions.reduce((sum, r) => sum + r.marriageRate, 0) / regions.length).toFixed(2)
    : '0';
  const avgDivorce = regions.length > 0
    ? (regions.reduce((sum, r) => sum + r.divorceRate, 0) / regions.length).toFixed(2)
    : '0';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">地域对比分析</h2>
          <p className="text-gray-500 text-sm mt-1">
            各省市结婚率与离婚率对比
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-500" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">全部区域</option>
              {Object.entries(REGION_NAMES).map(([key, name]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={18} className="text-blue-500" />
            <span className="text-sm text-gray-500">覆盖省份</span>
          </div>
          <div className="metric-number text-2xl font-bold text-gray-800">
            {regions.length} 个
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={18} className="text-blue-500" />
            <span className="text-sm text-gray-500">平均结婚率</span>
          </div>
          <div className="metric-number text-2xl font-bold text-blue-600">
            {avgMarriage}‰
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 size={18} className="text-amber-500" />
            <span className="text-sm text-gray-500">平均离婚率</span>
          </div>
          <div className="metric-number text-2xl font-bold text-amber-600">
            {avgDivorce}‰
          </div>
        </div>
        <div className="card p-5 bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDownUp size={18} className="text-emerald-500" />
            <span className="text-sm text-emerald-600">下钻层级</span>
          </div>
          <div className="text-lg font-bold text-emerald-700">
            {drillLevel === 'province' ? '省级' : '市级'}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <h3 className="text-lg font-semibold text-gray-800">各地区结婚率与离婚率对比</h3>
          <div className="flex items-center gap-4">
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              {(['both', 'marriage', 'divorce'] as ShowType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => setShowType(type)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    showType === type
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {type === 'both' ? '全部' : type === 'marriage' ? '结婚率' : '离婚率'}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">排序：</span>
              <button
                onClick={() => toggleSort('marriage')}
                className={`px-2 py-1 text-xs rounded ${
                  sortBy === 'marriage'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                结婚率 {sortBy === 'marriage' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => toggleSort('divorce')}
                className={`px-2 py-1 text-xs rounded ${
                  sortBy === 'divorce'
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                离婚率 {sortBy === 'divorce' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => toggleSort('name')}
                className={`px-2 py-1 text-xs rounded ${
                  sortBy === 'name'
                    ? 'bg-gray-200 text-gray-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                名称 {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-pulse text-gray-400">加载中...</div>
          </div>
        ) : (
          <RegionBarChart
            data={regions}
            showType={showType}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onBarClick={handleBarClick}
            height={500}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">区域特点</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">东部地区</p>
                <p className="text-xs text-gray-500 mt-1">
                  经济发达，结婚率相对较低，离婚率较高，初婚年龄偏大
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">中西部地区</p>
                <p className="text-xs text-gray-500 mt-1">
                  结婚率相对较高，传统婚姻观念影响较深，离婚率低于全国平均
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-rose-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">东北地区</p>
                <p className="text-xs text-gray-500 mt-1">
                  离婚率全国最高，人口外流严重，结婚率持续走低
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">数据说明</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• 数据来源：基于全国31个省、自治区、直辖市的统计数据</p>
            <p>• 结婚率：指一定时期（通常为一年）内结婚人数与同期平均人口数之比</p>
            <p>• 离婚率：指一定时期（通常为一年）内离婚人数与同期平均人口数之比</p>
            <p>• 点击柱状图可下钻查看该地区的详细数据</p>
            <p>• 红色虚线为全国平均水平参考线</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegionPage;
