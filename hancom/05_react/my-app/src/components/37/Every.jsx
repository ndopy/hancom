import { useEffect, useState } from "react";

function Every() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // setCount(c => c + 1);
    console.log("렌더링 될 때마다 실행");
  });

  return (
    <>
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
      <p>현재 카운트 : {count}</p>
    </>
  );
}

export default Every;
