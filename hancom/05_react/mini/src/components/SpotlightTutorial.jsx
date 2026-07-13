import { useState, useEffect } from "react";

const STEPS = [
  {
    selector: "[data-tutorial='search']",
    description: "검색어를 입력하고 '검색' 버튼을 누르세요.",
  },
  {
    selector: "[data-tutorial='search-result']",
    description: "검색 결과 카드를 클릭하면 지도가 해당 위치로 이동합니다.",
  },
  {
    selector: "[data-tutorial='map']",
    description: "마커를 클릭하면 인포윈도우가 열립니다. '+ 코스에 추가' 버튼을 눌러보세요.",
    tooltipPosition: "center",
  },
  {
    selector: "[data-tutorial='trip-course']",
    description: "추가한 장소가 '내 여행 코스' 목록에 순서대로 쌓입니다.",
  },
];

const PADDING = 8;
const TOOLTIP_WIDTH = 280;

function SpotlightTutorial({ onClose }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);

  useEffect(() => {
    const el = document.querySelector(STEPS[step].selector);
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [step]);

  if (!rect) return null;

  const spotlight = {
    left: rect.left - PADDING,
    top: rect.top - PADDING,
    width: rect.width + PADDING * 2,
    height: rect.height + PADDING * 2,
  };

  const centerX = spotlight.left + spotlight.width / 2;
  const centerY = spotlight.top + spotlight.height / 2;
  const { tooltipPosition } = STEPS[step];

  const tooltipLeft = Math.max(
    8,
    Math.min(centerX - TOOLTIP_WIDTH / 2, window.innerWidth - TOOLTIP_WIDTH - 8)
  );

  let tooltipTop;
  if (tooltipPosition === "center") {
    tooltipTop = centerY - 70;
  } else {
    const spaceBelow = window.innerHeight - (spotlight.top + spotlight.height);
    const spaceAbove = spotlight.top;
    if (spaceBelow >= 140) {
      tooltipTop = spotlight.top + spotlight.height + 12;
    } else if (spaceAbove >= 140) {
      tooltipTop = spotlight.top - 140 - 12;
    } else {
      tooltipTop = spotlight.top + spotlight.height - 152;
    }
  }

  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50" style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "fixed",
          left: spotlight.left,
          top: spotlight.top,
          width: spotlight.width,
          height: spotlight.height,
          boxShadow: "0 0 0 9999px rgba(0,0,0,0.65)",
          borderRadius: "12px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          left: tooltipLeft,
          top: tooltipTop,
          width: TOOLTIP_WIDTH,
          pointerEvents: "auto",
        }}
        className="bg-white rounded-xl shadow-2xl p-4 flex flex-col gap-3"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-500">
            {step + 1} / {STEPS.length}
          </span>
          <div className="flex gap-1">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === step ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed">
          {STEPS[step].description}
        </p>

        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex-1 py-2 text-sm text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              이전
            </button>
          )}
          <button
            onClick={isLast ? onClose : () => setStep((s) => s + 1)}
            className="flex-1 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            {isLast ? "시작하기" : "다음"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpotlightTutorial;
