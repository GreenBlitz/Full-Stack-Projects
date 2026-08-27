interface DuckCard{
    DuckName: string
    DuckColor: string
    DuckAge: number
}

export function DuckCard({DuckName,DuckColor,DuckAge}:DuckCard) {
    return  (<span> {DuckName} : {DuckColor} : {DuckAge} </span>)
}
