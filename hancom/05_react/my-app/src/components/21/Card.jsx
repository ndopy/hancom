import "./Card.css";

export default function Card({ title, desc, emoji }) {
  return (
    <div className="card">
      <span className="emoji">{emoji}</span>
      <h3 className="title">{title}</h3>
      <p className="desc">{desc}</p>
    </div>
  );
}
