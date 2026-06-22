import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { AnnualTrend, PolicyNode } from '@/types';
import { useMemo } from 'react';

interface TrendChartProps {
  data: AnnualTrend[];
  policies?: PolicyNode[];
  showForecast?: boolean;
  height?: number | string;
}

const TrendChart = ({ data, policies = [], height = 400 }: TrendChartProps) => {
  const option = useMemo<EChartsOption>(() => {
    const years = data.map((d) => d.year);
    const marriageRates = data.map((d) => d.marriageRate);
    const divorceRates = data.map((d) => d.divorceRate);

    const markLines = policies.length > 0 ? {
      data: policies.map((p) => ({
        xAxis: p.year,
        name: p.name,
        label: {
          formatter: p.name,
          position: 'insideEndTop' as const,
          fontSize: 12,
          color: '#666',
        },
        lineStyle: {
          type: 'dashed' as const,
          color: '#9ca3af',
          width: 1.5,
        },
      })),
      symbol: 'none',
      silent: false,
      label: {
        show: true,
      },
    } : undefined;

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: {
          color: '#374151',
          fontSize: 13,
        },
        formatter: (params: any) => {
          const year = params[0].axisValue;
          let html = `<div style="font-weight: 600; margin-bottom: 8px;">${year}年</div>`;
          params.forEach((item: any) => {
            html += `<div style="display: flex; align-items: center; margin: 4px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>
              <span style="color: #6b7280;">${item.seriesName}：</span>
              <span style="font-weight: 600; color: ${item.color};">${item.value}‰</span>
            </div>`;
          });
          return html;
        },
      },
      legend: {
        data: ['结婚率', '离婚率'],
        top: 0,
        right: 0,
        itemWidth: 16,
        itemHeight: 10,
        textStyle: {
          color: '#6b7280',
          fontSize: 13,
        },
      },
      grid: {
        left: 60,
        right: 40,
        top: 60,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        data: years,
        axisLine: {
          lineStyle: {
            color: '#e5e7eb',
          },
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
          formatter: '{value}年',
        },
      },
      yAxis: {
        type: 'value',
        name: '单位：‰',
        nameTextStyle: {
          color: '#9ca3af',
          fontSize: 12,
        },
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#f3f4f6',
            type: 'dashed',
          },
        },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
        },
      },
      series: [
        {
          name: '结婚率',
          type: 'line',
          data: marriageRates,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: '#3b82f6',
          },
          itemStyle: {
            color: '#3b82f6',
            borderWidth: 2,
            borderColor: '#fff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.25)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.02)' },
              ],
            },
          },
          markLine: markLines,
        },
        {
          name: '离婚率',
          type: 'line',
          data: divorceRates,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: '#f59e0b',
          },
          itemStyle: {
            color: '#f59e0b',
            borderWidth: 2,
            borderColor: '#fff',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(245, 158, 11, 0.2)' },
                { offset: 1, color: 'rgba(245, 158, 11, 0.02)' },
              ],
            },
          },
        },
      ],
      animationDuration: 1500,
      animationEasing: 'cubicOut',
    };
  }, [data, policies]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default TrendChart;
