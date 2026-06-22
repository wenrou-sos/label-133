import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { EducationData, CorrelationResult } from '@/types';
import { useMemo } from 'react';

interface EducationChartProps {
  data: EducationData[];
  correlation?: CorrelationResult;
  height?: number;
}

const EducationChart = ({ data, correlation, height = 400 }: EducationChartProps) => {
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

    const educationLevels = data.map((d) => d.educationLevel);
    const divorceRates = data.map((d) => d.divorceRate);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: 13 },
        formatter: (params: any) => {
          const level = params[0].axisValue;
          const itemData = data.find((d) => d.educationLevel === level);
          let html = `<div style="font-weight: 600; margin-bottom: 8px;">${level}</div>`;
          html += `<div style="display: flex; align-items: center; margin: 4px 0;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #8b5cf6; margin-right: 8px;"></span>
            <span style="color: #6b7280;">离婚率：</span>
            <span style="font-weight: 600; color: #8b5cf6;">${itemData?.divorceRate}‰</span>
          </div>`;
          html += `<div style="margin-top: 6px; color: #9ca3af; font-size: 12px;">
            样本量：${(itemData?.sampleSize || 0).toLocaleString()} 人<br/>
            显著性水平：p = ${itemData?.significance || 'N/A'}
          </div>`;
          return html;
        },
      },
      grid: {
        left: 60,
        right: 40,
        top: 50,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        data: educationLevels,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#6b7280',
          fontSize: 12,
          rotate: 0,
          interval: 0,
        },
      },
      yAxis: {
        type: 'value',
        name: '离婚率（‰）',
        nameTextStyle: { color: '#9ca3af', fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#6b7280', fontSize: 12 },
      },
      series: [
        {
          name: '离婚率',
          type: 'bar',
          data: divorceRates.map((value) => ({
            value,
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#a78bfa' },
                  { offset: 1, color: '#7c3aed' },
                ],
              },
              borderRadius: [6, 6, 0, 0],
            },
          })),
          barWidth: '50%',
          markLine: {
            data: [
              {
                type: 'average',
                name: '平均值',
                lineStyle: { color: '#ef4444', type: 'dashed', width: 2 },
                label: { formatter: '平均: {c}‰', color: '#ef4444' },
              },
            ],
            symbol: 'none',
          },
          label: {
            show: true,
            position: 'top',
            color: '#374151',
            fontSize: 12,
            fontWeight: 600,
            formatter: '{c}‰',
          },
        },
      ],
      animationDuration: 1200,
      animationEasing: 'cubicOut',
    };
  }, [data]);

  return (
    <div>
      <ReactECharts
        option={option}
        style={{ height, width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
      {correlation && (
        <div className="mt-4 p-4 bg-violet-50 rounded-lg border border-violet-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-sm text-violet-700 font-medium">教育程度与离婚率相关性分析</p>
              <p className="text-xs text-violet-600 mt-1">{correlation.interpretation}</p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-700">{correlation.correlation}</p>
                <p className="text-xs text-violet-600">相关系数 r</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-700">{correlation.rSquared}</p>
                <p className="text-xs text-violet-600">决定系数 R²</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-violet-700">{correlation.pValue}</p>
                <p className="text-xs text-violet-600">显著性 p值</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EducationChart;
