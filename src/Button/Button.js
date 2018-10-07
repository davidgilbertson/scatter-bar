import React from 'react';
import styles from './Button.module.css';

const Button = (props) => {
  const { children, className, ...buttonProps } = props;

  return (
    <button
      className={`${styles.button} ${className}`}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
