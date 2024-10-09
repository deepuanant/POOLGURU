// src/utils.js
export const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US', { style: 'decimal' }).format(number);
  };
  