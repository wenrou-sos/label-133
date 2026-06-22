import { useEffect, useState } from 'react';
import { Calendar, Sun, Snowflake, Sparkles } from 'lucide-react';
import HeatmapChart from '@/components/charts/HeatmapChart';
import { heatmapApi } from '@/services/api';
import type { HeatmapData } from '@/types';

const years = [2020, 2021, 2022, 2023, 2024];

const HeatmapPage = () => {
  const [year, setYear] = useState(2024);
  const [activeTab, setActiveTab] = useState<'marriage' | 'divorce'>('marriage');
  const [marriageData, setMarriageData] = useState<HeatmapData | null>(null);
  const [divorceData, setDivorceData] = useState<HeatmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [marriageRes, divorceRes] = await Promise.all([
          heatmapApi.getMarriageHeatmap(year),
          heatmapApi.getDivorceHeatmap(year),
        ]);
        setMarriageData(marriageRes);
        setDivorceData(divorceRes);
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  const marriageColors = ['#eff6ff', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a5f'];
  const divorceColors = ['#fef3c7', '#fcd34d', '#f59e0b', '#d97706', '#92400e'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">月度热力图分析</h2>
          <p className="text-gray-500 text-sm mt-1">
            婚姻登记的季节性分布规律
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

      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('marriage')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'marriage'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          结婚登记热力图
        </button>
        <button
          onClick={() => setActiveTab('divorce')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
            activeTab === 'divorce'
              ? 'bg-white text-amber-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          离婚登记热力图
        </button>
      </div>

      <div className="card p-6">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-pulse text-gray-400">加载中...</div>
          </div>
        ) : (
          <HeatmapChart
            data={activeTab === 'marriage' ? marriageData : divorceData}
            title={activeTab === 'marriage' ? `${year}年结婚登记月度分布` : `${year}年离婚登记月度分布`}
            colorRange={activeTab === 'marriage' ? marriageColors : divorceColors}
            height={520}
          />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {activeTab === 'marriage' ? (
          <>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Sparkles size={20} className="text-rose-500" />
                </div>
                <h4 className="font-semibold text-gray-800">5月20日/21日</h4>
              </div>
              <p className="text-sm text-gray-600">
                网络情人节，是近年来兴起的结婚登记高峰日，单日登记量可达平日的3-5倍。
              </p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Sparkles size={20} className="text-emerald-500" />
                </div>
                <h4 className="font-semibold text-gray-800">9月9日</h4>
              </div>
              <p className="text-sm text-gray-600">
                寓意"长长久久"，是传统观念中最受欢迎的结婚登记日期之一。
              </p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Sun size={20} className="text-blue-500" />
                </div>
                <h4 className="font-semibold text-gray-800">国庆黄金周</h4>
              </div>
              <p className="text-sm text-gray-600">
                10月国庆假期是结婚高峰期，许多新人选择在长假期间举办婚礼并登记。
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Snowflake size={20} className="text-red-500" />
                </div>
                <h4 className="font-semibold text-gray-800">春节前高峰</h4>
              </div>
              <p className="text-sm text-gray-600">
                每年1-2月春节前后出现离婚小高峰，可能与家庭聚会矛盾激化有关。
              </p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Sun size={20} className="text-orange-500" />
                </div>
                <h4 className="font-semibold text-gray-800">高考后高峰</h4>
              </div>
              <p className="text-sm text-gray-600">
                7-8月出现离婚小高峰，部分夫妻为不影响孩子高考选择考试后离婚。
              </p>
            </div>
            <div className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar size={20} className="text-gray-500" />
                </div>
                <h4 className="font-semibold text-gray-800">月度分布</h4>
              </div>
              <p className="text-sm text-gray-600">
                整体来看，离婚登记在各月分布相对均匀，季节性波动小于结婚登记。
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HeatmapPage;
