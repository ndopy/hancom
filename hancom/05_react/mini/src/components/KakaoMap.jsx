import { useEffect, useRef } from "react";

function KakaoMap({ places, mapCenter, onAdd }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(null);
  const infowindowRef = useRef(null);

  function clearMarkers() {
    const markers = markersRef.current ?? [];

    markers.forEach((marker) => {
      marker.setMap(null);
    });
  }

  function renderMarkers() {
    clearMarkers();

    // 마커 생성
    const markers = places.map((place) => {
      const markerPosition = new window.kakao.maps.LatLng(
        place.mapy,
        place.mapx,
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정한다.
      });

      const container = document.createElement("div");
      container.style.cssText =
        "width:220px; padding:12px; font-family:sans-serif;";

      if (place.firstimage) {
        const image = document.createElement("img");
        image.src = place.firstimage;
        image.alt = `${place.title} 대표 이미지`;
        image.style.cssText =
          "width:100%; height:120px; object-fit:cover; border-radius:6px; margin-bottom:8px;";
        container.appendChild(image);
      }

      const title = document.createElement("div");
      title.textContent = place.title;
      title.style.cssText =
        "font-size:14px; font-weight:600; color:#1f2937; margin-bottom:4px;";
      container.appendChild(title);

      if (place.addr1) {
        const addr = document.createElement("div");
        addr.textContent = place.addr1;
        addr.style.cssText =
          "font-size:11px; color:#9ca3af; margin-bottom:10px;";
        container.appendChild(addr);
      }

      const button = document.createElement("button");
      button.textContent = "+ 코스에 추가";
      button.style.cssText =
        "width:100%; padding:6px; background:#3b82f6; color:white; border:none; border-radius:6px; font-size:12px; font-weight:500; cursor:pointer;";
      button.addEventListener("click", () => onAdd(place));
      container.appendChild(button);

      const infowindow = new window.kakao.maps.InfoWindow({
        content: container,
        removable: true,
      });

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (infowindowRef.current) {
          infowindowRef.current.close();
        }

        infowindowRef.current = infowindow;
        infowindow.open(mapInstanceRef.current, marker);
      });

      return marker;
    });

    markersRef.current = markers;

    // 마커를 지도 위에 표시
    markers.forEach((marker) => {
      marker.setMap(mapInstanceRef.current);
    });
  }

  // 지도 초기화
  useEffect(() => {
    const { mapx, mapy } = mapCenter;

    const options = {
      center: new window.kakao.maps.LatLng(mapy, mapx),
      level: 5,
    };

    const map = new window.kakao.maps.Map(containerRef.current, options);
    mapInstanceRef.current = map;
  }, []);

  // 마커 표시
  useEffect(() => {
    if (!mapInstanceRef.current) {
      return;
    }

    renderMarkers();
  }, [places]);

  // 지도 중앙 이동
  useEffect(() => {
    const { mapx, mapy } = mapCenter;
    const moveLatLon = new window.kakao.maps.LatLng(mapy, mapx);

    mapInstanceRef.current.setCenter(moveLatLon);
  }, [mapCenter]);

  return (
    <div
      id="map"
      data-tutorial="map"
      ref={containerRef}
      className="flex-1 h-full rounded-xl overflow-hidden"
    />
  );
}

export default KakaoMap;
