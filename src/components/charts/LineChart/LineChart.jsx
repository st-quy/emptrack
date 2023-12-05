import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import data from '../../../../data.json';
const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const rawData = data;
    run(rawData);
  });
  const run = (_rawData) => {
    const companys = ['ST United'];
    const datasetWithFilters = [];
    const seriesList = [];

    echarts.util.each(companys, function (company) {
      var datasetId = 'dataset_' + company;
      datasetWithFilters.push({
        id: datasetId,
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [
              { dimension: 'Year', gte: 2000 },
              { dimension: 'Company', '=': company },
            ],
          },
        },
      });

      seriesList.push({
        type: 'line',
        datasetId: datasetId,
        showSymbol: false,
        name: company,
        endLabel: {
          show: true,
          formatter: function (params) {
            return params.value[1] + ': ' + params.value[0];
          },
        },
        labelLayout: {
          moveOverlap: 'shiftY',
        },
        emphasis: {
          focus: 'series',
        },
        encode: {
          x: 'Year',
          y: 'Income',
          label: ['Company', 'Income'],
          itemName: 'Year',
          tooltip: ['Income'],
        },
      });
    });

    const option = {
      color: ['black'],
      animationDuration: 10000,
      dataset: [
        {
          id: 'dataset_raw',
          source: _rawData,
        },
        ...datasetWithFilters,
      ],
      tooltip: {
        order: 'valueDesc',
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        nameLocation: 'middle',
      },
      yAxis: {
        name: 'Income',
      },
      series: seriesList,
    };

    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(option);
  };

  return <div ref={chartRef} style={{ width: '100%', height: '250px' }} />;
};

export default LineChart;
