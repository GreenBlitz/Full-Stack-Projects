import type { Duck } from "./DuckCard";

export function RngDuck({ ducks }: { ducks: Duck[] }): Duck | undefined {
    if (ducks.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * ducks.length);
    return ducks[randomIndex];
}