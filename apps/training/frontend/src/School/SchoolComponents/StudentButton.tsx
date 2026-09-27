import axios from "axios";
import { useState } from "react";

type Student = {
  name: string;
  grade: number;
};

async function createStudent(student: Student) {
  const response = await axios.post("http://localhost:3001/students", student);
  console.log(response.data);
  return response.data;
}

export function StudentButton() {
  const [studentData, setStudentData] = useState<string>("");
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const student: Student = {
      name: String(formData.get("name")),
      grade: Number(formData.get("grade")),
    };
    const data = await createStudent(student);
    setStudentData(JSON.stringify(data));
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="enter student name" />
        <input name="grade" placeholder="enter grade" />
        <button type="submit">add student</button>
      </form>
      {studentData && <p>{studentData}</p>}
    </>
  );
}
