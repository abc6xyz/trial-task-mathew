
import React, { useCallback, useEffect, useState } from 'react';
import { Button } from 'antd';
import { Icons } from '@/components/icons';

const Widget = (props: any) => {
  const { width, height } = props;
  const avatar =
    'https://cdn.dribbble.com/users/916023/screenshots/17305938/media/bf7a04096fe9f31f350b00f792d0c593.png?compress=1&resize=1200x900&vertical=top';
  useEffect(() => {}, []);

  return (
    <div>
      <div>
        <Icons.neon />
      </div>
      {/* <div className={styles.avatarWrap}> */}
        <div
          style={{ backgroundImage: `url(${avatar})` }}
        ></div>
        {/* <div className={styles.dot}></div> */}
      {/* </div> */}
      <div>Ida Rohan</div>
      <div>Designer</div>
      <Button type="primary" block shape="round">
        Follow
      </Button>
    </div>
  );
};

export default Widget;
