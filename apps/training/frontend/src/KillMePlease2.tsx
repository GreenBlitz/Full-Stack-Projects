import axios from "axios";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const student = {
      Name: "Alice",
      Grade: 10,
      school: "zib acadmy",
      IsZib: false,
    };

    void axios
      .post("http://localhost:4590/student", student)
      .then((response) => console.log(response.data))
      .catch((error) => console.error("Failed to send student", error));
  }, []);

  return <h1>just y?</h1>;
}

export default App;
