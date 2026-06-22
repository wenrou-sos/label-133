import { useEffect, useState } from 'react';
import { Heart, HeartCrack, TrendingUp, TrendingDown } from 'lucide-react';
import MetricCard from '@/components/common/MetricCard';
import TrendChart from '@/components/charts/TrendChart';
import { metricsApi, trendApi } from '@/services/api';
import type { CoreMetrics, AnnualTrend, PolicyNode } from '@/types';
import { formatNumber } from '@/utils';

const OverviewPage = () => {
  const [metrics, setMetrics] = useState<CoreMetrics | null>(null);
  const [trendData, setTrendData] = useState<AnnualTrend[]>([]);
  const [policies, setPolicies] = useState<PolicyNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [metricsRes, trendRes, policiesRes] = await Promise.all([
          metricsApi.getCoreMetrics(2024),
          trendApi.getAnnualTrend(2015, 2024),
          trendApi.getPolicyNodes(),
        ]);
        setMetrics(metricsRes);
        setTrendData(trendRes);
        setPolicies(policiesRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-gray-400">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">数据概览</h2>
          <p className="text-gray-500 text-sm mt-1">
            {metrics.year}年度婚姻状况核心指标</p>
        </div>
        <div className="text-sm text-gray-500">
          数据更新时间：实时
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="年度结婚登记数"
          value={formatNumber(metrics.marriageCount, 1)}
          unit="万对"
          yoy={metrics.marriageYoY}
          yoyLabel="同比去年"
          icon={<Heart size={24} />}
          color="blue"
          trendInterpretation="upGood"
        />
        <MetricCard
          title="年度离婚登记数"
          value={formatNumber(metrics.divorceCount, 1)}
          unit="万对"
          yoy={metrics.divorceYoY}
          yoyLabel="同比去年"
          icon={<HeartCrack size={24} />}
          color="orange"
          trendInterpretation="downGood"
        />
        <MetricCard
          title="结婚率"
          value={metrics.marriageRate.toFixed(2)}
          unit="‰"
          yoy={metrics.marriageRateYoY}
          yoyLabel="同比去年"
          icon={<TrendingUp size={24} />}
          color="green"
          trendInterpretation="upGood"
        />
        <MetricCard
          title="离婚率"
          value={metrics.divorceRate.toFixed(2)}
          unit="‰"
          yoy={metrics.divorceRateYoY}
          yoyLabel="同比去年"
          icon={<TrendingDown size={24} />}
          color="purple"
          trendInterpretation="downGood"
        />
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">近10年趋势概览</h3>
          <span className="text-sm text-gray-500">结婚率 & 离婚率</span>
        </div>
        <TrendChart data={trendData} policies={policies} height={320} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
          <p className="text-sm text-gray-600 mb-2">平均初婚年龄</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-blue-700">28.67</span>
            <span className="text-sm text-gray-500">岁</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">较5年前推迟1.2岁</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-pink-50 to-rose-50">
          <p className="text-sm text-gray-600 mb-2">25-29岁占比</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-pink-700">35.6%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">结婚登记主力军</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50">
          <p className="text-sm text-gray-600 mb-2">离婚冷静期效果</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700">-34.5%</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">2021年实施后离婚登记下降</p>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
