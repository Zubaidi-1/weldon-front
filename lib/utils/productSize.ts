export const formatProductSize = (size: number | string | null | undefined) => {
  if (size === null || size === undefined || size === "") {
    return "";
  }

  return `${size} ml`;
};
