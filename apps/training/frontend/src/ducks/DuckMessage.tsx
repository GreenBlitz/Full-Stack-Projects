export type DuckMessageProps = {
    duckNumber: number
}

export function DuckMessage({duckNumber}: DuckMessageProps) {
    return (
        <h2>
            {
                duckNumber > 0
                ? duckNumber < 6
                    ? "all good :)"
                    : "too much :O"
                : "no ducks :("
            }
        </h2>
    )
}