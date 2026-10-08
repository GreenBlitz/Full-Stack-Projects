//import Duckpage from "./ducks/DuckpageComponent.tsx";
import axios from "axios";
import SchoolPage from "./School/SchoolPageComponen.tsx";
import TryAndCatchPage from "./tryAndCatch/TryAndCatchPage";
import { useState } from "react";

// Local development only: credentials in frontend code are visible to users.
axios.defaults.headers.common["x-api-password"] = "pass123";

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
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const addducktemp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://localhost:3001/ducks", {
        name: "greg",
        age: 14,
        color: "black",
      });
      console.log(response.data);
      setMessage("Duck added.");
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        const status = error.response?.status;
        const detail = error.response?.data?.message ?? error.message;
        setMessage(status ? `HTTP ${status}: ${detail}` : detail);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SchoolPage />
      <TryAndCatchPage />
      <button onClick={addducktemp} disabled={loading}>
        {loading ? "Loading..." : "Add duck"}
      </button>
      {message && <p role="status">{message}</p>}
    </>
  );
};

export default App;
