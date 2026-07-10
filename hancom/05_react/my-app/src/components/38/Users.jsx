import { useEffect, useState } from "react";

function Users() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);

  function fetchUsers() {
    setIsLoading(true);

    const API_END_POINT = "https://jsonplaceholder.typicode.com/users";

    fetch(API_END_POINT)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .then(() => setIsLoading(false))
      .catch((error) => console.error("[에러] 데이터 로딩 실패 : ", error));
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ul>
      {isLoading ? (
        <span>데이터를 불러오는 중...</span>
      ) : (
        users.map((user) => (
          <li key={user.id}>
            {user.name} / {user.company.name}
          </li>
        ))
      )}
    </ul>
  );
}

export default Users;
