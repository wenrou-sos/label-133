import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';
import type { CrosstabData } from '@/types';
import { useMemo } from 'react';

interface CrosstabHeatmapProps {
  data: CrosstabData;
  height?: number;
}

const DIM_LABELS: Record<string, string> = {
  age: '年龄分布',
  education: '教育程度',
  region: '地域',
};

const METRIC_LABELS: Record<string, { label: string; unit: string }> = {
  divorceRate: { label: '离婚率', unit: '‰' },
  marriageRate: { label: '结婚率', unit: '‰' },
};

const CrosstabHeatmap = ({ data, height = 520 }: CrosstabHeatmapProps) => {
  const option = useMemo(() => {
    if (!data || data.error || !data.xLabels || !data.yLabels) {
      return {
        title: {
          text: data?.error || '数据加载中...',
          left: 'center',
          top: 'center',
          textStyle: { color: '#9ca3af', fontSize: 14 },
        },
      } as EChartsOption;
    }

    const metricInfo = METRIC_LABELS[data.metric] || METRIC_LABELS.divorceRate;
    const { xLabels, yLabels } = data;

    // 颜色渐变：从浅蓝（低值）到深红（高值）
    const colorStops = [
      { offset: 0, color: '#dbeafe' },
      { offset: 0.25, color: '#93c5fd' },
      { offset: 0.5, color: '#60a5fa' },
      { offset: 0.75, color: '#f97316' },
      { offset: 1, color: '#dc2626' },
    ];

    // 构造带 label 的 data，用于单元格内显示数值
    const labeledData = data.data.map(([x, y, value]) => ({
      value: [x, y, value],
    }));

    return {
      tooltip: {
        position: 'top',
        backgroundColor: 'rgba(255, 255, 255, 0.98)',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        textStyle: { color: '#374151', fontSize: 13 },
        formatter: (params: any) => {
          const { value } = params;
          const xIdx = value[0];
          const yIdx = value[1];
          const v = value[2];
          return `
            <div style="font-weight: 600; margin-bottom: 6px;">${yLabels[yIdx]} × ${xLabels[xIdx]}</div>
            <div style="color: #6b7280;">${metricInfo.label}：<span style="color: #111827; font-weight: 600;">${v}${metricInfo.unit}</span></div>
          `;
        },
      },
      grid: {
        left: 100,
        right: 80,
        top: 50,
        bottom: 60,
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        name: DIM_LABELS[data.dimX],
        nameLocation: 'middle',
        nameGap: 36,
        nameTextStyle: { color: '#374151', fontSize: 13, fontWeight: 600 },
        axisLabel: {
          color: '#4b5563',
          fontSize: 12,
          interval: 0,
          rotate: xLabels.length > 5 ? 25 : 0,
        },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        splitArea: { show: false },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        name: DIM_LABELS[data.dimY],
        nameLocation: 'middle',
        nameGap: 70,
        nameTextStyle: { color: '#374151', fontSize: 13, fontWeight: 600 },
        axisLabel: { color: '#4b5563', fontSize: 12 },
        axisLine: { lineStyle: { color: '#e5e7eb' } },
        axisTick: { show: false },
        splitArea: { show: false },
      },
      visualMap: {
        min: data.minValue,
        max: data.maxValue,
        calculable: true,
        orient: 'vertical',
        right: 10,
        top: 'center',
        itemHeight: 200,
        itemWidth: 16,
        textStyle: { color: '#6b7280', fontSize: 11 },
        precision: 2,
        inRange: {
          color: colorStops.map((s) => s.color),
        },
        formatter: (value: any) => `${value}${metricInfo.unit}`,
      },
      series: [
        {
          name: metricInfo.label,
          type: 'heatmap',
          data: labeledData,
          label: {
            show: true,
            color: '#111827',
            fontSize: 11,
            fontWeight: 500,
            formatter: (params: any) => `${params.value[2]}`,
          },
          emphasis: {
            itemStyle: {
              borderColor: '#111827',
              borderWidth: 2,
              shadowBlur: 10,
              shadowColor: 'rgba(0,0,0,0.3)',
            },
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 2,
            borderRadius: 4,
          },
          progressive: 1000,
          animation: true,
          animationDuration: 600,
          animationEasing: 'cubicOut',
        },
      ],
    } as EChartsOption;
  }, [data]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'svg' }}
      notMerge
    />
  );
};

export default CrosstabHeatmap;
