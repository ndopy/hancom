import "./SubNav.css";

export default function SubNav({ category }) {
  const subCategories = category.children;

  return (
    <ul>
      {subCategories.map((subCategory, idx) => (
        <li key={subCategory.label}>
          <a href="#" data-idx={idx}>
            {subCategory.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
