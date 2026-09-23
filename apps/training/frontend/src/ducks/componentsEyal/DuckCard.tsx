export interface Duck{
    DuckName: string
    DuckColor: string
    DuckAge: number
}

export function DuckCard({DuckName,DuckColor,DuckAge}:Duck) {
    return  (<span> {DuckName} : {DuckColor} : {DuckAge} </span>)
}
