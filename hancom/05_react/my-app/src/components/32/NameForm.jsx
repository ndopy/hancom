import { useState } from "react";

const initialState = {
  name: "",
  nickname: "",
};

function NameForm() {
  const [form, setForm] = useState(initialState);
  const { name, nickname } = form;

  const handleChangeForm = (event) => {
    const { name: field, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      이름 :{" "}
      <input type="text" name="name" value={name} onChange={handleChangeForm} />
      <br />
      닉네임 :{" "}
      <input
        type="text"
        name="nickname"
        value={nickname}
        onChange={handleChangeForm}
      />
      <p>
        안녕, {name}! (별명은 {nickname})
      </p>
    </>
  );
}

export default NameForm;
