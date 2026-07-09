export default function Profile({ name = "하이트", job = "개발자" }) {
  return (
    <div>
      <h1>이름 : {name}</h1>
      <p>직업 : {job}</p>
    </div>
  );
}
