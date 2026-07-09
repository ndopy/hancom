import "./Badge.css";

function Badge({ text, type }) {
  const color = type === "new" ? "green" : "crimson";
  const fontSize = type === "new" ? "24px" : "16px";

  return (
    <span className="badge" style={{ backgroundColor: color, fontSize }}>
      {text}
    </span>
  );
}

export default Badge;
