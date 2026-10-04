// בס"ד

import { useEffect, type FC } from "react";
import axios from "axios";

async function getSchool() {
  const response = await axios.get("http://localhost:3001/school");

  console.log(response.data);
}

async function createStudent() {
  const student = {
    name: "Lior",
    grade: "12 grade",
  };
  const response = await axios.post("http://localhost:3001/student", student);
  console.log("Success: ", response.data);
}

const App: FC = () => {
  useEffect(() => {
    console.log(
      "=====================\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n===================",
    );
    createStudent();
  }, []);
  return null;
};

export default App;
