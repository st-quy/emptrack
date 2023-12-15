import React, { useEffect, useState } from 'react';
import { Timeline } from 'antd';
import moment from 'moment';

const TimelineHistory = ({ data }) => {
  const [dataTimeLine, setDataTimeLine] = useState();
  useEffect(() => {
    if (data) {
      setDataTimeLine(
        data.history.map((item) => {
          return {
            label: moment(item.time).format('DD/MM/YYYY HH:mm:ss'),
            children: item.value.map((val) => <p>{val}</p>),
          };
        }),
      );
    }
  }, [data]);

  const onChange = (e) => {
    setMode(e.target.value);
  };

  return (
    <>
      <Timeline reverse={true} mode={'left'} items={dataTimeLine} />
    </>
  );
};
export default TimelineHistory;
