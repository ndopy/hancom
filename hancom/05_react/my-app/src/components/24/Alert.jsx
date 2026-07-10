function Alert({ type, text }) {
  const map = {
    success: { icon: "✅", color: "green" },
    error: { icon: "❌", color: "crimson" },
    warning: { icon: "⚠️", color: "orange" },
  };

  const cfg = map[type];

  return (
    <p style={{ color: cfg.color }}>
      {cfg.icon} {text}
    </p>
  );
}

export default Alert;
