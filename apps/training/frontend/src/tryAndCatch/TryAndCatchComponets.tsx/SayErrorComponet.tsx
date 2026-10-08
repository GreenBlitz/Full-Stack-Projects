import { useState } from "react";
import axios from "axios";

export function SayErrorComponet() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const sayError = async () => {
    setLoading(true);
    try {
      await axios.get("http://localhost:3001/doNothing");
      setMessage("The request succeeded.");
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        setMessage(error.response?.data?.message ?? error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={sayError} disabled={loading}>
        {loading ? "Loading..." : "Say error"}
      </button>
      {loading && <p role="status">Loading...</p>}
      {message && <p role="status">{message}</p>}
    </div>
  );
}
