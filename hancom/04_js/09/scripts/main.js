const IMG_URL_A = "https://picsum.photos/96?random=1";
const IMG_URL_B = "https://picsum.photos/96?random=2";

const $picture = document.querySelector("#picture");

$picture.setAttribute("src", IMG_URL_A);

const updateImgSrc = () => {
  const currentImgSrc = $picture.getAttribute("src");

  console.log($picture.getAttribute("src"));
  console.log($picture.src);

  const newImgSrc = currentImgSrc === IMG_URL_A ? IMG_URL_B : IMG_URL_A;
  $picture.setAttribute("src", newImgSrc);
};

$picture.addEventListener("click", updateImgSrc);
