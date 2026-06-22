import { useEffect, useMemo, useState } from 'react';
import { GitCompare, ArrowLeftRight, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import CrosstabHeatmap from '@/components/charts/CrosstabHeatmap';
import { crosstabApi } from '@/services/api';
import type { CrosstabData, CrosstabDim, CrosstabMetric } from '@/types';

const DIM_OPTIONS: { value: CrosstabDim; label: string; description: string }[] = [
  { value: 'age', label: '年龄分布', description: '按初婚年龄分组' },
  { value: 'education', label: '教育程度', description: '按学历水平分组' },
  { value: 'region', label: '地域', description: '按东部/中部/西部/东北分组' },
];

const METRIC_OPTIONS: { value: CrosstabMetric; label: string; color: string }[] = [
  { value: 'divorceRate', label: '离婚率', color: 'red' },
  { value: 'marriageRate', label: '结婚率', color: 'blue' },
];

const CrossPage = () => {
  const [dimX, setDimX] = useState<CrosstabDim>('age');
  const [dimY, setDimY] = useState<CrosstabDim>('education');
  const [metric, setMetric] = useState<CrosstabMetric>('divorceRate');
  const [year, setYear] = useState(2024);
  const [data, setData] = useState<CrosstabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await crosstabApi.getCrosstab(dimX, dimY, year, metric);
      if (res.error) {
        setErrorMsg(res.error);
        setData(null);
      } else {
        setData(res);
      }
    } catch (error) {
      console.error('Failed to fetch crosstab data:', error);
      setErrorMsg('数据加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dimX, dimY, year, metric]);

  const handleSwap = () => {
    const tmp = dimX;
    setDimX(dimY);
    setDimY(tmp);
  };

  const handleDimXChange = (newVal: CrosstabDim) => {
    if (newVal === dimY) {
      setErrorMsg('两个维度不能相同，已自动交换');
      setDimX(newVal);
      setDimY(dimX);
      setTimeout(() => setErrorMsg(null), 2500);
    } else {
      setDimX(newVal);
    }
  };

  const handleDimYChange = (newVal: CrosstabDim) => {
    if (newVal === dimX) {
      setErrorMsg('两个维度不能相同，已自动交换');
      setDimY(newVal);
      setDimX(dimY);
      setTimeout(() => setErrorMsg(null), 2500);
    } else {
      setDimY(newVal);
    }
  };

  // 从数据中挖掘分析洞察
  const insights = useMemo(() => {
    if (!data || data.error) return null;
    const cells = data.data.map(([x, y, v]) => ({ x, y, v }));
    const sorted = [...cells].sort((a, b) => b.v - a.v);
    const maxCell = sorted[0];
    const minCell = sorted[sorted.length - 1];
    const diff = (maxCell.v - minCell.v).toFixed(2);
    const maxXLabel = data.xLabels[maxCell.x];
    const maxYLabel = data.yLabels[maxCell.y];
    const minXLabel = data.xLabels[minCell.x];
    const minYLabel = data.yLabels[minCell.y];

    // 找出 Y 维度的最高/最低均值（趋势）
    const rowMeansWithLabel = data.rowMeans.map((m, i) => ({ label: data.xLabels[i], mean: m }));
    const sortedRow = [...rowMeansWithLabel].sort((a, b) => b.mean - a.mean);

    return {
      maxCell,
      minCell,
      diff,
      maxXLabel,
      maxYLabel,
      minXLabel,
      minYLabel,
      topRow: sortedRow[0],
      bottomRow: sortedRow[sortedRow.length - 1],
    };
  }, [data]);

  const metricInfo = METRIC_OPTIONS.find((m) => m.value === metric)!;
  const metricUnit = metric === 'divorceRate' || metric === 'marriageRate' ? '‰' : '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <GitCompare size={24} className="text-primary-700" />
            交叉分析
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            选择两个维度，通过矩阵热力图直观对比不同组合下的 {metricInfo.label} 差异
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            {[2020, 2022, 2024].map((y) => (
              <option key={y} value={y}>
                {y} 年
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 维度选择器 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Y 维度 */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">行维度（Y 轴）</label>
            <div className="grid grid-cols-3 gap-2">
              {DIM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleDimYChange(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    dimY === opt.value
                      ? 'bg-primary-700 text-white border-primary-700 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 交换按钮 */}
          <div className="flex justify-center lg:px-2">
            <button
              onClick={handleSwap}
              title="交换 X / Y 维度"
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-700 flex items-center justify-center transition-colors border border-gray-200"
            >
              <ArrowLeftRight size={18} />
            </button>
          </div>

          {/* X 维度 */}
          <div className="flex-1 min-w-0">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">列维度（X 轴）</label>
            <div className="grid grid-cols-3 gap-2">
              {DIM_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleDimXChange(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    dimX === opt.value
                      ? 'bg-primary-700 text-white border-primary-700 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* 指标切换 */}
          <div className="lg:min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">分析指标</label>
            <div className="grid grid-cols-2 gap-2">
              {METRIC_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setMetric(opt.value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                    metric === opt.value
                      ? opt.color === 'red'
                        ? 'bg-red-500 text-white border-red-500 shadow-md'
                        : 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-4 flex items-center gap-2 text-amber-700 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            <AlertCircle size={16} />
            <span className="text-sm">{errorMsg}</span>
          </div>
        )}
      </div>

      {/* 热力图主体 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-lg font-semibold text-gray-800">
            {DIM_OPTIONS.find((d) => d.value === dimY)?.label} ×{' '}
            {DIM_OPTIONS.find((d) => d.value === dimX)?.label} {metricInfo.label}矩阵
          </h3>
          <span className="text-xs text-gray-400">
            颜色越深代表{metricInfo.label}越高，悬停可查看精确数值
          </span>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
              <span className="text-gray-500 text-sm">加载中...</span>
            </div>
          </div>
        ) : (
          <CrosstabHeatmap data={data!} height={560} />
        )}
      </div>

      {/* 分析洞察 */}
      {insights && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-5 border border-red-200">
            <div className="flex items-center gap-2 text-red-800 mb-2">
              <TrendingUp size={18} />
              <span className="text-sm font-semibold">最高 {metricInfo.label} 组合</span>
            </div>
            <p className="text-2xl font-bold text-red-900">
              {insights.maxYLabel} × {insights.maxXLabel}
            </p>
            <p className="text-sm text-red-700 mt-1">
              {metricInfo.label}达 <b>{insights.maxCell.v}{metricUnit}</b>
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <TrendingDown size={18} />
              <span className="text-sm font-semibold">最低 {metricInfo.label} 组合</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">
              {insights.minYLabel} × {insights.minXLabel}
            </p>
            <p className="text-sm text-blue-700 mt-1">
              {metricInfo.label}仅 <b>{insights.minCell.v}{metricUnit}</b>
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <AlertCircle size={18} />
              <span className="text-sm font-semibold">极差与差异</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {insights.diff}{metricUnit}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {DIM_OPTIONS.find((d) => d.value === dimX)?.label}维度：{' '}
              <b className="text-red-700">{insights.topRow.label}</b> 均值最高（
              {insights.topRow.mean}{metricUnit}），{' '}
              <b className="text-blue-700">{insights.bottomRow.label}</b> 均值最低
            </p>
          </div>
        </div>
      )}

      {/* 组合说明 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">分析说明</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">年龄 × 教育程度</h4>
            <p>可观察不同学历人群在各初婚年龄段的离婚率差异，验证"高学历 + 晚婚"是否更稳定。</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">地域 × 教育程度</h4>
            <p>对比东部、中部、西部、东北地区在各学历段的婚姻差异，分析区域经济与观念的影响。</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">地域 × 年龄</h4>
            <p>考察不同地区的初婚年龄结构，观察东北地区是否普遍呈现"低结婚率 + 高离婚率"模式。</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-1">颜色标尺</h4>
            <p>右侧色条从浅蓝到深红，颜色越深数值越高。悬停单元格可查看精确的 {metricInfo.label} 数值。</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossPage;
