export const buildQueryParams = ({ search, filters, page, limit }) => {
  const params = {};

  if (search) params.search = search;
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params[key] = value;
      }
    });
  }
  if (page) params.page = page;
  if (limit) params.limit = limit;

  return params;
};
