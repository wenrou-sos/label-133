import { useEffect, useState } from 'react';
import { Download, TrendingUp, Calendar, BarChart3, AlertTriangle } from 'lucide-react';
import TrendChart from '@/components/charts/TrendChart';
import { trendApi } from '@/services/api';
import type { AnnualTrend, PolicyNode } from '@/types';

const TrendPage = () => {
  const [trendData, setTrendData] = useState<AnnualTrend[]>([]);
  const [policies, setPolicies] = useState<PolicyNode[]>([]);
  const [startYear, setStartYear] = useState(2015);
  const [endYear, setEndYear] = useState(2024);
  const [loading, setLoading] = useState(true);
  const [showForecast, setShowForecast] = useState(false);
  const [yearError, setYearError] = useState<string>('');

  useEffect(() => {
    if (startYear > endYear) {
      setYearError(`开始年份(${startYear}年)不能大于结束年份(${endYear}年)，已自动调整为${endYear}年-${startYear}年`);
      const newStart = Math.min(startYear, endYear);
      const newEnd = Math.max(startYear, endYear);
      setStartYear(newStart);
      setEndYear(newEnd);
      setTimeout(() => {
        setYearError('');
      }, 3000);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [trendRes, policiesRes] = await Promise.all([
          trendApi.getAnnualTrend(startYear, endYear),
          trendApi.getPolicyNodes(),
        ]);
        setTrendData(trendRes);
        setPolicies(policiesRes);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [startYear, endYear]);

  const years = Array.from({ length: 10 }, (_, i) => 2015 + i);
  const startYearOptions = years.slice(0, -1);
  const endYearOptions = years.slice(1);

  const handleStartYearChange = (newYear: number) => {
    if (newYear > endYear) {
      setYearError(`开始年份(${newYear}年)不能大于结束年份(${endYear}年)，已自动调整结束年份`);
      setEndYear(newYear);
      setTimeout(() => setYearError(''), 3000);
    } else {
      setYearError('');
    }
    setStartYear(newYear);
  };

  const handleEndYearChange = (newYear: number) => {
    if (newYear < startYear) {
      setYearError(`结束年份(${newYear}年)不能小于开始年份(${startYear}年)，已自动调整开始年份`);
      setStartYear(newYear);
      setTimeout(() => setYearError(''), 3000);
    } else {
      setYearError('');
    }
    setEndYear(newYear);
  };

  const handleExportCSV = () => {
    if (trendData.length === 0) return;
    
    const headers = ['年份', '结婚率(‰)', '离婚率(‰)', '结婚登记(万对)', '离婚登记(万对)'];
    const rows = trendData.map((d) => [
      d.year,
      d.marriageRate,
      d.divorceRate,
      d.marriageCount,
      d.divorceCount,
    ]);
    
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `婚姻趋势数据_${startYear}-${endYear}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">年度趋势分析</h2>
          <p className="text-gray-500 text-sm mt-1">
            近10年结婚率与离婚率变化趋势
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            <Download size={16} />
            导出数据
          </button>
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">年份范围：</span>
              </div>
              <select
                value={startYear}
                onChange={(e) => handleStartYearChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {startYearOptions.map((year) => (
                  <option key={year} value={year} disabled={year > endYear}>
                    {year}年
                  </option>
                ))}
              </select>
              <span className="text-gray-400">至</span>
              <select
                value={endYear}
                onChange={(e) => handleEndYearChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {endYearOptions.map((year) => (
                  <option key={year} value={year} disabled={year < startYear}>
                    {year}年
                  </option>
                ))}
              </select>
            </div>
            {yearError && (
              <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle size={16} className="text-amber-500" />
                <span className="text-sm text-amber-700">{yearError}</span>
              </div>
            )}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showForecast}
              onChange={(e) => setShowForecast(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">显示趋势预测</span>
          </label>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-80">
          <div className="animate-pulse text-gray-400">加载中...</div>
          </div>
        ) : (
          <TrendChart data={trendData} policies={policies} showForecast={showForecast} height={420} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-blue-500" />
            关键趋势解读
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">结婚率持续下降</p>
                <p className="text-xs text-gray-500 mt-1">
                  从2015年的9.0‰下降至2024年的4.9‰，降幅达45.6%
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-amber-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">离婚率先升后降</p>
                <p className="text-xs text-gray-500 mt-1">
                  2019年达到峰值3.4‰，2021年受离婚冷静期政策影响显著下降
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">政策效应明显</p>
                <p className="text-xs text-gray-500 mt-1">
                  离婚冷静期实施后，离婚登记数量同比下降约34%
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <BarChart3 size={20} className="text-violet-500" />
            政策节点说明
          </h3>
          <div className="space-y-4">
            {policies.map((policy, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-violet-500" />
                  {index < policies.length - 1 && (
                    <div className="w-0.5 flex-1 bg-violet-200" />
                  )}
                </div>
                <div className="pb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800">
                      {policy.year}年{policy.month ? `${policy.month}月` : ''}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-violet-100 text-violet-700 rounded-full">
                      {policy.name}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{policy.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrendPage;
