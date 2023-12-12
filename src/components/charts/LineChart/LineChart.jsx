import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import { axiosInstance } from '../../../config/axios';

const LineChart = () => {
  const chartRef = useRef(null);
  const [dataChart, setDataChart] = useState();

  async function countObjectsByYear(data) {
    const counts = data.reduce((accumulator, currentValue) => {
      const createdAtYear = new Date(currentValue.createdAt).getFullYear();
      if (!accumulator[createdAtYear]) {
        accumulator[createdAtYear] = 1;
      } else {
        accumulator[createdAtYear]++;
      }
      return accumulator;
    }, {});

    return counts;
  }

  async function createIncomeArray(data) {
    const counts = await countObjectsByYear(data);
    const incomeArray = [
      ['Income', 'Company', 'Year'],
      [5, 'ST United', 2019],
      [8, 'ST United', 2020],
    ];

    for (const year in counts) {
      incomeArray.push([counts[year], 'ST United', parseInt(year)]);
    }

    setDataChart(incomeArray);
  }

  // Gọi hàm để tạo mảng incomeArray
  useEffect(() => {
    const fetchData = async () => {
      try {
        await axiosInstance.get('employees').then((response) => {
          createIncomeArray(response.data);
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (dataChart) {
      const rawData = dataChart;
      run(rawData);
    }
  }, [dataChart]);

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

  return <div ref={chartRef} style={{ width: '100%', height: '230px' }} />;
};

export default LineChart;
