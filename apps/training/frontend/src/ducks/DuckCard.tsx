export type Duck = {
    name: string,
    color: string,
    age: number
}

export type DuckCardProps = {
    duck: Duck
}

export function DuckCard({duck}: DuckCardProps) {
    return (
        <div className="duck-card">
            <h4>{duck.name}</h4>
            <p>
                color: {duck.color} <br/>
                age: {duck.age}
            </p>
        </div>
    );
}