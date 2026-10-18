import Duckpage from "./ducks/DuckpageComponent.tsx";
import axios from "axios";
import SchoolPage from "./School/SchoolPageComponen.tsx";
import TryAndCatchPage from "./tryAndCatch/TryAndCatchPage";
import { useState } from "react";
import { createContext } from "react";
import "./styling.css";
// Local development only: credentials in frontend code are visible to users.
axios.defaults.headers.common["x-api-password"] = "pass123";

//
// deleteDucktemp();

// async function changeDucktemp() {
//   const response = await axios.patch("http://localhost:4590/ducks/quickers", {
//     age: 19,
//   });
//   console.log(response.data);
// }
// changeDucktemp();

// async function filterDucksByColor() {
//   const response = await axios.get(
//     "http://localhost:4590/ducks/color?color=black",
//   );
//   console.log(response.data);
// }
// filterDucksByColor();

// async function filterDucksByAge() {
//   const response = await axios.get("http://localhost:4590/ducks/age?age=3");
//   console.log(response.data);
// }
// filterDucksByAge();

interface ThemeContextType {
  theme: "light" | "dark";
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const App = () => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const addducktemp = async () => {
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("http://localhost:4590/ducks", {
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

  const toggleMode = () => {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext value={{ theme, toggleMode }}>
      <div className="app" data-theme={theme}>
        <SchoolPage />
        <TryAndCatchPage />
        <button onClick={addducktemp} disabled={loading}>
          {loading ? "Loading..." : "Add duck"}
        </button>
        {message && <p role="status">{message}</p>}
        <Duckpage />
        <button onClick={toggleMode}>change theme</button>
      </div>
    </ThemeContext>
  );
};

export default App;
