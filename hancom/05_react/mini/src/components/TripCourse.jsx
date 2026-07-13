function TripCourse({ destinations, onClear, onRemove, onSelect }) {
  return (
    <div data-tutorial="trip-course" className="flex flex-col flex-1 overflow-hidden border-t-4 border-blue-500">
      <div className="px-5 py-4 border-b border-blue-100 bg-blue-50">
        <div className="flex items-center gap-2">
          <span className="text-blue-500 text-lg">🗺️</span>
          <h2 className="text-base font-bold text-blue-700">내 여행 코스</h2>
          {destinations.length > 0 && (
            <button
              onClick={onClear}
              className="ml-auto text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 rounded px-2 py-0.5"
            >
              초기화
            </button>
          )}
        </div>
        <p className="text-xs text-blue-400 mt-0.5">{destinations.length}개 장소</p>
      </div>
      <ul className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {destinations.length === 0 ? (
          <li className="px-5 py-8 text-center text-sm text-gray-400">
            마커를 클릭해서 장소를 추가해보세요
          </li>
        ) : (
          destinations.map((destination, index) => (
            <li key={destination.title} className="flex items-center gap-3 px-5 py-3 group cursor-pointer hover:bg-blue-50" onClick={() => onSelect(destination)}>
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium shrink-0">
                {index + 1}
              </span>
              <span className="text-sm text-gray-700 flex-1">{destination.title}</span>
              <button
                onClick={() => onRemove(index)}
                className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-base leading-none"
              >
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default TripCourse;
