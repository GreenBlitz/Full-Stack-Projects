// בס"ד
import { useEffect, useState, type FC } from "react";

const counterStartingValue = 0;
const countIncrement = 1;
const maxCountingValue = 5;
const App: FC = () => {
  const [count, setCount] = useState<string | number>(counterStartingValue);

  useEffect(() => {
    fetch("/api/v1/tba/matches", {
      method: "POST",
      body: JSON.stringify({ event: "2025iscmp" }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(async (value) => value.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error: unknown) => {
        console.error(error);
      });
  }, []);
  return (
    <div className="mx-auto">
      <h1>GreenBlitz Full-Stack Project:</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((prevCount) =>
              typeof prevCount === "number"
                ? prevCount >= maxCountingValue
                  ? "MI BOMBO"
                  : prevCount + countIncrement
                : prevCount + "!"
            );
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
    </div>
  );
};

export default App;
