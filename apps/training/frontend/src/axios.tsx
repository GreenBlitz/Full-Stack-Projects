import axios from "axios";
import { useState } from "react";
type School1 = {
  name: string;
  city: string;
  students: string[];
};
export function App() {
  const [School, setSchool] = useState<School1 | null>(null);

  async function getSchool() {
    const response = await axios.get("http://localhost:3000/school");
    setSchool(response.data);
  }

  async function creatStudent() {
    const response = await axios.post("http://localhost:3000/students ", {
      message: "student received!",
      student: {
        name: "Alice",
        grade: 10,
      },
    });
    console.log(response.data);
  }

  return (
    <>
      <button type="button" onClick={getSchool}>
        Get school
      </button>
      {School && (
        <div>
          <h2>{School.name}</h2>
          <p>City: {School.city}</p>
          <h3>Students:</h3>
          <ul>
            {School.students.map((student, index) => (
              <li key={index}>{student}</li>
            ))}
          </ul>
        </div>
      )}
      <button type="button" onClick={creatStudent}>
        Create student
      </button>
    </>
  );
}
