import { useEffect, useState } from "react";
import axios from "axios";

type School = {
  name: string;
  city: string;
  students: string[];
};

function App() {
  const [student, setStudent] = useState("");
  const [school, setSchool] = useState("");
  const [realStudent, setRealStudent] = useState("");

  function getSchool(e: any) {
    e.preventDefault();
    axios.get("http://localhost:3001/school").then((response) => {
      setSchool(JSON.stringify(response.data));
    });
  }

  function createStudent(e: any) {
    e.preventDefault();
    axios
      .post("http://localhost:3001/students", { name: student })
      .then((response) => {
        setRealStudent(JSON.stringify(response.data.student.name));
      });
  }

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
        <div>{realStudent}</div>
        <br />
        <br />
        <button onClick={getSchool}>Get School</button>
        <div>{school}</div>
      </form>
    </>
  );
}

export default App;
