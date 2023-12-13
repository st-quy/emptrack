import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const WorkingPieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);

    const option = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '0',
        left: 'center',
        itemWidth: 20,
        itemHeight: 14,
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: 'Frontend' },
            { value: 735, name: 'Backend' },
            { value: 580, name: 'Devops' },
            { value: 484, name: 'Tester' },
            { value: 300, name: 'FullStack' },
            { value: 12, name: 'BA' },
          ],
          top: 20,
        },
      ],
    };

    chartInstance.setOption(option);

    return () => {
      chartInstance.dispose();
    };
  }, []);

  return (
    <div
      id="main"
      style={{ width: '100%', height: '230px', paddingTop: '16px' }}
      ref={chartRef}
    ></div>
  );
};

export default WorkingPieChart;
