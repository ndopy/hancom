function Footer() {
  return (
    <footer className="shrink-0 bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between text-xs text-gray-400">
      <span>© 2026 여행 플래너</span>
      <div className="flex items-center gap-4">
        <span>지도 데이터 · <strong className="text-gray-500">Kakao Maps API</strong></span>
        <span>관광 정보 · <strong className="text-gray-500">한국관광공사_국문 관광정보 서비스_GW</strong></span>
      </div>
    </footer>
  );
}

export default Footer;
