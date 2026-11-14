// בס"ד
import { useState, type FC } from "react";
import type { User } from "@repo/polyblitz-types";
import { AddUser } from "./pages/sign_up";
import { Login } from "./pages/log_in";

export type PublicUser = Omit<User, "password">;

const App: FC = () => {
  const [user, setUser] = useState<PublicUser | null>(null);
  return (
    <>
      <AddUser onSignUp={setUser}></AddUser>
      <Login onLogin={setUser}></Login>
      {user && <p>Current user: {user.name}</p>}
    </>
  );
};

export default App;
