import { useEffect, useState } from "react";
import axios from "axios";

// בס"ד
function App() {
  async function createStudent(studentName: string) {
    await axios.post("http://localhost:3001/students", studentName);
    console.log(studentName);
  }

  return (
    <>
      <button onClick={() => createStudent("Ido")}>Add Student</button>
    </>
  );
}

export default App;
