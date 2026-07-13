import "./App.css";

import { useState, useEffect } from "react";

import SearchBar from "./components/SearchBar";
import KakaoMap from "./components/KakaoMap";
import TripCourse from "./components/TripCourse";
import SearchResult from "./components/SearchResult";
import SpotlightTutorial from "./components/SpotlightTutorial";
import Footer from "./components/Footer";

const TUTORIAL_KEY = "trip_planner_tutorial_seen";
const DESTINATIONS_KEY = "trip_planner_destinations";

function App() {
  const [places, setPlaces] = useState([]);
  const [destinations, setDestinations] = useState(
    () => JSON.parse(localStorage.getItem(DESTINATIONS_KEY) ?? "[]")
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showTutorial, setShowTutorial] = useState(
    () => !localStorage.getItem(TUTORIAL_KEY)
  );
  const [mapCenter, setMapCenter] = useState({
    mapx: 127.11942,
    mapy: 37.39473,
  });

  async function handleSearchClick(keyword) {
    setIsLoading(true);

    const API_ENDPOINT = `/tour/B551011/KorService2/searchKeyword2?serviceKey=gYxeW4UBcFMVnEbeclSlXiybRNht4DCVRd5g7YeF8ippmVNRo9bc1rwDyu%2Fz8OT7yVPSy0%2BrLZ3LtaDUsIHrvg%3D%3D&numOfRows=10&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json&arrange=A&keyword=${keyword}`;

    try {
      // API 호출
      const response = await fetch(API_ENDPOINT);

      if (!response.ok) {
        console.error("Tour API 호출에 실패했습니다.");
        return;
      }

      const data = await response.json();
      const result = data.response.body.items.item;

      setPlaces(result ?? []);
      setHasSearched(true);

      if (!result || result.length === 0) {
        return;
      }

      // 첫 번째 검색 결과로 지도를 이동시키기 위한 좌표 확인
      setMapCenter({
        mapx: result[0].mapx,
        mapy: result[0].mapy,
      });
    } catch (error) {
      console.error(`[에러] API 호출 중 에러 발생 : ${error}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddDestinationClick(place) {
    const newDestination = place.title;

    setDestinations((prev) => {
      if (prev.includes(newDestination)) {
        return [...prev];
      }

      return [...prev, newDestination];
    });
  }

  useEffect(() => {
    localStorage.setItem(DESTINATIONS_KEY, JSON.stringify(destinations));
  }, [destinations]);

  function handleClearDestinations() {
    setDestinations([]);
  }

  function handlePlaceCardClick({ mapx, mapy }) {
    setMapCenter({ mapx, mapy });
  }

  function handleTutorialClose() {
    localStorage.setItem(TUTORIAL_KEY, "true");
    setShowTutorial(false);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 relative">
      {showTutorial && <SpotlightTutorial onClose={handleTutorialClose} />}
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl px-8 py-6 flex flex-col items-center gap-3 shadow-lg">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-600 font-medium">
              장소를 검색하는 중...
            </p>
          </div>
        </div>
      )}
      <SearchBar onSearch={handleSearchClick} />
      <div className="flex flex-1 overflow-hidden gap-2 p-2">
        <KakaoMap
          places={places}
          mapCenter={mapCenter}
          onAdd={handleAddDestinationClick}
        />
        <div className="w-72 flex flex-col overflow-hidden bg-white rounded-xl shadow-lg">
          <SearchResult places={places} hasSearched={hasSearched} onCardClick={handlePlaceCardClick} />
          <TripCourse destinations={destinations} onClear={handleClearDestinations} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
