import express from "express";

const app = express();
app.use(express.json());

// 실제 교실 배치 (왼쪽 3자리 + 오른쪽 3자리, null = 공석)
const rows = [
  [
    null,
    { name: "한윤지" },
    { name: "한유진" },
    { name: "김정아" },
    { name: "김정현" },
    null,
  ],
  [
    { name: "이도연" },
    { name: "강하영" },
    { name: "정유진" },
    { name: "김해냄" },
    { name: "정기준" },
    { name: "표후동" },
  ],
  [
    { name: "정선민" },
    { name: "양하은" },
    { name: "유민성" },
    null,
    { name: "전욱진" },
    { name: "이현우" },
  ],
  [
    null,
    { name: "박진" },
    { name: "김효인" },
    { name: "강성원" },
    { name: "임소정" },
    { name: "안치호" },
  ],
];

app.get("/", (req, res) => {
  const seatCell = (student) =>
    student
      ? `<td class="seat occupied">${student.name}</td>`
      : `<td class="seat empty"></td>`;

  const html = `
  <html>
  <head>
    <meta charset="utf-8">
    <title>교실 배치도</title>
    <style>
      body {
        background: #f0f4f8;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        font-family: sans-serif;
      }
      h1 { margin-bottom: 24px; color: #333; }
      .monitor {
        width: 100%;
        max-width: 600px;
        background: #1565c0;
        color: white;
        text-align: center;
        padding: 16px;
        border-radius: 8px;
        font-size: 18px;
        margin-bottom: 40px;
      }
      table { border-spacing: 12px; }
      .seat {
        width: 80px;
        height: 60px;
        text-align: center;
        vertical-align: middle;
        border-radius: 8px;
        font-size: 14px;
      }
      .occupied {
        background: white;
        border: 2px solid #90caf9;
        color: #333;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      }
      .empty {
        background: #e0e0e0;
        border: 2px dashed #bbb;
      }
      .aisle {
        width: 40px;
        background: transparent;
      }
      .teacher-desk {
        background: #ffe0b2;
        border: 2px solid #fb8c00;
        border-radius: 8px;
        text-align: center;
        vertical-align: middle;
        font-size: 13px;
        color: #e65100;
        font-weight: bold;
        padding: 8px;
      }
      .teacher-row td { height: 50px; }
    </style>
  </head>
  <body>
    <h1>교실 배치도</h1>
    <div class="monitor">모니터</div>
    <table>
      <tr class="teacher-row">
        <td colspan="3"></td>
        <td class="aisle"></td>
        <td colspan="3" class="teacher-desk">선생님</td>
      </tr>
      ${rows
        .map(
          (row) => `
        <tr>
          ${seatCell(row[0])}
          ${seatCell(row[1])}
          ${seatCell(row[2])}
          <td class="aisle"></td>
          ${seatCell(row[3])}
          ${seatCell(row[4])}
          ${seatCell(row[5])}
        </tr>
      `,
        )
        .join("")}
    </table>
  </body>
  </html>
  `;

  res.send(html);
});

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
