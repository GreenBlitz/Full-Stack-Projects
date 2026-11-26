import { useEffect, useState } from "react";
import axios from "axios";
import type { User } from "@repo/polyblitz-types";

export function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("http://localhost:4590/api/leaderboard/leaderboard")
      .then((res) => setUsers(res.data.sortedUsers))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <ol>
      {users.map((user) => (
        <li>
          {user.name}: ${user.money}
        </li>
      ))}
    </ol>
  );
}
