import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [error, setError] = useState<string | null>(null);

  interface Duck {
    name: string;
    color: string;
    age: number;
  }

  function tryShowingSomething() {
    try {
      axios
        .get("http://localhost:4590/ducks")
        .then((res) => console.log(res.data));
    } catch (error) {
      console.log(error);
      console.log("Something went wrong");
    }
  }

  return (
    <>
      <button onClick={tryShowingSomething}>Try to recieve</button>
      {error && <div>{error}</div>}
    </>
  );
}

export default App;
