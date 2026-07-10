import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);

  const handleButtonClick = () => {
    setLikes((prevLikes) => prevLikes + 1);
  };

  return (
    <>
      <p>알림 {likes}</p>
      <p>좋아요 {likes}</p>
      <button onClick={handleButtonClick}>👍 {likes}</button>
    </>
  );
}
