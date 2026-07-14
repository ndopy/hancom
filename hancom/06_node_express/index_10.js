import express from "express";

const app = express();
app.use(express.json());

const ORIGINAL_STUDENTS = [
  "강성원",
  "강하영",
  "김정아",
  "김정현",
  "김해냄",
  "김효인",
  "박진",
  "안치호",
  "양하은",
  "유민성",
  "이도연",
  "이현우",
  "임소정",
  "전욱진",
  "정기준",
  "정선민",
  "정유진",
  "표후동",
  "한유진",
  "한윤지",
];
const API_ENDPOINT = "http://192.168.10.28:5000/hancom/표후동/users";
const AUTH_TOKEN = "HANCOM";

// 외부에 저장되어 있는 학생 목록 확인하기
async function getStudents() {
  const response = await fetch(API_ENDPOINT, {
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  return data;
}

async function deleteStudent(id) {
  const response = await fetch(`${API_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  console.log(data);
}

async function postStudent(newStudent) {
  const response = await fetch(`${API_ENDPOINT}`, {
    method: "POST",
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newStudent),
  });

  const data = await response.json();
  console.log(data);
}

async function updateStudent(id, student) {
  const response = await fetch(`${API_ENDPOINT}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: AUTH_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(student),
  });

  const data = await response.json();
  console.log(data);
}

function getFakeStudents(students) {
  // 원래 명단에 없는 가짜 학생들
  const fakeStudents = students.filter(
    (student) => !ORIGINAL_STUDENTS.includes(student.name),
  );
  // console.log(`fakeStudents`, fakeStudents);

  return fakeStudents;
}

function getRealStudentNames(students) {
  // 원래 명단에 있는 진짜 학생들
  const realStudents = students.filter((student) =>
    ORIGINAL_STUDENTS.includes(student.name),
  );

  const realStudentNames = realStudents.map((student) => student.name);
  // console.log(`realStudentNames`, realStudentNames);
  return realStudentNames;
}

function getMissingStudentNames() {
  const missingStudentNames = ORIGINAL_STUDENTS.filter(
    (name) => !realStudentNames.includes(name),
  );
  // console.log(`missingStudents`, missingStudents);

  return missingStudentNames;
}

// ----------------- 학생 명단 수정 -------------------

const students = await getStudents();

// 가짜 학생들을 DELETE 처리한다.
// const deleteResults = await Promise.all(
//   fakeStudents.map((student) => deleteStudent(student.id)),
// );

const sortedStudents = students.sort((a, b) =>
  a.name.localeCompare(b.name, "ko"),
);

console.log(sortedStudents);

// const updateResults = await Promise.all(
//   sortedStudents.map(({ id, name }, idx) =>
//     updateStudent(id, { id: idx + 1, name }),
//   ),
// );

// 피셔 예이츠 셔플 알고리즘
function fisherYatesShuffle(array) {
  const result = [...array];

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

app.get("/", (req, res) => {
  // 배치도를 그리기 위한 좌석 나누기

  const seats = [...sortedStudents, null, null, null, null];
  const shuffledSeats = fisherYatesShuffle(seats);

  const rows = [];

  for (let i = 0; i < seats.length; i += 6) {
    rows.push(shuffledSeats.slice(i, i + 6));
  }

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
      .blackboard {
        width: 100%;
        max-width: 600px;
        background: #2d6a4f;
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
    <div class="blackboard" style="background:#1565c0;">모니터</div>
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

app.listen(3000, () => {
  console.log("http://localhost:3000");
});
