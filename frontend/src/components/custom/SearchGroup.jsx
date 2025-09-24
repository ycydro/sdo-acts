import React, { useState } from "react";
import {
  Search,
  Filter,
  SortAsc,
  X,
  Users,
  MapPin,
  Calendar,
} from "lucide-react";

const SearchGroup = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const filterOptions = [
    { id: "location", label: "Location", icon: MapPin },
    { id: "date", label: "Date Created", icon: Calendar },
    { id: "members", label: "Member Count", icon: Users },
  ];

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "members", label: "Most Members" },
  ];

  const toggleFilter = (filterId) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const clearAllFilters = () => {
    setSelectedFilters([]);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
      {/* Main Search Bar */}
      <div className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Filter Button */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
              isFilterOpen || selectedFilters.length > 0
                ? "bg-blue-50 border-blue-200 text-blue-700"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filters
            {selectedFilters.length > 0 && (
              <span className="ml-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                {selectedFilters.length}
              </span>
            )}
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Filters</h3>
                  {selectedFilters.length > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {filterOptions.map((filter) => {
                    const IconComponent = filter.icon;
                    return (
                      <label
                        key={filter.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters.includes(filter.id)}
                          onChange={() => toggleFilter(filter.id)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <IconComponent className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-700">
                          {filter.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <SortAsc className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Active Filters Display */}
        {selectedFilters.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedFilters.map((filterId) => {
              const filter = filterOptions.find((f) => f.id === filterId);
              return (
                <span
                  key={filterId}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                >
                  {filter.label}
                  <button
                    onClick={() => toggleFilter(filterId)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Search Results Preview */}
      {searchQuery && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Search className="h-4 w-4" />
            Searching for:{" "}
            <span className="font-medium text-gray-900">"{searchQuery}"</span>
          </div>
          {selectedFilters.length > 0 && (
            <div className="text-sm text-gray-600">
              With filters:{" "}
              {selectedFilters
                .map((id) => filterOptions.find((f) => f.id === id)?.label)
                .join(", ")}
            </div>
          )}
          <div className="text-sm text-gray-600 mt-1">
            Sorted by: {sortOptions.find((s) => s.value === sortBy)?.label}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchGroup;
