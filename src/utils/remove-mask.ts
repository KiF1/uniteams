export const removeMask = (value: string): string => {
  return value.replace(/\D/g, '');
};