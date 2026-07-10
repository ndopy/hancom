import { useState } from "react";

import "./Nav.css";

import navData from "./navData";

export default function Nav() {
  const [activeIdx, setActiveIdx] = useState(null);

  const handleLinkClick = (event) => {
    event.preventDefault();

    const clickedLink = event.currentTarget;
    const targetDataIdx = clickedLink.getAttribute("data-idx");

    const idx = Number(targetDataIdx);
    setActiveIdx(idx);
  };

  return (
    <nav>
      <ul>
        {navData.map((data, idx) => (
          <li key={data.label}>
            <a href="#" data-idx={idx} onClick={handleLinkClick}>
              {data.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
