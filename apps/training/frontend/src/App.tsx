import { DuckCard } from "./components/DuckCard";

// בס"ד
function App() {
  return (
    <div>
      <DuckCard name="Henry" color="white" age={15}></DuckCard>
      <DuckCard name="Nahum" color="black" age={14}></DuckCard>
      <DuckCard name="Zib" color="yellow" age={46}></DuckCard>
    </div>
  );
}

export default App;
