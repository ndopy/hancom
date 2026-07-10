import styles from "./ProductItem.module.css";

import { useState } from "react";

export default function ProductItem({ name }) {
  const [count, setCount] = useState(0);

  return (
    <div className={styles.productContainer}>
      <div className={styles.product}>
        <h3>{name}</h3>
        <p>{count}개 담음</p>
        <button
          className={styles.addButton}
          onClick={() => setCount((prev) => prev + 1)}
        >
          🛒 담기
        </button>
      </div>
    </div>
  );
}
