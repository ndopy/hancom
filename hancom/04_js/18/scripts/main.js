class Card {
  fruit; // 카드 문양
  #isFlipped = false; // 카드가 뒤집혔는지 상태
  #isMatched = false; // 카드가 매치되었는지 상태

  constructor(fruit) {
    this.fruit = fruit;
  }

  get isFlipped() {
    return this.#isFlipped;
  }

  get isMatched() {
    return this.#isMatched;
  }

  flip() {
    if (this.#isMatched) {
      // 이미 짝을 찾은 카드라면 뒤집지 않는다.
      return;
    }

    this.#isFlipped = !this.#isFlipped;
  }

  match() {
    this.#isMatched = true;
  }
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    // 무작위 정수 뽑기
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

// 카드 게임에 사용할 8쌍 이모지 생성 후 셔플하기
const emojis = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍉", "🥝", "🍑"];
const fruits = [...emojis, ...emojis];
const shuffledFruits = shuffle([...fruits]);

// 게임에 사용할 카드 생성하기
const cards = shuffledFruits.map((fruit) => new Card(fruit));

const $cardContainer = document.querySelector("#card-container");

function renderCards() {
  let $cards = document.createDocumentFragment();

  cards.forEach((card, idx) => {
    const $card = document.createElement("div");
    const $cardInner = document.createElement("div");
    const $cardFront = document.createElement("div");
    const $cardBack = document.createElement("div");

    $card.classList.add("card");
    $cardInner.classList.add("card-inner");
    $cardFront.classList.add("card-front");
    $cardBack.classList.add("card-back");

    $cardBack.textContent = card.fruit;
    $card.setAttribute("data-order", idx);

    $cardInner.appendChild($cardFront);
    $cardInner.appendChild($cardBack);
    $card.appendChild($cardInner);
    $cards.appendChild($card);
  });

  $cardContainer.appendChild($cards);
}

const $startButton = document.querySelector("#start");
const $startModal = document.querySelector("#start-modal");
const $winModal = document.querySelector("#win-modal");
const $confirmButton = document.querySelector("#confirm");
const $timer = document.querySelector("#timer");
const INTERVAL = 1;
let timerId = null;
let seconds = 0;

$startButton.addEventListener("click", () => {
  // 카드 렌더링
  renderCards();

  // 시작 모달 닫기
  $startModal.classList.add("hidden");

  // 타이머 시작
  startTimer();
});

$confirmButton.addEventListener("click", () => {
  // 게임 상태를 전부 초기화하기 위해 페이지를 새로고침해서 처음 화면으로 되돌아간다.
  location.reload();
});

function startTimer() {
  if (timerId) {
    clearInterval(timerId);
    return;
  }

  timerId = setInterval(() => {
    ++seconds;
    $timer.textContent = formatTime(seconds);
  }, INTERVAL * 1000);
}

const selectedCards = [];
let isLocked = false;

$cardContainer.addEventListener("click", (event) => {
  const target = event.target.closest(".card");

  if (!target) {
    return;
  }

  const targetCardIndex = target.getAttribute("data-order");

  if (!targetCardIndex) {
    return;
  }

  const targetCard = cards[targetCardIndex];

  if (isLocked) {
    return;
  }

  if (targetCard.isFlipped || targetCard.isMatched) {
    return;
  }

  targetCard.flip();
  target.classList.toggle("is-flipped", targetCard.isFlipped);

  selectedCards.push({
    card: targetCard,
    element: target,
  });

  if (selectedCards.length === 2) {
    isLocked = true;
    matchingCards(selectedCards);
  }
});

let counter = 0;
const $counter = document.querySelector("#counter");
const $message = document.querySelector("#message");

function matchingCards(selected) {
  // 시도 횟수 +1
  $counter.textContent = ++counter;

  const [card1, card2] = selected;

  if (card1.card.fruit !== card2.card.fruit) {
    setTimeout(() => {
      card1.card.flip();
      card2.card.flip();
      card1.element.classList.toggle("is-flipped", card1.card.isFlipped);
      card2.element.classList.toggle("is-flipped", card2.card.isFlipped);

      selectedCards.length = 0;
      isLocked = false;
    }, 500);
    return;
  }

  card1.card.match();
  card2.card.match();
  card1.element.classList.add("is-matched");
  card2.element.classList.add("is-matched");
  selectedCards.length = 0;
  isLocked = false;

  const isClear = cards.every((card) => card.isMatched === true);

  if (isClear) {
    clearInterval(timerId);
    $message.textContent = "승리하셨습니다!";
    $winModal.classList.remove("hidden");
    return;
  }
}

/**
 * 1분 = 60초, 60분 = 60*60 = 3,600초
 * @param {*} totalSeconds
 */
function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hours_str = hours.toString().padStart(2, "0");
  const minutes_str = minutes.toString().padStart(2, "0");
  const seconds_str = seconds.toString().padStart(2, "0");

  return `${hours_str}:${minutes_str}:${seconds_str}`;
}
