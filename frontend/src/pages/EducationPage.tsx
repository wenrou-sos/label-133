import { useEffect, useState } from 'react';
import { GraduationCap, TrendingDown, BarChart4, Info } from 'lucide-react';
import EducationChart from '@/components/charts/EducationChart';
import { educationApi } from '@/services/api';
import type { EducationData, CorrelationResult } from '@/types';

const EducationPage = () => {
  const [educationData, setEducationData] = useState<EducationData[]>([]);
  const [correlation, setCorrelation] = useState<CorrelationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dataRes, corrRes] = await Promise.all([
          educationApi.getEducationData(year),
          educationApi.getCorrelation(),
        ]);
        setEducationData(dataRes);
        setCorrelation(corrRes);
      } catch (error) {
        console.error('Failed to fetch education data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">教育程度分析</h2>
          <p className="text-gray-500 text-sm mt-1">
            教育程度与婚姻稳定性的关联性分析
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {[2020, 2022, 2024].map((y) => (
              <option key={y} value={y}>
                {y}年
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap size={18} className="text-violet-500" />
            <span className="text-sm text-gray-500">学历分组</span>
          </div>
          <div className="metric-number text-2xl font-bold text-gray-800">
            {educationData.length} 组
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <BarChart4 size={18} className="text-violet-500" />
            <span className="text-sm text-gray-500">平均离婚率</span>
          </div>
          <div className="metric-number text-2xl font-bold text-violet-600">
            {educationData.length > 0
              ? (educationData.reduce((s, d) => s + d.divorceRate, 0) / educationData.length).toFixed(2)
              : '-'}‰
          </div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-emerald-500" />
            <span className="text-sm text-gray-500">相关系数</span>
          </div>
          <div className="metric-number text-2xl font-bold text-emerald-600">
            {correlation?.correlation || '-'}
          </div>
        </div>
        <div className="card p-5 bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="flex items-center gap-2 mb-2">
            <Info size={18} className="text-amber-500" />
            <span className="text-sm text-amber-600">显著性水平</span>
          </div>
          <div className="text-lg font-bold text-amber-700">
            p = {correlation?.pValue || '-'}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">
          各教育程度离婚率对比
        </h3>
        {loading ? (
          <div className="flex items-center justify-center h-80">
            <div className="animate-pulse text-gray-400">加载中...</div>
          </div>
        ) : (
          <EducationChart data={educationData} correlation={correlation || undefined} height={380} />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">研究发现</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-violet-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-violet-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">负相关关系显著</p>
                <p className="text-xs text-gray-500 mt-1">
                  教育程度与离婚率呈显著负相关，学历越高，离婚率相对越低
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">经济基础支撑</p>
                <p className="text-xs text-gray-500 mt-1">
                  高学历群体通常收入更稳定，经济压力较小，减少婚姻矛盾来源
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-emerald-50 rounded-lg">
              <div className="w-2 h-2 mt-2 rounded-full bg-emerald-500" />
              <div>
                <p className="text-sm font-medium text-gray-800">认知能力优势</p>
                <p className="text-xs text-gray-500 mt-1">
                  受教育程度高的人群在婚姻中沟通能力更强，更能理性处理矛盾
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">数据说明</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• 数据为抽样调查结果，样本量覆盖各教育程度人群</p>
            <p>• 离婚率为千分比（‰），指每千人中的离婚人数</p>
            <p>• 相关系数 r 取值范围 [-1, 1]，绝对值越大相关性越强</p>
            <p>• 决定系数 R² 表示因变量变异中可由自变量解释的比例</p>
            <p>• p 值 {'<'} 0.05 表示统计显著，即结果具有统计学意义</p>
            <p>• 本分析仅显示相关性，不代表因果关系</p>
          </div>
        </div>
      </div>

      <div className="card p-6 bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 border border-violet-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <GraduationCap size={28} className="text-violet-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">核心结论</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              教育程度与婚姻稳定性存在显著的正相关关系。随着受教育水平提高，
              离婚率呈现下降趋势。这可能与高学历群体的经济稳定性、
              认知能力和婚姻观念有关。但需要注意的是，相关性不等于因果性，
              实际婚姻状况还受到家庭背景、社会环境、个人性格等多方面因素的综合影响。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationPage;
