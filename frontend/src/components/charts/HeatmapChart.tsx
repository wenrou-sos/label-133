import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { HeatmapData } from '@/types';
import { useMemo } from 'react';
import { monthNames } from '@/utils';

interface HeatmapChartProps {
  data: HeatmapData | null;
  title?: string;
  colorRange?: string[];
  height?: number;
}

const defaultColors = ['#eff6ff', '#93c5fd', '#3b82f6', '#1d4ed8', '#1e3a5f'];

const HeatmapChart = ({
  data,
  title = '结婚登记热力图',
  colorRange = defaultColors,
  height = 500,
}: HeatmapChartProps) => {
  const option = useMemo<EChartsOption>(() => {
    if (!data || !data.data || data.data.length === 0) {
      return {
        title: {
          text: '数据加载中...',
          left: 'center',
          top: 'center',
          textStyle: { color: '#9ca3af' },
        },
      };
    }

    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    const heatmapData: { value: [number, number, number]; isPeak?: boolean; peakType?: string }[] = [];

    data.data.forEach((item) => {
      const monthIdx = item.month - 1;
      const dayIdx = item.day - 1;
      heatmapData.push({
        value: [monthIdx, dayIdx, item.count],
        isPeak: item.isPeak,
        peakType: item.peakType,
      });
    });

    return {
      title: {
        text: title,
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 600,
          color: '#1f2937',
        },
      },
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#374151',
          fontSize: 13,
        },
        formatter: (params: any) => {
          const month = params.value[0] + 1;
          const day = params.value[1] + 1;
          const count = params.value[2];
          const isPeak = params.data && params.data.isPeak;
          let html = `<div style="font-weight: 600; margin-bottom: 4px;">${month}月${day}日</div>`;
          html += `<div>登记数量：<span style="font-weight: 600;">${Math.round(count).toLocaleString()}</span> 对</div>`;
          if (isPeak) {
            html += `<div style="color: #ef4444; margin-top: 4px;">★ 高峰期</div>`;
          }
          return html;
        },
      },
      grid: {
        left: 60,
        right: 80,
        top: 60,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        data: monthNames,
        axisLine: {
          lineStyle: { color: '#e5e7eb' },
        },
        axisTick: { show: false },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
        },
        splitArea: { show: false },
      },
      yAxis: {
        type: 'category',
        data: days.map((d) => `${d}日`),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#6b7280',
          fontSize: 11,
          interval: 1,
        },
        splitArea: { show: false },
      },
      visualMap: {
        min: data.minCount,
        max: data.maxCount,
        calculable: true,
        orient: 'vertical',
        right: 10,
        top: 'center',
        inRange: {
          color: colorRange,
        },
        textStyle: {
          color: '#6b7280',
          fontSize: 11,
        },
      },
      series: [
        {
          name: '登记数量',
          type: 'heatmap',
          data: heatmapData,
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
            },
          },
          itemStyle: {
            borderWidth: 0.5,
            borderColor: '#fff',
          },
        },
      ],
      animationDuration: 1000,
    };
  }, [data, title, colorRange]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default HeatmapChart;
