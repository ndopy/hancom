import { useState, useEffect } from "react";

function Weather() {
  const [temp, setTemp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const API_END_POINT =
      "https://api.open-meteo.com/v1/forecast?latitude=37.5&longitude=127&current_weather=true";

    fetch(API_END_POINT)
      .then((response) => response.json())
      .then((data) => {
        setTemp(data.current_weather.temperature);
      })
      .catch((error) => {
        console.error(`기온 로딩 실패 : `, error);
      })
      .finally(() => setIsLoading(false));
  });

  return (
    <p>
      서울 기온 :{" "}
      {isLoading ? "불러오는 중..." : temp ? `${temp}°C` : "불러올 수 없음"}
    </p>
  );
}

export default Weather;
