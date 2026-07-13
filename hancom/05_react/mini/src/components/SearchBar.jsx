import { useState } from "react";

function SearchBar({ onSearch, isLoading }) {
  const [keyword, setKeyword] = useState("");

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  function handleSearch() {
    if (!keyword.trim() || isLoading) return;
    onSearch(keyword);
  }

  return (
    <div data-tutorial="search" className="flex items-center gap-3 px-6 py-4 bg-white shadow-sm">
      <h1 className="text-lg font-bold text-blue-600 whitespace-nowrap">여행 플래너</h1>
      <div className="flex flex-1 max-w-xl gap-2">
        <input
          type="text"
          name="keyword"
          id="keyword"
          placeholder="장소를 검색하세요"
          value={keyword}
          onChange={handleKeywordChange}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={handleSearch}
          disabled={!keyword.trim() || isLoading}
          className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          검색
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
