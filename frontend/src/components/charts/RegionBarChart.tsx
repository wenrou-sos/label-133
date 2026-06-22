import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { RegionData } from '@/types';
import { useMemo } from 'react';

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
  const option = useMemo<EChartsOption>(() => {
    if (!data || data.length === 0) {
      return {
        title: {
          text: '数据加载中...',
          left: 'center',
          top: 'center',
          textStyle: { color: '#9ca3af' },
        },
      };
    }

    let sortedData = [...data];
    if (sortBy === 'marriage') {
      sortedData.sort((a, b) =>
        sortOrder === 'desc' ? b.marriageRate - a.marriageRate : a.marriageRate - b.marriageRate
      );
    } else if (sortBy === 'divorce') {
      sortedData.sort((a, b) =>
        sortOrder === 'desc' ? b.divorceRate - a.divorceRate : a.divorceRate - b.divorceRate
      );
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
        },
        markLine: showType === 'marriage'
          ? {
              data: [{ yAxis: avgMarriage, name: '平均值' }],
              lineStyle: { color: '#ef4444', type: 'dashed', width: 2 },
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
        },
        markLine: showType === 'divorce'
          ? {
              data: [{ yAxis: avgDivorce, name: '平均值' }],
              lineStyle: { color: '#ef4444', type: 'dashed', width: 2 },
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
          const name = params[0].axisValue;
          const regionData = sortedData.find((d) => d.name === name);
          let html = `<div style="font-weight: 600; margin-bottom: 8px;">${name}</div>`;
          params.forEach((item: any) => {
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
  }, [data, showType, sortBy, sortOrder]);

  const handleClick = (params: any) => {
    if (onBarClick && data) {
      const region = data.find((d) => d.name === params.name);
      if (region) {
        onBarClick(region);
      }
    }
  };

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
      onEvents={onBarClick ? { click: handleClick } : undefined}
    />
  );
};

export default RegionBarChart;
