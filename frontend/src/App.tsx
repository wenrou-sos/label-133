import Navbar from '@/components/layout/Navbar';
import OverviewPage from '@/pages/OverviewPage';
import TrendPage from '@/pages/TrendPage';
import HeatmapPage from '@/pages/HeatmapPage';
import AgePage from '@/pages/AgePage';
import RegionPage from '@/pages/RegionPage';
import EducationPage from '@/pages/EducationPage';
import CrossPage from '@/pages/CrossPage';
import { useAppStore } from '@/store/useAppStore';

function App() {
  const { activeTab } = useAppStore();

  const renderPage = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewPage />;
      case 'trend':
        return <TrendPage />;
      case 'heatmap':
        return <HeatmapPage />;
      case 'age':
        return <AgePage />;
      case 'region':
        return <RegionPage />;
      case 'education':
        return <EducationPage />;
      case 'crosstab':
        return <CrossPage />;
      default:
        return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
      <footer className="border-t border-gray-200 bg-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              婚姻状况数据分析平台 © 2024
            </p>
            <p className="text-sm text-gray-400">
              数据仅供参考，以官方发布为准
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
