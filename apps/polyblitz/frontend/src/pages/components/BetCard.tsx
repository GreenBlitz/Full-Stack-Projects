import type { Bet } from "@repo/polyblitz-types";

export function BetCard({
  title,
  description,
  optionOne,
  optionTwo,
  closesAt,
  isPending,
}: Bet) {
  return (
    <article style={{ border: "white", padding: 20 }}>
      {isPending && <h2>{title}</h2>}
      {isPending && <p>{description}</p>}
      {isPending && <p>Option 1: {optionOne.title}</p>}
      {isPending && <p>Option 2: {optionTwo.title}</p>}
      {isPending && <p>Closes: {new Date(closesAt).toLocaleString()}</p>}
      {isPending && <span>Pending</span>}
    </article>
  );
}
