import "./Avatar.css";

export default function Avatar({ name, isOnline }) {
  return (
    <div className={`avatar-container ${isOnline ? "online" : "offline"}`}>
      <p className="avatar">
        <span className="student-name">🧑🏻‍💻 {name}</span>
        <span className={`dot ${isOnline ? "dot-online" : "dot-offline"}`}>
          ●
        </span>
      </p>
    </div>
  );
}
