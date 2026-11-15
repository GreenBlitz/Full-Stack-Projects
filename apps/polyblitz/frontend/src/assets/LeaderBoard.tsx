import { useEffect, useState } from "react";
import { fetchLeaderboard, type LeaderboardUser } from "./api";

export function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard()
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <ol>
      {users.map((user) => (
        <li key={user._id}>
          {user.username}: ${user.money}
        </li>
      ))}
    </ol>
  );
}
