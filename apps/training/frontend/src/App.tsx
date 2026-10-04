import { useEffect, useState } from "react";
import axios from "axios";

// בס"ד
function App() {
  const [student, setStudent] = useState("");

  function getSchool() {
    axios.get("http://localhost:3001/school").then((response) => {
      console.log(response.data);
    });
  }

  async function createStudent() {
    await axios.post("http://localhost:3001/school", student);
  }

  useEffect(() => getSchool(), []);

  return (
    <>
      <form>
        <input
          type="text"
          value={student}
          onChange={(e) => setStudent(e.target.value)}
        />
        <br />
        <button onClick={createStudent}>Add Student</button>
      </form>
    </>
  );
}
export default App;
