//import Duckpage from "./ducks/DuckpageComponent.tsx";
import axios from "axios";
import SchoolPage from "./School/SchoolPageComponen.tsx";

// Local development only: credentials in frontend code are visible to users.
axios.defaults.headers.common["x-api-password"] = "pass123";

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

async function filterDucksByColor() {
  const response = await axios.get(
    "http://localhost:3001/ducks/color?color=black",
  );
  console.log(response.data);
}
filterDucksByColor();

async function filterDucksByAge() {
  const response = await axios.get("http://localhost:3001/ducks/age?age=3");
  console.log(response.data);
}
filterDucksByAge();

const App = () => {
  return (
    <>
      <SchoolPage />
    </>
  );
};

export default App;
