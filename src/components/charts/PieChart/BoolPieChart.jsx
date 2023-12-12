import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BoolPieChart = () => {
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
        selectedMode: false,
      },
      series: [
        {
          name: 'Access From',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '70%'],
          startAngle: 180,
          label: {
            show: true,
            formatter: function (param) {
              return ' (' + param.percent * 2 + '%)';
            },
          },
          data: [
            { value: 1048, name: 'Joined' },
            { value: 735, name: 'Ready to Join' },
            {
              value: 1048 + 735,
              itemStyle: {
                color: 'none',
                decal: {
                  symbol: 'none',
                },
              },
              label: {
                show: false,
              },
            },
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

export default BoolPieChart;
