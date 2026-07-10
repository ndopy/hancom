import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("의존성 배열 생략");
  });

  useEffect(() => {
    console.log("의존성 배열에 빈 배열 할당");
  }, []);

  useEffect(() => {
    console.log("의존성 배열에 count 할당");
  }, [count]);

  return (
    <>
      <p>{count}</p>
      <button onClick={() => setCount((count) => count + 1)}>+</button>
      <br />
      <br />
      <input
        type="text"
        value={text}
        onChange={(event) => setText(event.target.value)}
      />
    </>
  );
}
