// בס"ד
import { useEffect, useState, type FC } from "react";
import { AddUser } from "./pages/SignUp";
import { Login } from "./pages/LogIn";
import type { PublicUser, Bet } from "@repo/polyblitz-types";
import { Bets } from "./pages/components/Bets";
import axios from "axios";

export const BackendURL = "http://localhost:4590";

const App: FC = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);

  useEffect(() => {
    axios
      .get<Bet[]>(`${BackendURL}/Bet/bets`)
      .then(({ data }) => setBets(data))
      .catch((error: unknown) => {
        console.error("Could not load bets:", error);
      });
  }, []);

  return (
    <>
      <Bets user={user} bets={bets} />
      <AddUser onSignUp={setUser}></AddUser>
      <Login onLogin={setUser}></Login>
      {user && <p>welcome to polyblitz: {user.name}</p>}
    </>
  );
};

export default App;
