function SearchResult({ places, onCardClick }) {
  return (
    <div
      className="flex flex-col overflow-hidden bg-gray-50"
      style={{ maxHeight: "50%" }}
    >
      <div className="px-5 py-4 border-b border-blue-100 bg-blue-50 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-lg">🔍</span>
          <h2 className="text-base font-bold text-blue-700">검색 결과</h2>
        </div>
        <p className="text-xs text-blue-400 mt-0.5">{places.length}개 장소</p>
      </div>
      <ul className="overflow-y-auto p-3 flex flex-col gap-2">
        {places.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-gray-400">
            장소를 검색해보세요
          </li>
        ) : (
          places.map((place) => (
            <li
              key={place.contentid}
              className="bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 cursor-pointer"
              onClick={() =>
                onCardClick({ mapx: place.mapx, mapy: place.mapy })
              }
            >
              <p className="text-sm font-medium text-gray-800">{place.title}</p>
              {place.addr1 && (
                <p className="text-xs text-gray-400 mt-0.5 truncate">
                  {place.addr1}
                </p>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default SearchResult;
