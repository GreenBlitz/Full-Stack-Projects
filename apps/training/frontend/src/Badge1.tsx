import type { Duck } from "./DuckCard";

export function Badge1({ name, color, age }: Duck) {
  return <span>{name + color + age}</span>;
}
<Badge1 name="cutiePatotie" color="yellow" age={3} />;
