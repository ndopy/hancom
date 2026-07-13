import { useEffect, useRef } from "react";

function KakaoMap({ places, mapCenter, destinations, onAdd }) {
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef(null);
  const infowindowRef = useRef(null);
  const polylineRef = useRef(null);
  const destOverlaysRef = useRef([]);
  const arrowOverlaysRef = useRef([]);

  function getBearing(lat1, lng1, lat2, lng2) {
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const lat1Rad = lat1 * (Math.PI / 180);
    const lat2Rad = lat2 * (Math.PI / 180);
    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);
    return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360;
  }

  function getArrowChar(bearing) {
    const arrows = ["↑", "↗", "→", "↘", "↓", "↙", "←", "↖"];
    return arrows[Math.round(bearing / 45) % 8];
  }

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

  // 코스 마커(번호 오버레이) + 폴리라인
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // 기존 오버레이 제거
    destOverlaysRef.current.forEach((o) => o.setMap(null));
    destOverlaysRef.current = [];
    arrowOverlaysRef.current.forEach((o) => o.setMap(null));
    arrowOverlaysRef.current = [];

    // 기존 폴리라인 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (destinations.length === 0) return;

    // 번호 오버레이 생성
    destinations.forEach((d, index) => {
      const content = `<div style="width:28px;height:28px;background:#3b82f6;color:white;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:default;">${index + 1}</div>`;
      const overlay = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(d.mapy, d.mapx),
        content,
        yAnchor: 1,
      });
      overlay.setMap(mapInstanceRef.current);
      destOverlaysRef.current.push(overlay);
    });

    if (destinations.length < 2) return;

    // 화살표 오버레이 생성 (각 구간 중간 지점)
    for (let i = 0; i < destinations.length - 1; i++) {
      const d1 = destinations[i];
      const d2 = destinations[i + 1];
      const midLat = (parseFloat(d1.mapy) + parseFloat(d2.mapy)) / 2;
      const midLng = (parseFloat(d1.mapx) + parseFloat(d2.mapx)) / 2;
      const bearing = getBearing(parseFloat(d1.mapy), parseFloat(d1.mapx), parseFloat(d2.mapy), parseFloat(d2.mapx));
      const arrowChar = getArrowChar(bearing);
      const content = `<div style="pointer-events:none;width:22px;height:22px;background:#2563eb;border:2px solid white;border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:14px;box-shadow:0 1px 4px rgba(0,0,0,0.3);">${arrowChar}</div>`;
      const arrow = new window.kakao.maps.CustomOverlay({
        position: new window.kakao.maps.LatLng(midLat, midLng),
        content,
        yAnchor: 0.5,
        zIndex: 5,
      });
      arrow.setMap(mapInstanceRef.current);
      arrowOverlaysRef.current.push(arrow);
    }

    // 폴리라인 생성
    const path = destinations.map(
      (d) => new window.kakao.maps.LatLng(d.mapy, d.mapx)
    );
    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 3,
      strokeColor: "#3b82f6",
      strokeOpacity: 0.8,
      strokeStyle: "solid",
    });
    polyline.setMap(mapInstanceRef.current);
    polylineRef.current = polyline;
  }, [destinations]);

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
