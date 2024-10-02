export const formatNumber = (value?: number) => {
  return value ? new Intl.NumberFormat().format(Math.round(value)) : 0;
};
