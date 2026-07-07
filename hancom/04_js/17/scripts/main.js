const API_URL = "http://localhost:3000/users";

const $out = document.querySelector("#out");
const $createBtn = document.querySelector("#btn-create");
const $readBtn = document.querySelector("#btn-read");
const $updateBtn = document.querySelector("#btn-update");
const $deleteBtn = document.querySelector("#btn-delete");

const show = (label, data) => {
  $out.textContent = `${label}\n${JSON.stringify(data)}`;
};

const norm = (data) =>
  Array.isArray(data)
    ? data.map(({ id, name }) => ({ id, name }))
    : { id: data.id, name: data.name };

$createBtn.addEventListener("click", async () => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "John" }),
  });

  const users = await response.json();

  show("CREATE 요청 결과 : ", norm(users));
});

$readBtn.addEventListener("click", async () => {
  const response = await fetch(API_URL);
  const users = await response.json();

  show("READ 요청 결과 : ", norm(users));
});

$updateBtn.addEventListener("click", async () => {
  const response = await fetch(`${API_URL}/1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Jane" }),
  });

  const users = await response.json();
  show("UPDATE 요청 결과 : ", norm(users));
});

$deleteBtn.addEventListener("click", async () => {
  const response = await fetch(`${API_URL}/1`, {
    method: "DELETE",
  });

  show("DELETE 요청 결과 : ", "1번 사용자 삭제됨");
});
