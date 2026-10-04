// בס"ד

import { useEffect, useState, type FC } from "react";
import axios from "axios";
import { SchoolData } from "./components/SchoolData";
import { Student } from "./components/Student";

async function getSchool() {
  const response = await axios.get("http://localhost:3001/school");

  return response;
}

async function createStudent() {
  const student = {
    name: "Lior",
    grade: "12 grade",
  };
  const response = await axios.post("http://localhost:3001/student", student);
  return response;
}

const SchoolExercise: FC = () => {
  const [school, setSchool] = useState("");
  const [student, setStudent] = useState("");

  return (
    <>
      <button
        onClick={() => getSchool().then((response) => setSchool(response.data))}
      >
        Get School info
      </button>
      <button
        onClick={() =>
          createStudent().then((response) => setStudent(response.data))
        }
      >
        Create student
      </button>
      <br />
      <div>{school ? JSON.stringify(school) : ""}/</div>
      <div>{student ? JSON.stringify(student) : ""}/</div>
    </>
  );
};

export default SchoolExercise;
