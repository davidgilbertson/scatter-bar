import React from 'react';
import styles from './Panel.module.css';

const Panel = (props) => (
  <div className={`${styles.panel} ${props.className}`}>
    {props.children}
  </div>
);

export default Panel;
