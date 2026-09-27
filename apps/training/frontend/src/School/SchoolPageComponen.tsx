import type { FC } from "react";
import { SchoolButton } from "./SchoolComponents/SchoolButton";
import { StudentButton } from "./SchoolComponents/StudentButton";
import axios from "axios";

async function addducktemp() {
  const response = await axios.post("http://localhost:3001/ducks", {
    name: "vorn",
    age: 12,
    color: "black",
  });

  console.log(response.data);
}
addducktemp;

const App: FC = () => {
  return (
    <>
      <SchoolButton />
      <StudentButton />
    </>
  );
};

export default App;
