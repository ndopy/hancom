import { useEffect, useState } from "react";

export default function TimerContainer() {
  const [visible, setVisible] = useState(true);

  return (
    <div>
      <h1>Timer Container</h1>
      <button
        onClick={() => {
          setVisible(false);
        }}
      >
        타이머 가리기
      </button>
      {visible && <Timer />}
    </div>
  );
}

function Timer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return <p>현재 시간 : {time}</p>;
}
