let empty;

const $bStr = document.getElementById("bStr");
const $bNum = document.getElementById("bNum");
const $bBool = document.getElementById("bBool");
const $bUndef = document.getElementById("bUndef");
const $bNull = document.getElementById("bNull");
const $bArr = document.getElementById("bArr");
const $bObj = document.getElementById("bObj");
const $out = document.getElementById("out");

const shouldStringify = (value) => typeof value === "object" && value !== null;

const showValueAndType = (value) => {
  const shown = shouldStringify(value) ? JSON.stringify(value) : value;
  $out.textContent = `${shown} (타입: ${typeof value})`;
};

$bStr.addEventListener("click", () => {
  showValueAndType("안녕");
});

$bNum.addEventListener("click", () => {
  showValueAndType(10);
});

$bBool.addEventListener("click", () => {
  showValueAndType(true);
});

$bUndef.addEventListener("click", () => {
  showValueAndType(empty);
});

$bNull.addEventListener("click", () => {
  showValueAndType(null);
});

$bArr.addEventListener("click", () => {
  showValueAndType([1, "Bob", 10]);
});

$bObj.addEventListener("click", () => {
  showValueAndType({ name: "Bob" });
});
