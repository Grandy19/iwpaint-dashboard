export const formatShortCurrency = (value: number) => {
  if (value >= 1000000000) {
    return 'Rp' + (value / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' M';
  } else if (value >= 1000000) {
    return 'Rp' + (value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Jt';
  } else if (value >= 1000) {
    return 'Rp' + (value / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Rb';
  }
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
};

export const formatShortNumber = (value: number) => {
  if (value >= 1000000000) {
    return (value / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' M';
  } else if (value >= 1000000) {
    return (value / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Jt';
  } else if (value >= 1000) {
    return (value / 1000).toLocaleString('id-ID', { maximumFractionDigits: 2 }) + ' Rb';
  }
  return value.toLocaleString('id-ID');
};
