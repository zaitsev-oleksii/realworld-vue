export const parseErrors = (errors) => {
  return `Error: ${Object.keys(errors)[0]} ${Object.values(errors).join(",")}`;
};
