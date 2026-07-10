const navData = [
  {
    label: "아우터",
    children: [
      { label: "후드/맨투맨" },
      { label: "자켓" },
      {
        label: "코트",
        children: [{ label: "체스터 코트" }, { label: "더플 코트" }, { label: "롱 코트" }],
      },
      { label: "패딩" },
    ],
  },
  {
    label: "상의",
    children: [
      {
        label: "반소매 티셔츠",
        children: [{ label: "그래픽 티셔츠" }, { label: "무지 티셔츠" }, { label: "카라 티셔츠" }],
      },
      {
        label: "니트/스웨터",
        children: [{ label: "라운드 니트" }, { label: "브이넥 니트" }, { label: "가디건" }],
      },
      { label: "셔츠/블라우스" },
    ],
  },
  {
    label: "바지",
    children: [
      { label: "데님 팬츠" },
      { label: "트레이닝/조거 팬츠" },
      { label: "슈트 팬츠/슬랙스" },
    ],
  },
  {
    label: "신발",
    children: [{ label: "스니커즈" }, { label: "로퍼" }, { label: "부츠" }],
  },
  {
    label: "액세서리",
    children: [{ label: "모자" }, { label: "가방" }, { label: "지갑" }],
  },
];

export default navData;
