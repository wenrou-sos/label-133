import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { AgeDistribution } from '@/types';
import { useMemo } from 'react';

interface AgeHistogramProps {
  maleData: AgeDistribution | null;
  femaleData: AgeDistribution | null;
  height?: number;
}

const AgeHistogram = ({ maleData, femaleData, height = 400 }: AgeHistogramProps) => {
  const option = useMemo<EChartsOption>(() => {
    if (!maleData || !femaleData) {
      return {
        title: {
          text: '数据加载中...',
          left: 'center',
          top: 'center',
          textStyle: { color: '#9ca3af' },
        },
      };
    }

    const ageRanges = maleData.ageGroups.map((g) => g.ageRange);
    const maleCounts = maleData.ageGroups.map((g) => g.percentage);
    const femaleCounts = femaleData.ageGroups.map((g) => g.percentage);

    const peak3034Idx = ageRanges.indexOf('30-34岁');
    const peak2529Idx = ageRanges.indexOf('25-29岁');

    const maleItemStyles = maleCounts.map((_, i) => {
      if (i === peak2529Idx || i === peak3034Idx) {
        return { color: '#2563eb' };
      }
      return { color: '#93c5fd' };
    });

    const femaleItemStyles = femaleCounts.map((_, i) => {
      if (i === peak2529Idx || i === peak3034Idx) {
        return { color: '#db2777' };
      }
      return { color: '#f9a8d4' };
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: 13 },
        formatter: (params: any) => {
          const ageRange = params[0].axisValue;
          let html = `<div style="font-weight: 600; margin-bottom: 8px;">${ageRange}</div>`;
          params.forEach((item: any) => {
            html += `<div style="display: flex; align-items: center; margin: 4px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>
              <span style="color: #6b7280;">${item.seriesName}：</span>
              <span style="font-weight: 600;">${item.value}%</span>
            </div>`;
          });
          return html;
        },
      },
      legend: {
        data: ['男性', '女性'],
        top: 0,
        right: 0,
        itemWidth: 16,
        itemHeight: 10,
        textStyle: { color: '#6b7280', fontSize: 13 },
      },
      grid: {
        left: 60,
        right: 40,
        top: 50,
        bottom: 40,
      },
      xAxis: {
        type: 'category',
        data: ageRanges,
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        axisLabel: { color: '#6b7280', fontSize: 12 },
      },
      yAxis: {
        type: 'value',
        name: '占比（%）',
        nameTextStyle: { color: '#9ca3af', fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { lineStyle: { color: '#f3f4f6', type: 'dashed' } },
        axisLabel: { color: '#6b7280', fontSize: 12 },
      },
      series: [
        {
          name: '男性',
          type: 'bar',
          data: maleCounts.map((value, i) => ({
            value,
            itemStyle: maleItemStyles[i],
          })),
          barWidth: '35%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
        },
        {
          name: '女性',
          type: 'bar',
          data: femaleCounts.map((value, i) => ({
            value,
            itemStyle: femaleItemStyles[i],
          })),
          barWidth: '35%',
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
      animationDuration: 1200,
      animationEasing: 'cubicOut',
    };
  }, [maleData, femaleData]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  );
};

export default AgeHistogram;
