import Avatar from "./Avatar";
import "./StudentList.css";

export default function StudentList({ students }) {
  const onlineStudents = students.filter((s) => s.isOnline);
  const offlineStudents = students.filter((s) => !s.isOnline);

  return (
    <div className="student-list">
      <section>
        <h2 className="section-title">🟢 온라인 ({onlineStudents.length})</h2>
        <div className="student-grid">
          {onlineStudents.map((s) => (
            <Avatar key={s.id} name={s.name} isOnline={s.isOnline} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="section-title">⚪ 오프라인 ({offlineStudents.length})</h2>
        <div className="student-grid">
          {offlineStudents.map((s) => (
            <Avatar key={s.id} name={s.name} isOnline={s.isOnline} />
          ))}
        </div>
      </section>
    </div>
  );
}
