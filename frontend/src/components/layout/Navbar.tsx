import { Heart, TrendingUp, Calendar, Users, MapPin, GraduationCap, BarChart3, GitCompare } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { TabKey } from '@/types';

const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: 'overview', label: '首页概览', icon: <BarChart3 size={18} /> },
  { key: 'trend', label: '年度趋势', icon: <TrendingUp size={18} /> },
  { key: 'heatmap', label: '月度热力图', icon: <Calendar size={18} /> },
  { key: 'age', label: '年龄分布', icon: <Users size={18} /> },
  { key: 'region', label: '地域对比', icon: <MapPin size={18} /> },
  { key: 'education', label: '教育程度', icon: <GraduationCap size={18} /> },
  { key: 'crosstab', label: '交叉分析', icon: <GitCompare size={18} /> },
];

const Navbar = () => {
  const { activeTab, setActiveTab } = useAppStore();

  return (
    <nav className="bg-primary-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <Heart size={24} className="text-rose-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide">婚姻状况数据分析平台</h1>
              <p className="text-xs text-primary-200">Marriage Data Analytics Dashboard</p>
            </div>
          </div>

          <div className="hidden md:flex lg:hidden items-center space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                title={tab.label}
                className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-800 shadow-md'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center space-x-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-800 shadow-md'
                    : 'text-primary-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="md:hidden flex items-center">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as TabKey)}
              className="bg-white/10 text-white text-sm rounded-lg px-3 py-2 border border-white/20"
            >
              {tabs.map((tab) => (
                <option key={tab.key} value={tab.key} className="text-gray-900">
                  {tab.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
