const STEPS = [
  { icon: "🔍", text: "검색어 창에 장소를 입력하고 '검색' 버튼을 누르세요." },
  { icon: "🗂️", text: "검색 결과 목록에서 장소 카드를 클릭하면 지도가 해당 위치로 이동합니다." },
  { icon: "📍", text: "지도의 마커를 클릭하면 인포윈도우가 열립니다. '+ 코스에 추가' 버튼을 눌러보세요." },
  { icon: "🗺️", text: "추가한 장소가 오른쪽 '내 여행 코스' 목록에 순서대로 쌓입니다." },
];

function TutorialModal({ onClose }) {
  return (
    <div className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 flex flex-col gap-6">
        <div className="text-center">
          <p className="text-3xl mb-2">🧭</p>
          <h2 className="text-xl font-bold text-gray-800">여행 플래너 사용법</h2>
          <p className="text-sm text-gray-400 mt-1">4단계로 나만의 여행 코스를 만들어보세요</p>
        </div>

        <ol className="flex flex-col gap-3">
          {STEPS.map((step, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold shrink-0 mt-0.5">
                {index + 1}
              </span>
              <div className="flex items-start gap-2">
                <span className="text-lg leading-tight">{step.icon}</span>
                <p className="text-sm text-gray-600 leading-relaxed">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <button
          onClick={onClose}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl text-sm"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}

export default TutorialModal;
