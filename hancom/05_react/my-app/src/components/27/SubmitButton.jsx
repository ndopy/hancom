import { Button } from "@mui/material";

function SubmitButton() {
  return (
    <Button variant="contained" onClick={() => alert("안녕!")}>
      제출
    </Button>
  );
}

export default SubmitButton;
