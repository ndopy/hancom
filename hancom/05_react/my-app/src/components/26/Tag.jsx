function Tag({ tags }) {
  return (
    <div>
      {tags.map((tag) => (
        <span key={tag}>{`#${tag}`} </span>
      ))}
    </div>
  );
}

export default Tag;
