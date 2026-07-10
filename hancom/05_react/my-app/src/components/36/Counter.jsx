import { useEffect, useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("count 바뀜 : ", count);
  }, [count]);

  return (
    <>
      <button onClick={() => setCount((count) => count + 1)}>+1</button>
      <p>현재 카운트 : {count}</p>
    </>
  );
}
