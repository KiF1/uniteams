export const getFullImageUrl = (photoPath?: string | null) => {
  if (!photoPath) return null;
  const BASE_URL = `${import.meta.env.VITE_URL_API}/storage/v1/object/public/`;
  return `${BASE_URL}${photoPath}?t=${Date.now()}`;
};
