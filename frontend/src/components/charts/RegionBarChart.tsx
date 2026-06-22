import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { RegionData } from '@/types';
import { useEffect, useMemo, useRef } from 'react';

interface RegionBarChartProps {
  data: RegionData[];
  showType?: 'marriage' | 'divorce' | 'both';
  sortBy?: 'marriage' | 'divorce' | 'name';
  sortOrder?: 'asc' | 'desc';
  onBarClick?: (region: RegionData) => void;
  height?: number;
}

const RegionBarChart = ({
  data,
  showType = 'both',
  sortBy = 'marriage',
  sortOrder = 'desc',
  onBarClick,
  height = 500,
}: RegionBarChartProps) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const { sortedData, nameMap } = useMemo(() => {
    if (!data || data.length === 0) return { sortedData: [], nameMap: new Map<string, RegionData>() };
    
    let sorted = [...data];
    if (sortBy === 'marriage') {
      sorted.sort((a, b) =>
        sortOrder === 'desc' ? b.marriageRate - a.marriageRate : a.marriageRate - b.marriageRate
      );
    } else if (sortBy === 'divorce') {
      sorted.sort((a, b) =>
        sortOrder === 'desc' ? b.divorceRate - a.divorceRate : a.divorceRate - b.divorceRate
      );
    } else if (sortBy === 'name') {
      sorted.sort((a, b) =>
        sortOrder === 'desc'
          ? b.name.localeCompare(a.name, 'zh-Hans-CN', { sensitivity: 'variant', numeric: true })
          : a.name.localeCompare(b.name, 'zh-Hans-CN', { sensitivity: 'variant', numeric: true })
      );
    }
    const map = new Map(sorted.map((d) => [d.name, d]));
    return { sortedData: sorted, nameMap: map };
  }, [data, sortBy, sortOrder]);

  const option = useMemo<EChartsOption>(() => {
    if (!sortedData || sortedData.length === 0) {
      return {
        title: {
          text: '数据加载中...',
          left: 'center',
          top: 'center',
          textStyle: { color: '#9ca3af' },
        },
      };
    }

    const names = sortedData.map((d) => d.name);
    const marriageRates = sortedData.map((d) => d.marriageRate);
    const divorceRates = sortedData.map((d) => d.divorceRate);

    const avgMarriage = marriageRates.reduce((a, b) => a + b, 0) / marriageRates.length;
    const avgDivorce = divorceRates.reduce((a, b) => a + b, 0) / divorceRates.length;

    const series: any[] = [];

    if (showType === 'marriage' || showType === 'both') {
      series.push({
        name: '结婚率',
        type: 'bar',
        data: marriageRates,
        barWidth: showType === 'both' ? 12 : 20,
        itemStyle: {
          color: '#3b82f6',
          borderRadius: showType === 'both' ? [2, 0, 0, 2] : [0, 4, 4, 0],
          cursor: 'pointer',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(59, 130, 246, 0.5)',
          },
        },
        markLine: showType === 'marriage'
          ? {
              data: [{ yAxis: avgMarriage, name: '平均值' }],
              lineStyle: { color: '#ef4444', type: 'dashed' as const, width: 2 },
              label: { formatter: '平均结婚率: {c}‰', color: '#ef4444' },
              symbol: 'none',
            }
          : undefined,
      });
    }

    if (showType === 'divorce' || showType === 'both') {
      series.push({
        name: '离婚率',
        type: 'bar',
        data: divorceRates,
        barWidth: showType === 'both' ? 12 : 20,
        itemStyle: {
          color: '#f59e0b',
          borderRadius: showType === 'both' ? [0, 2, 2, 0] : [0, 4, 4, 0],
          cursor: 'pointer',
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(245, 158, 11, 0.5)',
          },
        },
        markLine: showType === 'divorce'
          ? {
              data: [{ yAxis: avgDivorce, name: '平均值' }],
              lineStyle: { color: '#ef4444', type: 'dashed' as const, width: 2 },
              label: { formatter: '平均离婚率: {c}‰', color: '#ef4444' },
              symbol: 'none',
            }
          : undefined,
      });
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: 13 },
        formatter: (params: any) => {
          const paramList = Array.isArray(params) ? params : [params];
          const first = paramList[0];
          const idx = first.dataIndex;
          const regionData = sortedData[idx];
          const regionName = regionData?.name || first.name;
          let html = `<div style="font-weight: 600; margin-bottom: 8px;">${regionName}</div>`;
          paramList.forEach((item: any) => {
            html += `<div style="display: flex; align-items: center; margin: 4px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>
              <span style="color: #6b7280;">${item.seriesName}：</span>
              <span style="font-weight: 600;">${item.value}‰</span>
            </div>`;
          });
          if (regionData) {
            html += `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
              人口：${regionData.population.toLocaleString()} 万<br/>
              结婚登记：${regionData.marriageCount.toLocaleString()} 万对<br/>
              离婚登记：${regionData.divorceCount.toLocaleString()} 万对
            </div>`;
          }
          return html;
        },
      },
      legend: showType === 'both'
        ? {
            data: ['结婚率', '离婚率'],
            top: 0,
            right: 0,
            itemWidth: 16,
            itemHeight: 10,
            textStyle: { color: '#6b7280', fontSize: 13 },
          }
        : undefined,
      grid: {
        left: 80,
        right: 60,
        top: showType === 'both' ? 50 : 30,
        bottom: 30,
      },
      xAxis: {
        type: 'value',
        name: '单位：‰',
        nameTextStyle: { color: '#9ca3af', fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#6b7280', fontSize: 12 },
      },
      yAxis: {
        type: 'category',
        data: names,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#374151', fontSize: 12 },
      },
      series,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
    };
  }, [sortedData, showType]);

  // 在 SVG 渲染模式下手动为柱状图设置 cursor 样式
  useEffect(() => {
    if (!onBarClick) return;
    const container = wrapperRef.current;
    if (!container) return;

    const updateCursorAndEvents = () => {
      const allPaths = container.querySelectorAll('path, rect');
      allPaths.forEach((el: Element) => {
        const elem = el as SVGElement;
        const w = parseFloat(elem.getAttribute('width') || '0');
        const h = parseFloat(elem.getAttribute('height') || '0');
        const d = elem.getAttribute('d') || '';
        // 判断是否是柱状图（有宽度或 d 属性包含 bar 特征）
        if ((w > 20 && h >= 6) || (d.includes('L') && d.includes('h') && d.includes('v'))) {
          elem.style.cursor = 'pointer';
        }
      });
    };

    // 初始及每次图表更新后设置
    updateCursorAndEvents();
    const timer = setTimeout(updateCursorAndEvents, 300);
    return () => clearTimeout(timer);
  }, [sortedData, showType, onBarClick]);

  const handleClick = (params: any) => {
    if (!onBarClick || !sortedData || sortedData.length === 0) return;
    let region: RegionData | undefined;
    const regionName = params.name;
    if (regionName && nameMap.has(regionName)) {
      region = nameMap.get(regionName);
    } else {
      const idx = params.dataIndex;
      if (idx != null && idx >= 0 && idx < sortedData.length) {
        region = sortedData[idx];
      }
    }
    if (region) {
      onBarClick(region);
    }
  };

  return (
    <div ref={wrapperRef}>
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'svg' }}
        notMerge
        onEvents={onBarClick ? { click: handleClick } : undefined}
      />
    </div>
  );
};

export default RegionBarChart;
