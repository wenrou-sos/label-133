import { useEffect, useState } from 'react';
import { Users, Calendar, TrendingUp, ArrowUpRight } from 'lucide-react';
import AgeHistogram from '@/components/charts/AgeHistogram';
import { ageApi } from '@/services/api';
import type { AgeDistribution } from '@/types';

const years = [2018, 2020, 2022, 2024];

const AgePage = () => {
  const [year, setYear] = useState(2024);
  const [ageData, setAgeData] = useState<AgeDistribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await ageApi.getAgeDistribution(year);
        setAgeData(data);
      } catch (error) {
        console.error('Failed to fetch age data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const maleData = ageData.find((d) => d.gender === 'male') || null;
  const femaleData = ageData.find((d) => d.gender === 'female') || null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">年龄分布分析</h2>
          <p className="text-gray-500 text-sm mt-1">
            初婚年龄分性别分布特征
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}年
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-blue-500" />
            <span className="text-sm text-gray-500">男性平均初婚年龄</span>
          </div>
          <div className="metric-number text-2xl font-bold text-gray-800">
            {maleData ? `${maleData.averageAge} 岁` : '-'}
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} className="text-pink-500" />
            <span className="text-sm text-gray-500">女性平均初婚年龄</span>
          </div>
          <div className="metric-number text-2xl font-bold text-gray-800">
            {femaleData ? `${femaleData.averageAge} 岁` : '-'}
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={18} className="text-emerald-500" />
            <span className="text-sm text-gray-500">25-29岁占比</span>
          </div>
          <div className="metric-number text-2xl font-bold text-gray-800">
            {maleData ? `${maleData.ageGroups[2]?.percentage || 0}%` : '-'}
          </div>
        </div>
        <div className="card p-5 bg-gradient-to-br from-violet-50 to-purple-50">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight size={18} className="text-violet-500" />
            <span className="text-sm text-violet-600">30-34岁上升趋势</span>
          </div>
          <div className="metric-number text-2xl font-bold text-violet-700">
            {maleData ? `${maleData.ageGroups[3]?.percentage || 0}%` : '-'}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">初婚年龄分布直方图</h3>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="text-gray-600">男性</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-pink-400" />
              <span className="text-gray-600">女性</span>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-pulse text-gray-400">加载中...</div>
          </div>
        ) : (
          <AgeHistogram maleData={maleData} femaleData={femaleData} height={380} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">分布特征</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">25-29岁为主峰</p>
                <p className="text-xs text-gray-500 mt-1">
                  该年龄段是初婚的主力军，占比约35-40%，是分布的主峰位置。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-rose-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-rose-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">女性结婚年龄更早</p>
                <p className="text-xs text-gray-500 mt-1">
                  女性平均初婚年龄比男性低约2岁，20-24岁组占比明显高于男性。
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-amber-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">30-34岁逐年上升</p>
                <p className="text-xs text-gray-500 mt-1">
                  晚婚趋势明显，30-34岁年龄组占比逐年上升，已成为第二高峰。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">变化趋势</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">初婚年龄推迟</p>
                <p className="text-xs text-gray-500">近10年平均推迟约3岁</p>
              </div>
              <span className="text-lg font-bold text-blue-600">↑ 3岁</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">20-24岁占比下降</p>
                <p className="text-xs text-gray-500">年轻人结婚意愿降低</p>
              </div>
              <span className="text-lg font-bold text-rose-500">↓ 12%</span>
            </div>
            <div className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">30+占比上升</p>
                <p className="text-xs text-gray-500">晚婚群体持续扩大</p>
              </div>
              <span className="text-lg font-bold text-emerald-600">↑ 18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgePage;
