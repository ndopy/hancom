function Rating({ score }) {
  return (
    <div>
      {[...Array(score).fill("⭐️"), ...Array(5 - score).fill("✩")].map(
        (star, idx) => (
          <span key={idx}>{star}</span>
        ),
      )}
    </div>
  );
}

export default Rating;
