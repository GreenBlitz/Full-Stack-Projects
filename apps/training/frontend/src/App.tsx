//import Duckpage from "./ducks/DuckpageComponent.tsx";
import axios from "axios";
import SchoolPage from "./School/SchoolPageComponen.tsx";

async function addducktemp() {
  const response = await axios.post("http://localhost:3001/ducks", {
    name: "greg",
    age: 12,
    color: "black",
  });

  console.log(response.data);
}
addducktemp();

async function deleteDucktemp() {
  const response = await axios.delete("http://localhost:3001/ducks/3");
  console.log(response.data);
}
deleteDucktemp();

async function changeDucktemp() {
  const response = await axios.patch("http://localhost:3001/ducks/1", {
    name: "brovotzki",
  });
  console.log(response.data);
}
changeDucktemp();

const App = () => {
  return (
    <>
      <SchoolPage />
    </>
  );
};

export default App;
