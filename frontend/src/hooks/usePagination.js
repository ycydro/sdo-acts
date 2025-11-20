import { useState } from "react";

export const usePagination = (initialState = { pageIndex: 0, pageSize: 5 }) => {
  const [pagination, setPagination] = useState(initialState);

  return {
    pagination,
    setPagination,
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
  };
};
