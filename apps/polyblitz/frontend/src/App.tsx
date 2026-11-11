// בס"ד
import { useState, type FC } from "react";
import axios from "axios";

// async function addUserTemp() {
//   const response = await axios.post("http://localhost:4590/api/Users/User", {
//     name: "polytetraflouroethalene",
//     password: "gtnh2911",
//   });

//   console.log(response.data);
// }
// //addUserTemp();
// async function addBetTemp() {
//   const response = await axios.post("http://localhost:4590/api/Bet/bets", {
//     title: "Will it gtnh the best mincraft?",
//     description: "Another sample bet for testing the API.",
//     closesAt: Date.now() + 24 * 60 * 60 * 1000,
//     optionOne: {
//       title: "Yes",
//       wagers: [{ userID: 2, amountWagered: 60 }],
//     },
//     optionTwo: {
//       title: "No",
//       wagers: [
//         { userID: 1, amountWagered: 10 },
//         { userID: 3, amountWagered: 5 },
//       ],
//     },
//     isPending: true,
//   });

//   console.log(response.data);
// }
// //addBetTemp();

// async function getUser(id: number) {
//   const response = await axios.get(
//     `http://localhost:4590/api/Users/User/${id}`,
//   );
//   return response.data;
// }

// async function getWagerUser(id: number) {
//   const response = await axios.get(
//     `http://localhost:4590/api/Users/User/${id}/wagers`,
//   );
//   return response.data;
// }

// async function getBets() {
//   const response = await axios.get("http://localhost:4590/api/Bet/bets");
//   return response.data;
// }

// async function getBet(id: number) {
//   const response = await axios.get(`http://localhost:4590/api/Bet/bets/${id}`);
//   return response.data;
// }

// async function getLeaderboard() {
//   const response = await axios.get(
//     "http://localhost:4590/api/LeaderBoard/leaderboard",
//   );
//   return response.data;
// }

const counterStartingValue = 0;
const countIncrement = 1;
const maxCountingValue = 5;
const importantMessage = "MI BOMBO";
const App: FC = () => {
  const [count, setCount] = useState<string | number>(counterStartingValue);

  return (
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
    </div>
  );
};

export default App;
