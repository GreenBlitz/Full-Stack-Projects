// בס"ד
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import axios from "axios";
import App from "./KillMePlease2";

const loadStudentData = async () => {
  try {
    await axios.post("http://localhost:4590/student", {});
    const response = await axios.get("http://localhost:4590/student");
    console.log(response.data);
  } catch (error) {
    console.error("Failed to load student data:", error);
  }
};

void loadStudentData();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
