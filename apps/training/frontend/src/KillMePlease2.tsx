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

  return (
    <>
      <div
        style={{
          color: "#25d7f6",
          border: "100px solid #7ec3343b",
          borderRadius: "1px",
          padding: "20px",
          marginBottom: "16px",
        }}
      >
        <h1>just y?</h1>
      </div>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-gray-800 p-8 rounded-2xl shadow-xl max-w-sm w-full text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Hello, Tailwind!
          </h1>

          <p className="text-gray-400 mb-6">
            This is a React component styled with Tailwind CSS.
          </p>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition">
            Click Me
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
