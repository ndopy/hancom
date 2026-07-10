import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  const handleButtonClick = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return <button onClick={handleButtonClick}>{count}번 눌렀어요.</button>;
}

export default Counter;
