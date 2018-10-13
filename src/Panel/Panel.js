import React from 'react';
import styles from './Panel.module.css';

const Panel = ({children, className, ...rest}) => (
  <div
    className={`${styles.panel} ${className}`}
    {...rest}
  >
    {children}
  </div>
);

export default Panel;
