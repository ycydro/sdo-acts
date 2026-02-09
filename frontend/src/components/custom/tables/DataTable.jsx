import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router";

const DataTable = ({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  loading = false,
  onSearch,
  searchPlaceholder = "Search...",
  filters = {}, // Current active filters
  onFiltersChange, // Function to update filters
  filterConfig = [], // Configuration for available filters
  enableRowSelection = false, // New prop to enable checkboxes
  rowSelection = {}, // Current selected rows state
  onRowSelectionChange, // Function to update selected rows
}) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");

  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      pagination,
      rowSelection: enableRowSelection ? rowSelection : {}, // Only enable if checkbox feature is enabled
    },
    onPaginationChange,
    onRowSelectionChange: enableRowSelection ? onRowSelectionChange : undefined,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: enableRowSelection, // Enable row selection feature
    enableColumnResizing: true,
  });

  // Add selection column if enabled
  const tableColumns = enableRowSelection
    ? [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
              }
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          size: 40,
          minSize: 40,
          maxSize: 40,
        },
        ...columns,
      ]
    : columns;

  const tableInstance = useReactTable({
    data,
    columns: tableColumns,
    rowCount,
    state: {
      pagination,
      rowSelection: enableRowSelection ? rowSelection : {},
    },
    onPaginationChange,
    onRowSelectionChange: enableRowSelection ? onRowSelectionChange : undefined,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: enableRowSelection,
    enableColumnResizing: true,
  });

  const handleSearch = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
      tableInstance.setPageIndex(0);
    }
  };

  const handleFilterChange = (filterKey, value) => {
    const newFilters = { ...filters };

    if (
      value === "" ||
      value === null ||
      value === undefined ||
      value === "all"
    ) {
      delete newFilters[filterKey];
    } else {
      newFilters[filterKey] = value;
    }

    if (onFiltersChange) {
      onFiltersChange(newFilters);
      tableInstance.setPageIndex(0);

      // Update URL search params when filter changes
      const currentUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams(currentUrl.search);

      // Remove the filter if it's set to "all" or empty, otherwise update it
      if (
        value === "all" ||
        value === "" ||
        value === null ||
        value === undefined
      ) {
        searchParams.delete(filterKey);
      } else {
        searchParams.set(filterKey, value);
      }

      if (filterKey.endsWith("_id")) return;

      // If no params left, navigate without query string
      if (searchParams.toString() === "") {
        navigate(currentUrl.pathname, { replace: true });
      } else {
        navigate(`${currentUrl.pathname}?${searchParams.toString()}`, {
          replace: true,
        });
      }
    }
  };

  const removeFilter = (filterKey) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];

    if (onFiltersChange) {
      onFiltersChange(newFilters);
      tableInstance.setPageIndex(0);

      const currentUrl = new URL(window.location.href);
      const searchParams = new URLSearchParams(currentUrl.search);
      searchParams.delete(filterKey);

      // if no params left, navigate without query string
      if (searchParams.toString() === "") {
        navigate(currentUrl.pathname, { replace: true });
      } else {
        navigate(`${currentUrl.pathname}?${searchParams.toString()}`, {
          replace: true,
        });
      }
    }
  };

  const clearAllFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({});
      tableInstance.setPageIndex(0);

      // navigate to current path without any query params
      navigate(window.location.pathname, { replace: true });
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const currentPage = tableInstance.getState().pagination.pageIndex;
    const pageCount = tableInstance.getPageCount();
    const delta = 1; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (let i = 0; i < pageCount; i++) {
      if (
        i === 0 || // First page
        i === pageCount - 1 || // Last page
        (i >= currentPage - delta && i <= currentPage + delta) // Pages around current
      ) {
        range.push(i);
      }
    }

    let prev = -1;
    for (const i of range) {
      if (prev !== -1 && i - prev !== 1) {
        rangeWithDots.push("...");
      }
      rangeWithDots.push(i);
      prev = i;
    }

    return rangeWithDots;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="space-y-4">
      {/* Search and Filters Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start justify-between sm:items-center">
        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          {filterConfig.map((filter) => (
            <div key={filter.key} className="flex items-center gap-2">
              <label className="text-sm font-medium whitespace-nowrap">
                {filter.label}:
              </label>
              <Select
                value={filters[filter.key] || "all"}
                onValueChange={(value) => handleFilterChange(filter.key, value)}
              >
                <SelectTrigger className="max-w-[220px] h-8">
                  <SelectValue placeholder={`All ${filter.label}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All {filter.label}</SelectItem>
                  {filter.options.map((option) => (
                    <SelectItem
                      className="truncate"
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="h-8"
            >
              <Trash2 />
              Clear Filters
            </Button>
          )}
        </div>
        {/* Search Input */}
        {onSearch && (
          <div className="relative flex items-center w-sm max-w-md">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 pr-13"
            />
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            const filterConfigItem = filterConfig.find((f) => f.key === key);
            const option = filterConfigItem?.options?.find(
              (opt) => opt.value === value,
            );
            return (
              <Badge
                key={key}
                variant="secondary"
                className="cursor-pointer px-2 py-1"
                onClick={() => removeFilter(key)}
              >
                {filterConfigItem?.label}: {option?.label || value}
                <button
                  onClick={() => removeFilter(key)}
                  className="cursor-pointer ml-1 hover:text-destructive"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-primary">
            {tableInstance.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    className="text-white text-center"
                    key={header.id}
                    style={{
                      width: header.getSize(),
                      minWidth: header.column.columnDef.minSize,
                      maxWidth: header.column.columnDef.maxSize,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : tableInstance.getRowModel().rows?.length ? (
              tableInstance.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      className="text-center"
                      key={cell.id}
                      style={{
                        width: cell.column.getSize(),
                        minWidth: cell.column.columnDef.minSize,
                        maxWidth: cell.column.columnDef.maxSize,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={tableColumns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Selected rows info - only show if selection is enabled */}
      {/* {enableRowSelection && Object.keys(rowSelection || {}).length > 0 && (
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-md">
          <span className="text-sm text-blue-700">
            {Object.keys(rowSelection).length} row(s) selected
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRowSelectionChange?.({})}
            className="h-8 text-blue-700 hover:text-blue-800"
          >
            Clear selection
          </Button>
        </div>
      )} */}

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        {/* Page Info and Page Size */}
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">
            Page {tableInstance.getState().pagination.pageIndex + 1} of{" "}
            {tableInstance.getPageCount()}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={tableInstance.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                tableInstance.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-fit">
                <SelectValue
                  placeholder={tableInstance.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center space-x-1">
          {/* First Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.firstPage()}
            disabled={!tableInstance.getCanPreviousPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.previousPage()}
            disabled={!tableInstance.getCanPreviousPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page Numbers */}
          {pageNumbers.map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span
                key={`dots-${index}`}
                className="flex items-center justify-center h-8 w-8 text-sm text-muted-foreground"
              >
                ...
              </span>
            ) : (
              <Button
                key={pageNumber}
                variant={
                  tableInstance.getState().pagination.pageIndex === pageNumber
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => tableInstance.setPageIndex(pageNumber)}
                className="h-8 w-8 p-0"
              >
                {pageNumber + 1}
              </Button>
            ),
          )}

          {/* Next Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.nextPage()}
            disabled={!tableInstance.getCanNextPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => tableInstance.lastPage()}
            disabled={!tableInstance.getCanNextPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
