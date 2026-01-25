import React, { FC } from "react";

const inputStyle = {
  padding: "8px",
  backgroundColor: "black",
  color: "lime",
  border: "1px solid lime",
  borderRadius: "6px",
};

const Buttons: FC = () => {
  return (
<<<<<<< HEAD
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "200px" }}>
      <input type="text" placeholder="Name Field" style={inputStyle} />
      <input type="text" placeholder="Match Number Field" style={inputStyle} />
      <input type="text" placeholder="Team Field" style={inputStyle} />
=======
    <div className="mx-auto">
      <h1>GreenBlitz Full-Stack Project:</h1>
      <div className="card">
        <button
          onClick={() => {
            setCount((prevCount) =>
              typeof prevCount === "number"
                ? prevCount >= maxCountingValue
                  ? importantMessage
                  : prevCount + countIncrement
                : prevCount + "!",
            );
          }}
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
>>>>>>> origin/master
    </div>
  );
};

const App: FC = () => {
  return <Buttons />;
};

export default App;
