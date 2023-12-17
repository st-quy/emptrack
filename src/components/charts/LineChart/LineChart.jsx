import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/title';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import { axiosInstance } from '../../../config/axios';
import { useTranslation } from 'react-i18next';
const LineChart = () => {
  const chartRef = useRef(null);
  const [dataChart, setDataChart] = useState();
  const { t, i18n } = useTranslation();

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
      [9, 'ZeroT Solution', 2019],
      [31, 'ZeroT Solution', 2020],
      [40, 'ZeroT Solution', 2021],
      [25, 'ZeroT Solution', 2022],
    ];

    for (const year in counts) {
      incomeArray.push([counts[year], 'ZeroT Solution', parseInt(year)]);
    }

    setDataChart(incomeArray);
  }

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
    const updateChart = () => {
      if (chartRef.current) {
        const chartInstance = echarts.getInstanceByDom(chartRef.current);
        if (chartInstance) {
          const option = chartInstance.getOption();
          option.yAxis[0].name = t('TABLE.INCOME');
          chartInstance.setOption(option);
        }
      }
    };

    updateChart();
  }, [t]);
  useEffect(() => {
    if (dataChart) {
      const rawData = dataChart;
      run(rawData);
    }
  }, [dataChart]);

  const run = (_rawData) => {
    const companys = ['ZeroT Solution'];
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
        name: t('TABLE.INCOME'),
      },
      series: seriesList,
    };

    const chartInstance = echarts.init(chartRef.current);
    chartInstance.setOption(option);
  };

  return <div ref={chartRef} style={{ width: '100%', height: '230px' }} />;
};

export default LineChart;
