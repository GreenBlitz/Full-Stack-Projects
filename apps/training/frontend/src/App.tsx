// בס"ד
import { useEffect, useState, type FC } from "react";
import axios from "axios";
import type { Duck } from "./DuckCard";
const [name, setName] = useState("");
const [color, setColor] = useState("");
const [age, setAge] = useState<number>(0);
async function addDuck() {
  const newDuck = {
    name: name,
    color: color,
    age: age,
  };

  const response = await axios.post(
    "http://localhost:3000/ducks",
    newDuck
  );

  console.log(response.data);
}
const response = await axios.delete(`http://localhost:3000/ducks/${name}`);
console.log(response.data);
const App: FC = () => {
  const [ducks2, setducks] = useState<Duck[]>([]);

  useEffect(() => {
    async function getDucks() {
      const response = await axios.get<Duck[]>("http://localhost:3000/ducks");
      setducks(response.data);
    }

    void getDucks();
  }, []);

  return (
    <div>
      <h1>My Ducks</h1>

      {ducks2.map((duck, index) => (
        <p key={index}>
          {duck.name} {duck.color} {duck.age}
        </p>
      ))}
    </div>
  );
};
App.
export default App;

// const App: FC = () => {
//   const [ducks2, setducks] = useState<Duck[]>(() => {
//     const savedDucks = localStorage.getItem("ducks");

//     if (savedDucks !== null) {
//       return JSON.parse(savedDucks) as Duck[];
//     }

//     return [
//       { name: "Karni ", color: " yellow ", age: 3 },
//       { name: " Kitty ", color: " yellow ", age: 4 },
//       { name: " shalom", color: " yellow", age: 7 },
//       { name: " cutie ", color: " yellow ", age: 5 },
//     ];
//   });
//   useEffect(() => {
//     localStorage.setItem("ducks", JSON.stringify(ducks2));
//   }, [ducks2]);
//   const [searchName, setSearchName] = useState("");

//   const filteredDucks = ducks2.filter((duck) =>
//     duck.name.trim().startsWith(searchName.trim()),
//   );

//   useEffect(() => {
//     document.title = `Number of ducks: {ducks2.length}`;
//   }, [ducks2]);

//   return (
//     <div>
//       <SortDucks setducks={setducks} />

//       <Addduck setducks={setducks} />
//       <Ducks1 ducks={ducks2} />
//       <button onClick={() => setducks((ducks) => ducks.slice(0, -1))}>
//         erase last duck
//       </button>
//       {ducks2.map((duck, index) => (
//         <p key={index}>
//           {duck.name} {duck.color} {duck.age}
//         </p>
//       ))}
//       <div>
//         <label>Search a duck </label>
//         <input
//           type="text"
//           value={searchName}
//           onChange={(event) => setSearchName(event.target.value)}
//           placeholder="type a duck name"
//         />
//         {searchName.trim() !== "" && (
//           <ul>
//             {filteredDucks.map((duck, index) => (
//               <li key={index}>{duck.name.trim()}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };
// export default App;
