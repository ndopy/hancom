import { useState } from "react";

function SearchBar({ onSearch }) {
  const [keyword, setKeyword] = useState("");

  function handleKeywordChange(event) {
    setKeyword(event.target.value);
  }

  return (
    <div className="flex items-center gap-3 px-6 py-4 bg-white shadow-sm">
      <h1 className="text-lg font-bold text-blue-600 whitespace-nowrap">여행 플래너</h1>
      <div className="flex flex-1 max-w-xl gap-2">
        <input
          type="text"
          name="keyword"
          id="keyword"
          placeholder="장소를 검색하세요"
          value={keyword}
          onChange={handleKeywordChange}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-400"
        />
        <button
          onClick={() => onSearch(keyword)}
          className="px-5 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
        >
          검색
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
