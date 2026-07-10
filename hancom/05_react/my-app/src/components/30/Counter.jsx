import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const handlePlusButtonClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  const handleMinusButtonClick = () => {
    setCount((prevCount) => prevCount - 1);
  };

  return (
    <>
      <button onClick={handlePlusButtonClick}>+1</button>
      <button onClick={handleMinusButtonClick}>-1</button>
      현재 카운트 수 : {count}
    </>
  );
}

export default Counter;
