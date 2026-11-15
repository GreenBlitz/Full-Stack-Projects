// בס"ד
import { useState, type FC } from "react";
import { AddUser } from "./pages/SignUp";
import { Login } from "./pages/LogIn";
import type { PublicUser } from "@repo/polyblitz-types";

export const FrontEndURL = "http://localhost:4590/api";

const App: FC = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  return (
    <>
      <AddUser onSignUp={setUser}></AddUser>
      <Login onLogin={setUser}></Login>
      {user && <p>welcome to polyblitz: {user.name}</p>}
    </>
  );
};

export default App;
