import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<string>("");

  interface Duck {
    name: string;
    color: string;
    age: number;
  }

  async function tryShowingSomething() {
    setLoading("Loading...");
    try {
      const res = await axios.get("http://localhost:4590/ducks");
      setMessage(res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setMessage(error.response?.data?.message ?? error.message);
      } else if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred");
      }
    } finally {
      setLoading("");
    }
  }

  return (
    <>
      <button onClick={tryShowingSomething}>Try to recieve</button>
      {message && <div>{message}</div>}
      {loading && <div>{loading}</div>}
    </>
  );
}

export default App;
