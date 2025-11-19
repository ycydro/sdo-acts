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
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

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
}) => {
  const [searchValue, setSearchValue] = useState("");

  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      pagination,
    },
    onPaginationChange,
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnResizing: true,
  });

  const handleSearch = (value) => {
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
      table.setPageIndex(0);
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
      table.setPageIndex(0);
    }
  };

  const removeFilter = (filterKey) => {
    const newFilters = { ...filters };
    delete newFilters[filterKey];
    if (onFiltersChange) {
      onFiltersChange(newFilters);
      table.setPageIndex(0);
    }
  };

  const clearAllFilters = () => {
    if (onFiltersChange) {
      onFiltersChange({});
      table.setPageIndex(0);
    }
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
    const currentPage = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();
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
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Search Input */}
        {onSearch && (
          <Input
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="max-w-sm"
          />
        )}

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
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {Object.entries(filters).map(([key, value]) => {
            const filterConfigItem = filterConfig.find((f) => f.key === key);
            const option = filterConfigItem?.options?.find(
              (opt) => opt.value === value
            );
            return (
              <Badge key={key} variant="secondary" className="px-2 py-1">
                {filterConfigItem?.label}: {option?.label || value}
                <button
                  onClick={() => removeFilter(key)}
                  className="ml-1 hover:text-destructive"
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
            {table.getHeaderGroups().map((headerGroup) => (
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
                          header.getContext()
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
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mr-2"></div>
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
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
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
        {/* Page Info and Page Size */}
        <div className="flex items-center space-x-4">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
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
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
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
                  table.getState().pagination.pageIndex === pageNumber
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => table.setPageIndex(pageNumber)}
                className="h-8 w-8 p-0"
              >
                {pageNumber + 1}
              </Button>
            )
          )}

          {/* Next Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last Page */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
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
