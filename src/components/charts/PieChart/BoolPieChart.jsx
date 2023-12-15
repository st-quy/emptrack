import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTranslation } from 'react-i18next';

const BoolPieChart = () => {
  const chartRef = useRef(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const chartInstance = echarts.init(chartRef.current);
    const updateChart = () => {
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
          name: t('TABLE.ACCESS_FROM'),
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
            { value: 1048, name: t('TABLE.JOINED') },
            { value: 735, name: t('TABLE.READY_JOIN') },
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
  };

  updateChart(); 

  const languageChangeHandler = () => {
    updateChart();
  };

  i18n.on('languageChanged', languageChangeHandler);

  return () => {
    i18n.off('languageChanged', languageChangeHandler);
    chartInstance.dispose();
  };
}, [i18n]);

return (
  <div
    id="main"
    style={{ width: '100%', height: '230px', paddingTop: '16px' }}
    ref={chartRef}
  ></div>
);
};

export default BoolPieChart;
