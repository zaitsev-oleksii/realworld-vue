const dateParsingOptions = { year: "numeric", month: "long", day: "numeric" };

export const parseDate = (str) => {
  return new Date(str).toLocaleDateString("en-US", dateParsingOptions);
};

export const parseErrors = (errors) => {
  return `Error: ${Object.keys(errors)[0]} ${Object.values(errors).join(",")}`;
};
