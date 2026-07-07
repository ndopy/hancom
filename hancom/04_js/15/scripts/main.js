const dogs = [];

class Dog {
  constructor(name) {
    this.name = name;
  }

  bark() {
    return `${this.name}: 멍멍!`;
  }
}

const $dogName = document.querySelector("#dogName");
const $adoptDogBtn = document.querySelector("#adoptDog");
const $message = document.querySelector("#message");
const $dogs = document.querySelector("#dogs");

const $barkBtn = document.querySelector("#bark");
const $output = document.querySelector("#output");

let message_timeout_id = null;
const MESSAGE_TIMEOUT_MS = 3 * 1000;

const clearMessage = () => {
  if (message_timeout_id) {
    clearTimeout(message_timeout_id);
  }

  message_timeout_id = setTimeout(() => {
    $message.textContent = "";
  }, MESSAGE_TIMEOUT_MS);
};

const adoptDog = () => {
  const dogName = $dogName.value;

  if (!dogName) {
    $message.textContent = "강아지 이름을 입력해 주세요!";
    clearMessage();
    return;
  }

  const newDog = new Dog(dogName);

  dogs.push(newDog);
  renderDogs();

  $dogName.value = "";
};

const renderDogs = () => {
  if (!dogs || dogs.length === 0) {
    $dogs.textContent = "아직 입양한 강아지가 없습니다.";
    return;
  }

  $dogs.textContent = `현재 강아지: ${dogs.map((dog) => dog.name).join(", ")}`;
};

$dogName.addEventListener("keydown", (event) => {
  if (!event.isComposing && event.key === "Enter") {
    adoptDog();
  }
});

$adoptDogBtn.addEventListener("click", adoptDog);

$barkBtn.addEventListener("click", () => {
  if (dogs.length === 0) {
    alert("강아지를 먼저 입양해주세요!");
    return;
  }

  $output.textContent = `${dogs.map((dog) => dog.bark()).join(", ")}`;
});

renderDogs();
