
interface DuckCardProps {
    name: string;
    color: string;
    age: number;
}

export function DuckCard(duckCardProp: DuckCardProps){
    return (
        <div className="duckCard">Duck name: {duckCardProp.name}
        Duck color: {duckCardProp.color}
        Duck age: {duckCardProp.age}</div>
    )
}